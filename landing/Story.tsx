export function Story() {
  return (
    <section className="bg-gray-900 py-16 sm:py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:gap-16 lg:grid-cols-2 items-center">
          {/* Problem */}
          <div className="order-2 lg:order-1">
            <p className="text-sm text-red-400 font-semibold uppercase tracking-wider">The Problem</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Your Website Is Silent</h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-400 leading-relaxed">
              Your potential customers land on your website. They have questions.
              They look around for a quick answer, but they can't navigate your documentation.
              So they leave. Another opportunity lost.
            </p>
          </div>
          {/* Solution */}
          <div className="order-1 lg:order-2">
            <p className="text-sm text-green-400 font-semibold uppercase tracking-wider">The Solution</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">A Smart Agent That Gets Them</h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-400 leading-relaxed">
              Imagine a knowledgeable assistant that understands the specific page your visitor is on.
              It answers questions instantly, guides them to the right resource, and gets out of the way when they no longer need help.
              That's LolaBot Intelligence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
