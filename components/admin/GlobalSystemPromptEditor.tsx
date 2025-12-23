'use client';

import { useState, useEffect } from 'react';
import { CommandLineIcon, CheckIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface GlobalSystemPromptEditorProps {
    initialValue: string;
}

export function GlobalSystemPromptEditor({ initialValue }: GlobalSystemPromptEditorProps) {
    const [value, setValue] = useState(initialValue);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setHasChanges(value !== initialValue);
    }, [value, initialValue]);

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        setSaveStatus('idle');

        try {
            const response = await fetch('/api/global-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'default_system_prompt',
                    value,
                    description: 'Default system prompt applied to all bots. Contains tools, triggers, and global instructions.',
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save');
            }

            setSaveStatus('success');
            setHasChanges(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err: any) {
            setError(err.message);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                        <CommandLineIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-base lg:text-lg font-semibold text-white">Default System Prompt</h2>
                        <p className="text-xs text-gray-500">Global instructions applied to ALL bots</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {saveStatus === 'success' && (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                            <CheckIcon className="h-4 w-4" /> Saved
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                            <ExclamationCircleIcon className="h-4 w-4" /> {error}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2
                            ${hasChanges
                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isSaving ? (
                            <>
                                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-1">
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        rows={25}
                        placeholder="# System Prompt for LolaBot&#10;&#10;Enter the default system prompt here. This will be applied to all bots as the base configuration.&#10;&#10;Include:&#10;- Role definition&#10;- Tool instructions&#10;- Trigger scenarios&#10;- Conversation guidelines"
                        className="w-full bg-transparent text-sm text-gray-300 font-mono leading-relaxed resize-none focus:outline-none p-4"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
                    <span>{value.length.toLocaleString()} characters</span>
                    <span>
                        {hasChanges ? (
                            <span className="text-amber-400">Unsaved changes</span>
                        ) : (
                            'All changes saved'
                        )}
                    </span>
                </div>
            </div>

            <div className="mt-4 p-3 bg-gray-950 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500">
                    <span className="font-semibold text-purple-400">How it works:</span> This prompt is combined with each bot's individual system prompt.
                    The global prompt provides the foundation (tools, triggers, guidelines), while per-bot prompts add specific context and customization.
                </p>
            </div>
        </div>
    );
}
