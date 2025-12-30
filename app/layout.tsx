import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizAI Agent Intelligence",
  description: "AI-powered sales agent for your website",
  icons: {
    icon: '/assets/img/favicon.png',
  },
};

// Aggressive chunk error handling - catches errors BEFORE React error boundary
// This ensures users never see an error page, just a quick refresh
const chunkErrorHandler = `
(function() {
  var hasReloaded = sessionStorage.getItem('chunk_reload');
  
  // Catch synchronous errors
  window.addEventListener('error', function(e) {
    var msg = e.message || '';
    var isChunkError = msg.indexOf('ChunkLoadError') > -1 ||
      msg.indexOf('Loading chunk') > -1 ||
      msg.indexOf('Failed to fetch dynamically imported module') > -1 ||
      msg.indexOf('Unexpected token') > -1 ||
      (e.filename && e.filename.indexOf('/_next/') > -1);
    
    if (isChunkError && !hasReloaded) {
      sessionStorage.setItem('chunk_reload', '1');
      window.location.reload();
      return;
    }
  }, true);
  
  // Catch promise rejections (dynamic imports)
  window.addEventListener('unhandledrejection', function(e) {
    var reason = e.reason || {};
    var msg = reason.message || reason.toString() || '';
    var isChunkError = msg.indexOf('ChunkLoadError') > -1 ||
      msg.indexOf('Loading chunk') > -1 ||
      msg.indexOf('Failed to fetch dynamically imported module') > -1 ||
      msg.indexOf('Failed to load') > -1;
    
    if (isChunkError && !hasReloaded) {
      sessionStorage.setItem('chunk_reload', '1');
      e.preventDefault();
      window.location.reload();
      return;
    }
  }, true);
  
  // Clear the reload flag after successful page load
  window.addEventListener('load', function() {
    setTimeout(function() {
      sessionStorage.removeItem('chunk_reload');
    }, 3000);
  });
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Must be first script to catch errors before React loads */}
        <script dangerouslySetInnerHTML={{ __html: chunkErrorHandler }} />
      </head>
      <body>{children}</body>
    </html>
  );
}



