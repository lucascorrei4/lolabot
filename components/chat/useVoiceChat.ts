import { useState, useRef, useEffect, useCallback } from 'react';

// Define types for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message?: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: ((event: Event) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

// Extend Window interface to include SpeechRecognition
declare global {
    interface Window {
        SpeechRecognition?: new () => SpeechRecognition;
        webkitSpeechRecognition?: new () => SpeechRecognition;
    }
}

interface UseVoiceChatProps {
    oninput: (text: string) => void;
    voice?: string;
}

export function useVoiceChat({ oninput, voice = "pf_dora" }: UseVoiceChatProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isVoiceModeRef = useRef(false);
    const isSpeakingRef = useRef(false);

    // Sync ref with state
    useEffect(() => {
        isSpeakingRef.current = isSpeaking;
    }, [isSpeaking]);

    // Use a ref for the callback to prevent effect re-runs
    const onInputRef = useRef(oninput);

    useEffect(() => {
        onInputRef.current = oninput;
    }, [oninput]);

    // Initialize SpeechRecognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false; // We want it to stop after one sentence/phrase to process
                recognition.interimResults = false;
                recognition.lang = 'pt-BR';

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    const transcript = event.results[0][0].transcript;
                    console.log("Voice Input:", transcript);
                    if (transcript.trim()) {
                        onInputRef.current(transcript);
                    }
                };

                recognition.onend = () => {
                    setIsListening(false);
                    // If we are in voice mode and NOT speaking/processing, we might want to restart?
                    // Actually, we control restart via processQueue completion or manual toggle.
                    // But if it stops due to silence/timeout while IDLE, we want to restart.
                    // However, we want to avoid loop.
                    // For now, let's trust that processQueue restarts it after speech.
                    // And if it times out in silence, the user might need to toggle or we need auto-restart logic here.
                    // Let's leave it simple: if it stops, it stops. 
                    // EXCEPT: if users silence triggers end, we might want to restart if not processing.
                    if (isVoiceModeRef.current && !isCancelledRef.current && !isPlayingQueueRef.current && !isSpeaking) {
                        try {
                            // recognition.start(); // This is dangerous, can cause rapid loops.
                            // Better to let user re-engage or rely on continuous=false implies one-shot.
                        } catch (e) { }
                    }
                };

                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    // Ignore 'aborted' error as it happens during cleanup/manual stop
                    if (event.error === 'aborted') return;

                    // Ignore 'no-speech' error as it's common when user pauses
                    if (event.error === 'no-speech') {
                        setIsListening(false);
                        return;
                    }

                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                    setError(`Voice Error: ${event.error}`);
                };

                recognitionRef.current = recognition;
            } else {
                setError("Browser does not support Speech Recognition");
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []); // Remove oninput dependency since we use onInputRef

    const startListening = useCallback(() => {
        // If already listening, do nothing to avoid 'already started' error
        if (isListening) return;

        setError(null);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e: any) {
                // Ignore "already started" errors, they are benign
                if (e?.name === 'InvalidStateError' || e?.message?.includes('already started')) {
                    console.log("Recognition already started, ignoring.");
                    setIsListening(true); // Ensure state is consistent
                } else {
                    console.error("Error starting recognition:", e);
                }
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    const isCancelledRef = useRef(false);
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingQueueRef = useRef(false);

    const playAudio = useCallback(async (url: string) => {
        setIsSpeaking(true);
        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(url);
        audioRef.current = audio;

        return new Promise<void>((resolve, reject) => {
            audio.onended = () => {
                resolve();
            };
            audio.onerror = (e) => {
                console.error("Audio playback error", e);
                reject(e);
            };
            audio.play().catch(reject);
        });
    }, []);

    const processQueue = useCallback(async () => {
        if (isPlayingQueueRef.current || isCancelledRef.current) return;

        if (audioQueueRef.current.length === 0) {
            setIsSpeaking(false);
            // If finished and still in voice mode, restart listening
            // CRITICAL: Add delay to prevent Echo (hearing itself)
            if (isVoiceModeRef.current && !isCancelledRef.current) {
                setTimeout(() => {
                    // Check again after delay
                    if (isVoiceModeRef.current && !isCancelledRef.current && !isSpeakingRef.current) {
                        startListening();
                    }
                }, 800); // 800ms silence buffer to let echo die
            }
            return;
        }

        isPlayingQueueRef.current = true;
        const nextUrl = audioQueueRef.current.shift(); // Get next audio

        if (nextUrl) {
            try {
                await playAudio(nextUrl);
                URL.revokeObjectURL(nextUrl); // Cleanup after playing
            } catch (e) {
                console.error("Queue playback error", e);
            }
        }

        isPlayingQueueRef.current = false;

        // Add a small delay between chunks for natural pacing
        // 200ms pause makes it sound more like separate sentences
        await new Promise(resolve => setTimeout(resolve, 200));

        processQueue(); // Process next
    }, [playAudio, startListening]);

    const cancel = useCallback(() => {
        isCancelledRef.current = true;
        stopListening();

        // Stop current audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // Clear queue
        audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
        audioQueueRef.current = [];
        isPlayingQueueRef.current = false;

        setIsSpeaking(false);
        isVoiceModeRef.current = false;
    }, [stopListening]);

    const setVoiceMode = useCallback((active: boolean) => {
        isVoiceModeRef.current = active;
        if (!active) {
            cancel();
        } else {
            // Reset cancel state when activating
            isCancelledRef.current = false;
        }
    }, [cancel]);

    // Helper to fetch audio blob
    const fetchTts = async (text: string): Promise<string> => {
        const response = await fetch('https://api.voiceai.bizaigpt.com/v1/audio/speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'kokoro',
                input: text,
                voice: voice,
                response_format: 'mp3',
            }),
        });
        if (!response.ok) throw new Error(`TTS API Error: ${response.statusText}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    const speak = useCallback(async (text: string) => {
        if (!text) return;

        // Reset cancellation on new speak
        isCancelledRef.current = false;

        // CRITICAL: Stop listening immediately to prevent bot hearing itself
        stopListening();

        setIsProcessing(true);

        // If it looks like a URL (pre-generated audio), play directly
        if (text.startsWith('http') || text.startsWith('blob:')) {
            audioQueueRef.current.push(text);
            processQueue();
            setIsProcessing(false);
            return;
        }

        try {
            // Split text into sentences (naively)
            // Match sentences ending in punctuation, or the end of the text
            const sentences = text.match(/[^.?!]+[.?!]+|[^.?!]+$/g) || [text];

            // Limit parallel processing if needed, but for now fetch all
            for (const sentence of sentences) {
                if (isCancelledRef.current) break;
                if (!sentence.trim()) continue;

                // Fetch audio for sentence
                const audioUrl = await fetchTts(sentence.trim());

                if (isCancelledRef.current) {
                    URL.revokeObjectURL(audioUrl);
                    break;
                }

                audioQueueRef.current.push(audioUrl);

                // Start processing queue immediately if not running
                if (!isPlayingQueueRef.current) {
                    setIsSpeaking(true); // Immediate feedback
                    processQueue();
                }
            }
        } catch (err: any) {
            console.error("TTS Error:", err);
            setError(err.message || "Failed to synthesize speech");
            setIsSpeaking(false);
        } finally {
            setIsProcessing(false);
        }
    }, [voice, processQueue]);

    const clearAudioQueue = useCallback(() => {
        isCancelledRef.current = true; // Briefly cancel to stop loops

        // Stop current audio
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Clear queue
        audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
        audioQueueRef.current = [];
        isPlayingQueueRef.current = false;

        // Reset cancel implies we are ready for new input, but here we want to clear for NEW output.
        // So we should reset isCancelledRef immediately after?
        // Actually, speak() resets isCancelledRef. So just stopping everything is enough.
        setIsSpeaking(false);

        // Note: we don't set isVoiceModeRef to false here, unlike cancel()
    }, []);

    return {
        isListening,
        isSpeaking,
        isProcessing,
        error,
        startListening,
        stopListening,
        speak,
        playAudio,
        clearAudioQueue,
        setVoiceMode
    };
}
