(function () {
  function mount(options) {
    var botId = options.botId || 'lola-demo';
    var apiBase = options.apiBase || '';
    var userId = options.userId || '';
    var chatId = options.chatId || '';
    var theme = options.theme || 'light';

    var launcher = document.createElement('button');
    launcher.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    launcher.style.position = 'fixed';
    launcher.style.bottom = '20px';
    launcher.style.right = '20px';
    launcher.style.border = 'none';
    launcher.style.background = '#121212';
    launcher.style.color = '#fff';
    launcher.style.borderRadius = '50%';
    launcher.style.width = '60px';
    launcher.style.height = '60px';
    launcher.style.display = 'flex';
    launcher.style.alignItems = 'center';
    launcher.style.justifyContent = 'center';
    launcher.style.cursor = 'pointer';
    launcher.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    launcher.style.transition = 'all 0.2s ease';
    launcher.style.zIndex = 999999;

    launcher.onmouseenter = function() { launcher.style.transform = 'scale(1.05)'; };
    launcher.onmouseleave = function() { launcher.style.transform = 'scale(1)'; };


    var iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.bottom = '100px';
    iframe.style.right = '20px';
    iframe.style.width = '380px';
    iframe.style.height = '560px';
    iframe.style.border = '0';
    iframe.style.borderRadius = '16px';
    iframe.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'none';
    iframe.style.zIndex = 999999;
    iframe.style.transition = 'all 0.3s ease';
    iframe.style.maxWidth = 'calc(100vw - 40px)';
    iframe.style.maxHeight = 'calc(100vh - 120px)';
    iframe.allow = "clipboard-read; clipboard-write; microphone";

    var base = options.baseUrl || '';
    var qs = '?apiBase=' + encodeURIComponent(apiBase) + (userId ? '&userId=' + encodeURIComponent(userId) : '') + (chatId ? '&chatId=' + encodeURIComponent(chatId) : '') + (theme ? '&theme=' + encodeURIComponent(theme) : '');
    iframe.src = (base || '') + '/chat/' + encodeURIComponent(botId) + qs;

    // Track maximization state
    var isWidgetMaximized = false;

    // Handle messages from the widget (resize/maximize)
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'LOLA_RESIZE') {
        isWidgetMaximized = e.data.isMaximized; // Update state
        if (e.data.isMaximized) {
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.maxWidth = '1440px';
          iframe.style.top = '0';
          iframe.style.left = '50%';
          iframe.style.transform = 'translateX(-50%)';
          iframe.style.right = 'auto';
          iframe.style.bottom = '0';
          iframe.style.borderRadius = '0';
          iframe.style.maxHeight = 'none';
        } else if (e.data.isCollapsed) {
          iframe.style.width = '380px';
          iframe.style.height = '80px'; // Just enough for header
          iframe.style.bottom = '100px';
          iframe.style.right = '20px';
          iframe.style.borderRadius = '16px';
          iframe.style.top = 'auto';
          iframe.style.left = 'auto';
          iframe.style.transform = 'none';
          iframe.style.maxWidth = 'calc(100vw - 40px)';
        } else {
          // Restore normal size
          iframe.style.width = '380px';
          iframe.style.height = '560px';
          iframe.style.bottom = '100px';
          iframe.style.right = '20px';
          iframe.style.borderRadius = '16px';
          iframe.style.top = 'auto';
          iframe.style.left = 'auto';
          iframe.style.transform = 'none';
          iframe.style.maxWidth = 'calc(100vw - 40px)';
          iframe.style.maxHeight = 'calc(100vh - 120px)';
        }
      }
    });

    launcher.addEventListener('click', function () {
      if (iframe.style.display === 'none') {
        iframe.style.display = 'block';
        // Animate in
        iframe.style.opacity = '0';
        // If maximized, respect the centered transform
        var startTransform = isWidgetMaximized ? 'translateX(-50%) translateY(20px)' : 'translateY(20px)';
        var endTransform = isWidgetMaximized ? 'translateX(-50%) translateY(0)' : 'translateY(0)';
        
        iframe.style.transform = startTransform;
        setTimeout(function() {
          iframe.style.opacity = '1';
          iframe.style.transform = endTransform;
        }, 10);
      } else {
        iframe.style.display = 'none';
      }
    });

    document.body.appendChild(launcher);
    document.body.appendChild(iframe);
  }

  function auto() {
    var script = document.currentScript;
    if (!script) {
      // Fallback for older browsers or async loading where currentScript might be lost
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes('/embed/lolabot.js')) {
          script = scripts[i];
          break;
        }
      }
    }
    if (!script) return;

    var srcUrl = new URL(script.src);
    var baseUrl = srcUrl.origin; // Detect origin from script source

    var botId = script.getAttribute('data-bot-id') || 'lola-demo';

    mount({
      botId: botId,
      apiBase: script.getAttribute('data-api-base') || '',
      userId: script.getAttribute('data-user-id') || '',
      chatId: script.getAttribute('data-chat-id') || '',
      theme: script.getAttribute('data-theme') || 'light',
      baseUrl: baseUrl // Use detected origin
    });
  }

  window.LolaBot = { mount: mount };
  if (document.readyState === 'complete' || document.readyState === 'interactive') auto();
  else document.addEventListener('DOMContentLoaded', auto);
})();


