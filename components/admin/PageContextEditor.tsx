'use client';

import { useState } from 'react';
import {
    PlusIcon,
    TrashIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';

interface PageContextEditorProps {
    value: Record<string, string>;
    onChange: (value: Record<string, string>) => void;
}

export function PageContextEditor({ value, onChange }: PageContextEditorProps) {
    const [newPath, setNewPath] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const entries = Object.entries(value || {});

    const handleAdd = () => {
        if (!newPath.trim()) return;

        const path = newPath.startsWith('/') ? newPath.trim() : `/${newPath.trim()}`;
        onChange({
            ...value,
            [path]: newDescription.trim() || `Page: ${path}`,
        });
        setNewPath('');
        setNewDescription('');
    };

    const handleRemove = (path: string) => {
        const newValue = { ...value };
        delete newValue[path];
        onChange(newValue);
    };

    const handleUpdateDescription = (path: string, description: string) => {
        onChange({
            ...value,
            [path]: description,
        });
    };

    return (
        <div className="space-y-4">
            {/* Existing Entries */}
            {entries.length > 0 ? (
                <div className="space-y-3">
                    {entries.map(([path, description]) => (
                        <div
                            key={path}
                            className="bg-gray-900/50 rounded-lg border border-gray-700 p-3"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <MapPinIcon className="w-4 h-4 text-cyan-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <code className="text-sm font-mono text-cyan-400 bg-gray-800 px-2 py-0.5 rounded">
                                            {path}
                                        </code>
                                        <button
                                            onClick={() => handleRemove(path)}
                                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                            title="Remove"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <textarea
                                        value={description}
                                        onChange={(e) => handleUpdateDescription(path, e.target.value)}
                                        rows={2}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                        placeholder="Describe what this page is about and what context the AI should know..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                    <MapPinIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No page contexts defined yet.</p>
                    <p className="text-xs mt-1">Add contexts to help the AI understand your website pages.</p>
                </div>
            )}

            {/* Add New Entry */}
            <div className="bg-gray-800/30 rounded-lg border border-dashed border-gray-600 p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Add New Page Context
                </h4>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Page Path (e.g., /pricing, /dashboard, /products/*)
                        </label>
                        <input
                            type="text"
                            value={newPath}
                            onChange={(e) => setNewPath(e.target.value)}
                            placeholder="/your-page-path"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Context Description
                        </label>
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={2}
                            placeholder="Describe what this page is about, what the user might be looking for, and what information the AI should have..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={!newPath.trim()}
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Page Context
                    </button>
                </div>
            </div>

            {/* Usage Hint */}
            <div className="bg-gray-900/30 rounded-lg p-3 text-xs text-gray-500">
                <p className="font-medium text-gray-400 mb-1">How it works:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>When a user visits a page, the matching context is sent to the AI</li>
                    <li>Use exact paths like <code className="text-cyan-400">/pricing</code> or wildcards like <code className="text-cyan-400">/products/*</code></li>
                    <li>Include relevant information about the page purpose, available actions, and user intent</li>
                </ul>
            </div>
        </div>
    );
}
