import { ChatBubbleLeftRightIcon, CpuChipIcon, ShieldExclamationIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Context Awareness',
    description:
      'LolaBot Intelligence doesn\'t just chat; it understands. It uses the specific context of the page your visitor is viewing to provide relevant, accurate answers instantly.',
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
      'Never miss a critical issue. Lolabot detects user sentiment and sends emergency notifications when a customer is frustrated or needs immediate human attention.',
    icon: ShieldExclamationIcon,
  },
  {
    name: 'Universal Embed',
    description:
      'Works everywhere. Encapsulate LolaBot Intelligence in any page or tool. It seamlessly integrates with your existing workflow and tools.',
    icon: GlobeAltIcon,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-gray-900 py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Deploy Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to support your customers
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            LolaBot Intelligence is not just another chatbot. It's a smart agent designed to help small and medium businesses scale their support with AI that actually understands their business.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-white/10">
                    <feature.icon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
