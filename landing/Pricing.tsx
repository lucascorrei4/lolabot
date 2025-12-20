import { CheckIcon } from '@heroicons/react/20/solid';

const includedFeatures = [
  'Custom BizAI Agent Configuration',
  'Context-Aware Integration',
  'Real-time Sentiment Analysis',
  'Emergency Notification System',
  'Briefing Summaries',
  'Unlimited Conversations',
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-gray-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Simple Pricing</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Get started with a plan that fits
          </p>
        </div>
        <div className="mx-auto mt-10 sm:mt-16 lg:mt-20 max-w-2xl rounded-2xl sm:rounded-3xl ring-1 ring-white/10 bg-white/5 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-5 sm:p-8 lg:p-10 lg:flex-auto">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Full Service Implementation</h3>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-6 sm:leading-7 text-gray-400">
              Our team sets up everything based on your specific business needs, policies, and rules. We create a strong context to ensure the AI helps your clients effectively.
            </p>
            <div className="mt-8 sm:mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-xs sm:text-sm font-semibold leading-6 text-indigo-400">What's included</h4>
              <div className="h-px flex-auto bg-white/10" />
            </div>
            <ul
              role="list"
              className="mt-6 sm:mt-8 grid grid-cols-1 gap-3 sm:gap-4 text-xs sm:text-sm leading-6 text-gray-300 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-2 sm:gap-x-3">
                  <CheckIcon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-xl sm:rounded-2xl bg-gray-900/50 py-8 sm:py-10 text-center ring-1 ring-inset ring-white/10 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-6 sm:px-8">
                <p className="text-sm sm:text-base font-semibold text-gray-400">Initial Setup & Configuration</p>
                <p className="mt-4 sm:mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">$997</span>
                  <span className="text-xs sm:text-sm font-semibold leading-6 tracking-wide text-gray-400">USD</span>
                </p>
                <p className="mt-2 text-[10px] sm:text-xs leading-5 text-gray-500">one-time payment</p>

                <div className="mt-6 sm:mt-8 border-t border-white/10 pt-6 sm:pt-8">
                  <p className="text-sm sm:text-base font-semibold text-gray-400">Monthly Support & Maintenance</p>
                  <p className="mt-3 sm:mt-4 flex items-baseline justify-center gap-x-2">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">$199</span>
                    <span className="text-xs sm:text-sm font-semibold leading-6 tracking-wide text-gray-400">/mo</span>
                  </p>
                </div>

                <a
                  href="#"
                  className="mt-8 sm:mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2.5 sm:py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get Access
                </a>
                <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs leading-5 text-gray-500">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
