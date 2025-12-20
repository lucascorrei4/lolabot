import React from 'react';

const LOGOS = [
    {
        name: "TechFlow",
        svg: (
            <svg className="h-8 text-gray-400" viewBox="0 0 100 30" fill="currentColor">
                <path d="M10,15 L20,5 L30,15 L20,25 Z M35,5 H90 V25 H35 Z" />
            </svg>
        )
    },
    {
        name: "SaaSify",
        svg: (
            <svg className="h-8 text-gray-400" viewBox="0 0 100 30" fill="currentColor">
                <circle cx="15" cy="15" r="10" />
                <rect x="35" y="8" width="50" height="14" />
            </svg>
        )
    },
    {
        name: "GlobalWire",
        svg: (
            <svg className="h-8 text-gray-400" viewBox="0 0 100 30" fill="currentColor">
                <path d="M10,5 L20,25 L30,5 M40,5 H90 V10 H40 Z M40,20 H90 V25 H40 Z" />
            </svg>
        )
    },
    {
        name: "NextLevel",
        svg: (
            <svg className="h-8 text-gray-400" viewBox="0 0 100 30" fill="currentColor">
                <rect x="10" y="5" width="20" height="20" />
                <rect x="40" y="5" width="20" height="20" />
                <rect x="70" y="5" width="20" height="20" />
            </svg>
        )
    }
];

export const SocialProof: React.FC = () => {
    return (
        <section className="bg-gray-900 py-12 border-b border-white/5">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <p className="text-center text-sm font-semibold leading-8 text-gray-400 mb-8">
                    TRUSTED BY INNOVATIVE TEAMS
                </p>
                <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                    {LOGOS.map((logo, index) => (
                        <div key={index} className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                            {/* Placeholder SVGs for realistic effect */}
                            <div className="h-12 w-auto flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                                {logo.svg}
                                <span className="ml-2 font-bold text-xl text-gray-400">{logo.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
