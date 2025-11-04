(function () {
  function mount(options) {
    var botId = options.botId || 'lola-demo';
    var apiBase = options.apiBase || '';
    var userId = options.userId || '';
    var chatId = options.chatId || '';
    var theme = options.theme || 'light';

    var launcher = document.createElement('button');
    launcher.textContent = 'Chat';
    launcher.style.position = 'fixed';
    launcher.style.bottom = '20px';
    launcher.style.right = '20px';
    launcher.style.border = 'none';
    launcher.style.background = '#111827';
    launcher.style.color = '#fff';
    launcher.style.borderRadius = '9999px';
    launcher.style.padding = '12px 16px';
    launcher.style.cursor = 'pointer';
    launcher.style.zIndex = 999999;

    var iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.bottom = '80px';
    iframe.style.right = '20px';
    iframe.style.width = '380px';
    iframe.style.height = '560px';
    iframe.style.border = '0';
    iframe.style.borderRadius = '16px';
    iframe.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'none';
    iframe.style.zIndex = 999999;

    var base = options.baseUrl || '';
    var qs = '?apiBase=' + encodeURIComponent(apiBase) + (userId ? '&userId=' + encodeURIComponent(userId) : '') + (chatId ? '&chatId=' + encodeURIComponent(chatId) : '') + (theme ? '&theme=' + encodeURIComponent(theme) : '');
    iframe.src = (base || '') + '/chat/' + encodeURIComponent(botId) + qs;

    launcher.addEventListener('click', function () {
      iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
    });

    document.body.appendChild(launcher);
    document.body.appendChild(iframe);
  }

  function auto() {
    var script = document.currentScript;
    if (!script) return;
    var botId = script.getAttribute('data-bot-id');
    if (!botId) return;
    mount({
      botId: botId,
      apiBase: script.getAttribute('data-api-base') || '',
      userId: script.getAttribute('data-user-id') || '',
      chatId: script.getAttribute('data-chat-id') || '',
      theme: script.getAttribute('data-theme') || 'light',
      baseUrl: ''
    });
  }

  window.LolaBot = { mount: mount };
  if (document.readyState === 'complete' || document.readyState === 'interactive') auto();
  else document.addEventListener('DOMContentLoaded', auto);
})();


