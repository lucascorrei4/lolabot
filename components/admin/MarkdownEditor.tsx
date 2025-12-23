'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    EyeIcon,
    PencilSquareIcon,
    ViewColumnsIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

type ViewMode = 'edit' | 'preview' | 'split';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    minHeight?: string;
    title?: string;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder = 'Enter markdown content...',
    disabled = false,
    minHeight = '300px',
    title = 'Markdown Editor',
}: MarkdownEditorProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [isFullscreen, setIsFullscreen] = useState(false);

    const viewModes = [
        { mode: 'edit' as ViewMode, icon: PencilSquareIcon, label: 'Edit' },
        { mode: 'split' as ViewMode, icon: ViewColumnsIcon, label: 'Split' },
        { mode: 'preview' as ViewMode, icon: EyeIcon, label: 'Preview' },
    ];

    // Handle ESC key to close fullscreen
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
            setIsFullscreen(false);
        }
    }, [isFullscreen]);

    useEffect(() => {
        if (isFullscreen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isFullscreen, handleKeyDown]);

    const editorContent = (fullscreen: boolean) => (
        <div className={`flex ${viewMode === 'split' ? 'divide-x divide-gray-700' : ''} flex-1`}>
            {/* Editor */}
            {(viewMode === 'edit' || viewMode === 'split') && (
                <div className={viewMode === 'split' ? 'w-1/2 flex flex-col' : 'w-full flex flex-col'}>
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={`w-full flex-1 bg-transparent text-gray-200 font-mono text-sm p-4 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${fullscreen ? 'text-base' : ''}`}
                        style={fullscreen ? undefined : { minHeight }}
                        autoFocus={fullscreen}
                    />
                </div>
            )}

            {/* Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
                <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} overflow-auto bg-gray-900/50`}>
                    {value ? (
                        <div className={`p-4 prose prose-invert max-w-none
                            prose-headings:text-gray-200 prose-headings:font-semibold prose-headings:border-b prose-headings:border-gray-700 prose-headings:pb-2
                            prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                            prose-p:text-gray-300 prose-p:leading-relaxed
                            prose-li:text-gray-300
                            prose-strong:text-white prose-strong:font-semibold
                            prose-em:text-gray-300 prose-em:italic
                            prose-code:text-indigo-400 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg
                            prose-blockquote:border-l-indigo-500 prose-blockquote:text-gray-400 prose-blockquote:bg-gray-800/50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r
                            prose-ul:list-disc prose-ol:list-decimal
                            prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                            prose-hr:border-gray-700
                            ${fullscreen ? 'prose-base' : 'prose-sm'}
                        `}>
                            <ReactMarkdown>{value}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="p-4 text-gray-500 text-sm italic">
                            Preview will appear here...
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const toolbar = (fullscreen: boolean) => (
        <div className={`flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-800/50 ${fullscreen ? 'px-4 py-3' : ''}`}>
            <div className="flex items-center gap-2">
                {fullscreen && (
                    <h3 className="text-base font-semibold text-white mr-4">{title}</h3>
                )}
                <span className={`text-gray-500 ${fullscreen ? 'text-sm' : 'text-xs'}`}>Markdown</span>
            </div>

            <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-900 rounded-lg p-0.5 border border-gray-700">
                    {viewModes.map(({ mode, icon: Icon, label }) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${fullscreen ? 'text-sm' : 'text-xs'
                                } ${viewMode === mode
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            title={label}
                        >
                            <Icon className={fullscreen ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Fullscreen Toggle */}
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${fullscreen
                            ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600'
                        } ${fullscreen ? 'text-sm' : 'text-xs'}`}
                    title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Editor'}
                >
                    {isFullscreen ? (
                        <>
                            <ArrowsPointingInIcon className={fullscreen ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
                            <span className="hidden sm:inline">Exit</span>
                        </>
                    ) : (
                        <>
                            <ArrowsPointingOutIcon className={fullscreen ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
                            <span className="hidden sm:inline">Fullscreen</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const footer = (fullscreen: boolean) => (
        <div className={`flex items-center justify-between border-t border-gray-700 bg-gray-800/30 ${fullscreen ? 'px-4 py-2' : 'px-3 py-1.5'}`}>
            <div className={`flex items-center gap-3 text-gray-500 ${fullscreen ? 'text-sm' : 'text-xs'}`}>
                <span>{value.length} characters</span>
                <span>•</span>
                <span>{value.split(/\s+/).filter(Boolean).length} words</span>
                <span>•</span>
                <span>{value.split('\n').length} lines</span>
            </div>
            <div className="flex items-center gap-4">
                {fullscreen && (
                    <span className="text-xs text-gray-600">Press ESC to exit fullscreen</span>
                )}
                <a
                    href="https://www.markdownguide.org/basic-syntax/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-indigo-400 hover:text-indigo-300 transition-colors ${fullscreen ? 'text-sm' : 'text-xs'}`}
                >
                    Markdown Guide ↗
                </a>
            </div>
        </div>
    );

    return (
        <>
            {/* Normal Editor */}
            <div className="rounded-lg border border-gray-700 overflow-hidden bg-gray-900">
                {toolbar(false)}
                <div style={{ minHeight }}>
                    {editorContent(false)}
                </div>
                {footer(false)}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm flex flex-col">
                    {/* Close button in corner */}
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800/80 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-all z-10"
                        title="Close (Esc)"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>

                    {/* Fullscreen Editor Container */}
                    <div className="flex-1 m-4 lg:m-8 rounded-2xl border border-gray-700 bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
                        {toolbar(true)}
                        <div className="flex-1 flex overflow-hidden">
                            {editorContent(true)}
                        </div>
                        {footer(true)}
                    </div>
                </div>
            )}
        </>
    );
}
