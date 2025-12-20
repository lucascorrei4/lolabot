import { CodeBracketSquareIcon, ChatBubbleBottomCenterTextIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    name: 'Encapsulation',
    description: 'We encapsulate the bot logic within your specific page context. Just add one line of code to your site.',
    icon: CodeBracketSquareIcon,
  },
  {
    name: 'Contextual Learning',
    description: 'The bot reads your page content and business rules instantly, understanding exactly what you offer.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: 'Active Defense',
    description: 'It starts engaging visitors, answering queries, and alerting you only when it matters.',
    icon: RocketLaunchIcon,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Simple Integration</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white lg:text-4xl">
            How It Works
          </p>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-400">
            Complex AI technology, delivered in a simple package. You don't need a dev team to run this.
          </p>
        </div>
        <div className="mx-auto mt-12 sm:mt-16 lg:mt-24 max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 sm:gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.name} className="flex flex-col items-center text-center">
                <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-indigo-500/10 ring-1 ring-white/10">
                  <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" aria-hidden="true" />
                </div>
                <dt className="text-lg sm:text-xl font-semibold leading-7 text-white">
                  {step.name}
                </dt>
                <dd className="mt-2 sm:mt-4 flex flex-auto flex-col text-sm sm:text-base leading-6 sm:leading-7 text-gray-400">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

