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
    <section className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Simple Integration</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Complex AI technology, delivered in a simple package. You don't need a dev team to run this.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.name} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-white/10">
                  <step.icon className="h-8 w-8 text-indigo-400" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-white">
                  {step.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
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

