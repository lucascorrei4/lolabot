export function Story() {
  return (
    <section className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-start">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-indigo-400">The Problem</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Your Website is Leaking Leads
                </h2>
                <p className="mt-6 text-xl leading-8 text-gray-300">
                  You spend thousands on ads and SEO to get traffic. But when visitors arrive, they're greeted by... silence. Or worse, a dumb chatbot that forces them through a generic menu.
                </p>
                <div className="mt-8 space-y-8 text-base leading-7 text-gray-400">
                  <p>
                    Visitors have questions *now*. They are on a specific page, looking at a specific product, and they want answers in context. If they have to hunt for a contact form or wait for an email reply, they're gone.
                  </p>
                  <p>
                    <strong className="text-white">But human support is expensive.</strong> You can't have a team watching every visitor 24/7. And standard AI bots are risky—they hallucinate, promise things they shouldn't, and frustrate users.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-indigo-400">The Solution</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Enter the Context-Aware Agent
                </h2>
                <p className="mt-6 text-xl leading-8 text-gray-300">
                  Lolabot isn't just a chatbot. It's an intelligent agent that lives on your page and understands what your user is looking at.
                </p>
                <div className="mt-8 space-y-8 text-base leading-7 text-gray-400">
                  <p>
                    Imagine an agent that knows your business rules, follows your strict policies, and can detect when a user is frustrated—escalating them to you immediately with a full briefing of the conversation.
                  </p>
                  <p>
                    We built Lolabot to bridge the gap between "dumb FAQs" and expensive human support. It gives your visitors the immediate, accurate help they crave, while giving you the peace of mind that your brand is safe.
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-gray-400">
                    <li className="flex gap-x-3">
                      <span className="text-indigo-400">✓</span> 
                      Increases conversion by answering doubts instantly.
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-indigo-400">✓</span> 
                      Reduces support ticket volume by 70%.
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-indigo-400">✓</span> 
                      Captures leads that would have bounced.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

