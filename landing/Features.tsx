import { ChatBubbleLeftRightIcon, CpuChipIcon, ShieldExclamationIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Context Awareness',
    description:
      'BizAI Agent Intelligence doesn\'t just chat; it understands. It uses the specific context of the page your visitor is viewing to provide relevant, accurate answers instantly.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'BizAI Agent',
    description:
      'Get intelligent briefing summaries of every conversation. Our BizAI agent analyzes interactions to give you the insights you need without reading every log.',
    icon: CpuChipIcon,
  },
  {
    name: 'Emergency Alerts',
    description:
      'Never miss a critical issue. BizAI Agent detects user sentiment and sends emergency notifications when a customer is frustrated or needs immediate human attention.',
    icon: ShieldExclamationIcon,
  },
  {
    name: 'Universal Embed',
    description:
      'Works everywhere. Encapsulate BizAI Agent Intelligence in any page or tool. It seamlessly integrates with your existing workflow and tools.',
    icon: GlobeAltIcon,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-gray-900 py-16 sm:py-24 lg:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Deploy Faster</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Everything you need to support your customers
          </p>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-400">
            BizAI Agent Intelligence is not just another chatbot. It's a smart agent designed to help small and medium businesses scale their support with AI that actually understands their business.
          </p>
        </div>
        <div className="mx-auto mt-12 sm:mt-16 lg:mt-24 max-w-2xl lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-14 sm:pl-16">
                <dt className="text-sm sm:text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-white/10">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-sm sm:text-base leading-6 sm:leading-7 text-gray-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
