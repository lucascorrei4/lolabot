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

// Function to get page metadata from DOM
const getPageMetadata = () => {
  // Get page title (remove site suffix if present)
  let title = document.title || '';
  // Remove common suffixes like " | LolaBot" or " - LolaBot"
  title = title.replace(/\s*[|\-–—]\s*LolaBot\s*$/i, '').trim();

  // Get meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  const description = metaDescription?.getAttribute('content') || '';

  // Get canonical URL if available
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = canonicalLink?.getAttribute('href') || '';

  // Get OG title if main title is empty
  if (!title) {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    title = ogTitle?.getAttribute('content') || '';
  }

  // Get OG description if meta description is empty
  let fullDescription = description;
  if (!fullDescription) {
    const ogDescription = document.querySelector('meta[property="og:description"]');
    fullDescription = ogDescription?.getAttribute('content') || '';
  }

  return { title, description: fullDescription, canonicalUrl };
};

// Detect page type from path
const getPageType = (path: string): string => {
  if (path === '/') return 'home';
  if (path === '/landing') return 'landing';
  if (path === '/blog') return 'blog_listing';
  if (path.startsWith('/blog/category/')) return 'blog_category';
  if (path.startsWith('/blog/')) return 'blog_article';
  if (path.startsWith('/compare/')) return 'comparison';
  return 'page';
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
      // Prevent auto-init since we'll mount programmatically with correct baseUrl
      script.setAttribute('data-no-auto-init', 'true');
      document.body.appendChild(script);
      loadedRef.current = true;
    }
  }, []);

  // Update bot context on route change
  useEffect(() => {
    const initBot = () => {
      if (!window.LolaBot) return;

      // Small delay to ensure meta tags are rendered (especially for dynamic pages)
      setTimeout(() => {
        const path = pathname;
        const pageType = getPageType(path);
        const { title, description } = getPageMetadata();

        // Handle Guest ID consistency
        let guestId = localStorage.getItem('lolabot_guest_id');
        if (!guestId) {
          guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('lolabot_guest_id', guestId);
        }
        const currentUserId = guestId;

        // Prepare context with auto-extracted metadata
        const context = {
          page: path,
          page_type: pageType,
          page_title: title || `Page: ${path}`,
          page_description: description || 'LolaBot - AI-Powered Sales Agent',
          user_id: currentUserId,
          user_role: 'visitor',
          intent: pageType === 'blog_article'
            ? 'Reading blog content, may have questions about the topic'
            : 'Evaluating LolaBot Intelligence for purchase'
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
        // Use env var for baseUrl (defaults to production if not set)
        const baseUrl = process.env.NEXT_PUBLIC_LOLABOT_API_URL || 'https://lolabot.bizaigpt.com';
        try {
          window.LolaBot.mount({
            botId: "lolabot-landing-demo",
            userId: currentUserId,
            baseUrl: baseUrl,
            context: context
          });
        } catch (e) {
          console.error("Failed to mount LolaBot:", e);
        }
      }, 100); // Small delay to ensure metadata is ready
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

  // Auto-open bot after delay (only once per session)
  useEffect(() => {
    const hasOpened = sessionStorage.getItem('lolabot_auto_opened');
    if (hasOpened) return;

    const timer = setTimeout(() => {
      // Find the launcher button
      const buttons = document.querySelectorAll('button');
      let launcherBtn: HTMLButtonElement | null = null;

      buttons.forEach(btn => {
        const style = window.getComputedStyle(btn);
        if (style.position === 'fixed' && style.bottom !== 'auto' && style.right !== 'auto') {
          launcherBtn = btn;
        }
      });

      if (launcherBtn) {
        (launcherBtn as HTMLButtonElement).click();
        sessionStorage.setItem('lolabot_auto_opened', 'true');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default LolaBotIntegration;
