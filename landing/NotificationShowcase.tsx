import { EmailPreview } from './EmailPreview';
import { EnvelopeOpenIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export function NotificationShowcase() {
  return (
    <section className="bg-gray-900 py-24 sm:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
                BizAI Agent Intel
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6 leading-tight">
              Don't Read Logs.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                Get Actionable Intelligence.
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              LolaBot Intelligence doesn't just chat; it analyzes. When a conversation matters, you get a clean, structured email notification with everything you need to know to close the deal or solve the issue.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-none flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-white/10">
                  <ChartBarIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Sentiment Analysis</h3>
                  <p className="text-gray-400 text-sm mt-1">Know instantly if the user is happy, frustrated, or ready to buy before you even open the chat.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-none flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-white/10">
                  <SparklesIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Instant Briefings</h3>
                  <p className="text-gray-400 text-sm mt-1">Our BizAI summarizes the entire conversation into a few bullet points. Get the "TL;DR" delivered to your inbox.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-none flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 ring-1 ring-white/10">
                  <EnvelopeOpenIcon className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Recommended Actions</h3>
                  <p className="text-gray-400 text-sm mt-1">The AI suggests the next best step based on the context, helping you react faster and smarter.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end perspective-1000">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 blur-2xl rounded-full" />
            <div className="transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-0">
              <EmailPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

