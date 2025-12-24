'use client';
import Link from "next/link";
import { BackgroundAnimation } from "./BackgroundAnimation";
import { BriefingShowcase } from "./BriefingShowcase";

export function Hero() {
  const openChat = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic to find and click the chat launcher
    // We look for a fixed button at the bottom right which is the standard Lolabot launcher position
    const buttons = document.querySelectorAll('button');
    let launcherBtn: HTMLButtonElement | null = null;

    buttons.forEach(btn => {
      const style = window.getComputedStyle(btn);
      // Heuristic to find the floating action button (launcher)
      if (style.position === 'fixed' && style.bottom !== 'auto' && style.right !== 'auto') {
        launcherBtn = btn;
      }
    });

    if (launcherBtn) {
      (launcherBtn as HTMLButtonElement).click();
    } else {
      console.warn("Lolabot launcher not found");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gray-900 pt-12 sm:pt-16 pb-20 sm:pb-32 space-y-16 sm:space-y-24">
      {/* Animated Technical Background */}
      <BackgroundAnimation />

      {/* Background gradients - kept for depth but adjusted z-index */}
      <div className="absolute top-0 inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl opacity-40" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="relative isolate px-4 sm:px-6 pt-8 sm:pt-14 lg:px-8 z-10">
        <div className="mx-auto max-w-2xl py-16 sm:py-32 text-center relative">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300 backdrop-blur-sm bg-gray-900/40">
              Announcing our new BizAI Agent.{' '}
              <a href="#features" className="font-semibold text-indigo-400 hover:text-indigo-300">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Animated Brand Title */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative group cursor-default">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 ring-1 ring-white/10 rounded-lg leading-none flex items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-indigo-400 to-purple-500 font-mono font-bold tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm animate-text-shimmer bg-[size:200%_auto]">
                  LOLABOT <i className="text-indigo-400">REVENUE</i> INTELLIGENCE
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-sm px-2">
            Remove Your Contact Form Immediately
          </h1>
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-indigo-400 px-4">
            "Hmm, another chatbot... but wait, they mention 'revenue intelligence'?"
          </p>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-300 max-w-xl mx-auto backdrop-blur-[2px] px-4">
            LolaBot is an AI Assistant That Talks, Thinks & Sends You Smart Briefings. It engages visitors 24/7, understands context,
            and <span className="text-white font-semibold">notifies you with instant briefings</span> with
            sentiment analysis, urgency detection, and recommended actions—so you never miss a lead.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 mb-4 relative z-20 px-4">
            <a
              href="#pricing"
              className="w-full sm:w-auto text-center relative rounded-full bg-indigo-600 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300"
            >
              Get Started
            </a>
            <button
              onClick={openChat}
              className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors flex items-center gap-2 group"
            >
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              Test Live Demo <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Connection Shockwave Animation - Hidden on very small screens */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[40%] w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] lg:w-[800px] -z-10 pointer-events-none opacity-60 sm:opacity-80 hidden xs:block">
            <svg className="w-full h-full" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="beam-grad" x1="400" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="0" />
                  <stop offset="20%" stopColor="#4ade80" stopOpacity="0.5" />
                  <stop offset="80%" stopColor="#818cf8" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Paths connecting button area to showcase corners */}
              <path d="M400,20 Q400,150 200,280" stroke="url(#beam-grad)" strokeWidth="1.5" className="opacity-30" />
              <path d="M400,20 Q400,150 600,280" stroke="url(#beam-grad)" strokeWidth="1.5" className="opacity-30" />
              <path d="M400,20 L400,280" stroke="url(#beam-grad)" strokeWidth="1.5" className="opacity-50" strokeDasharray="4 4" />

              {/* New Brand Title */}
              <text x="400" y="250" textAnchor="middle" fill="#a5b4fc" fontSize="12" letterSpacing="0.3em" fontWeight="bold" filter="url(#glow)" className="uppercase font-mono">
                Lolabot Intelligence
                <animate attributeName="opacity" values="0.4;1;0.4" dur="4s" repeatCount="indefinite" />
              </text>

              {/* Animated pulses */}
              <circle r="2" fill="#4ade80" filter="url(#glow)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M400,20 Q400,150 200,280" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
              </circle>

              <circle r="2" fill="#4ade80" filter="url(#glow)">
                <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.8s" path="M400,20 Q400,150 600,280" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
              </circle>

              <circle r="2" fill="#6366f1" filter="url(#glow)">
                <animateMotion dur="2s" repeatCount="indefinite" begin="0.4s" path="M400,20 L400,280" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Impact ripples at the bottom */}
              <g transform="translate(200, 280)">
                <circle r="0" stroke="#818cf8" strokeWidth="1" opacity="0">
                  <animate attributeName="r" values="0;20" dur="2s" begin="2.3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="2s" begin="2.3s" repeatCount="indefinite" />
                </circle>
              </g>
              <g transform="translate(600, 280)">
                <circle r="0" stroke="#818cf8" strokeWidth="1" opacity="0">
                  <animate attributeName="r" values="0;20" dur="2s" begin="3.1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="2s" begin="3.1s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>

        </div>
        <BriefingShowcase type="success" />
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

    </section>
  );
}
