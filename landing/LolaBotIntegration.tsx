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
  '/landing': 'LolaBot Intelligence Landing Page - Product overview, pricing, and features.',
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
        intent: 'Evaluating LolaBot Intelligence for purchase'
      };

      // Cleanup existing instances to prevent duplicates
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.src && (iframe.src.includes('lolabot') || iframe.src.includes('/chat/'))) {
          iframe.remove();
        }
      });

      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        // Heuristic cleanup for existing launcher buttons
        const style = window.getComputedStyle(btn);
        // Check if it's a fixed position button in the bottom-right corner (our launcher)
        if (style.position === 'fixed' &&
          (btn.style.bottom === '24px' || btn.style.bottom === '20px') &&
          (btn.style.right === '24px' || btn.style.right === '20px')) {
          if (btn.innerHTML.includes('<svg') || btn.innerHTML.includes('svg')) {
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

    // Active Invite: Auto-open the bot after delay
    useEffect(() => {
      // Only auto-open once per session to avoid annoyance
      const hasOpened = sessionStorage.getItem('lolabot_auto_opened');
      if (hasOpened) return;

      const timer = setTimeout(() => {
        // Find the launcher button based on the styles the cleanup script identified
        // We look for a fixed button at the bottom right
        const buttons = document.querySelectorAll('button');
        let launcherBtn: HTMLButtonElement | null = null;

        buttons.forEach(btn => {
          const style = window.getComputedStyle(btn);
          if (style.position === 'fixed' && style.bottom !== 'auto' && style.right !== 'auto') {
            // Likely the launcher
            launcherBtn = btn;
          }
        });

        if (launcherBtn) {
          (launcherBtn as HTMLButtonElement).click();
          sessionStorage.setItem('lolabot_auto_opened', 'true');
        }
      }, 3500); // 3.5s delay

      return () => clearTimeout(timer);
    }, []);

  }, [pathname]);

  return null;
};

export default LolaBotIntegration;
