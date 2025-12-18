'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Define the window interface to include LolaBot
declare global {
  interface Window {
    LolaBot: {
      mount: (config: any) => void;
    };
  }
}

const PAGE_CONTEXTS: Record<string, string> = {
  '/landing': 'Lolabot Landing Page - Product overview, pricing, and features.',
  '/': 'Home - Main entry point.'
};

export const LolaBotIntegration: React.FC = () => {
  const pathname = usePathname();
  const loadedRef = useRef(false);

  // Load the script once
  useEffect(() => {
    if (loadedRef.current) return;
    
    const scriptId = 'lolabot-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      // Pointing to the public script location in this app
      script.src = '/embed/lolabot.js'; 
      script.async = true;
      document.body.appendChild(script);
      loadedRef.current = true;
    }
  }, []);

  // Update bot context on route change
  useEffect(() => {
    const initBot = () => {
      if (!window.LolaBot) return;

      const path = pathname;
      let pageDescription = PAGE_CONTEXTS[path];
      
      // Fallback for unknown routes
      if (!pageDescription) {
        pageDescription = `Current Page: ${path} - Lolabot Marketing Site`;
      }

      // Handle Guest ID consistency
      let guestId = localStorage.getItem('lolabot_guest_id');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('lolabot_guest_id', guestId);
      }
      const currentUserId = guestId;

      // Prepare context
      const context = {
        page: path,
        description: pageDescription,
        user_id: currentUserId,
        user_role: 'visitor',
        intent: 'Evaluating Lolabot for purchase'
      };

      // Cleanup existing instances to prevent duplicates
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.src && (iframe.src.includes('lolabot'))) {
           iframe.remove();
        }
      });
      
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        // Heuristic cleanup for existing buttons if re-mounting
        if (btn.style.position === 'fixed' && btn.style.bottom === '20px' && btn.style.right === '20px') {
             if (btn.innerHTML.includes('<svg')) {
                 btn.remove();
             }
        }
      });

      // Mount the bot with new context
      try {
        window.LolaBot.mount({
          botId: "lolabot-landing-demo", // TODO: Replace with your actual demo bot ID
          userId: currentUserId,
          baseUrl: "https://realvisionai-lolabot-realvisionai.qj2rlw.easypanel.host", // Self-hosted
          context: context
        });
      } catch (e) {
        console.error("Failed to mount LolaBot:", e);
      }
    };

    // Attempt to init. If script is not loaded yet, wait for it.
    if (window.LolaBot) {
      initBot();
    } else {
      const interval = setInterval(() => {
        if (window.LolaBot) {
          clearInterval(interval);
          initBot();
        }
      }, 500);
      return () => clearInterval(interval);
    }

  }, [pathname]);

  return null;
};

export default LolaBotIntegration;
