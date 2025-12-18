export function EmailPreview() {
  return (
    <div className="rounded-lg overflow-hidden shadow-2xl max-w-md mx-auto font-sans text-left bg-white relative z-10 transform transition-transform hover:scale-[1.02] duration-300">
      {/* Header */}
      <div className="bg-[#1a202c] p-6 text-white border-b border-gray-800">
        <h3 className="text-xl font-bold text-white">New Lead Detected: Enterprise Opportunity</h3>
        <p className="text-xs text-gray-400 mt-1">AI Agent Notification • Just now</p>
      </div>
      
      {/* Body */}
      <div className="p-6 space-y-6 bg-white">
        {/* User Context */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">User Context</h4>
          <dl className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
            <dt className="text-gray-500 font-medium">User Name</dt>
            <dd className="font-semibold text-gray-900">Sarah Jenkins</dd>
            
            <dt className="text-gray-500 font-medium">Email</dt>
            <dd className="font-semibold text-blue-600 cursor-pointer hover:underline">sarah.j@growth-agency.com</dd>
            
            <dt className="text-gray-500 font-medium">Detected Sentiment</dt>
            <dd className="font-medium text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              High Interest
            </dd>
            
            <dt className="text-gray-500 font-medium">Topic Category</dt>
            <dd className="font-semibold text-gray-900">Sales / Pricing</dd>
          </dl>
        </div>

        {/* Conversation Briefing */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Conversation Briefing</h4>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
            <p className="text-sm text-gray-700 leading-relaxed">
              User visited the Pricing page and asked specifically about "White Label" options for her agency clients. She confirmed they manage 20+ client sites and are looking to switch tools this month.
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="flex flex-col gap-1">
           <span className="text-gray-500 text-sm font-medium">Recommended Action</span>
           <span className="font-bold text-blue-600 text-sm">Send "Agency Partner" deck and offer a demo call.</span>
        </div>

        {/* Button */}
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 mt-4">
          <button className="bg-[#1a202c] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg">
            Open Live Chat
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-mono">Link ID: 8f9e2d...7a1b</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a202c] p-4 text-center border-t border-gray-800">
        <p className="text-[10px] text-gray-500">© {new Date().getFullYear()} • Automatically generated notification</p>
      </div>
    </div>
  );
}

