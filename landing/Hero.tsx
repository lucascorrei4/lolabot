import Link from "next/link";
import { BackgroundAnimation } from "./BackgroundAnimation";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-900 pt-16 pb-32 space-y-24">
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

      <div className="relative isolate px-6 pt-14 lg:px-8 z-10">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300 backdrop-blur-sm bg-gray-900/40">
              Announcing our new BizAI Agent.{' '}
              <a href="#features" className="font-semibold text-indigo-400 hover:text-indigo-300">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
            Transform Your Website with Lolabot
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-xl mx-auto backdrop-blur-[2px]">
            The Smart AI Agent that talks with your leads using the specific context of your page. 
            Get briefing summaries, sentiment analysis, and emergency alerts instantly.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#pricing"
              className="relative rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300"
            >
              Get Started
            </a>
            <a href="#how-it-works" className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors">
              How it works <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
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
