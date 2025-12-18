export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {/* Add social links here if needed */}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} Lolabot, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
