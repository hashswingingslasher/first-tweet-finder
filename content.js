(function () {
  'use strict';

  // Only run on profile pages
  if (!location.pathname.match(/^\/[a-zA-Z0-9_]+\/?$/)) return;

  // Add scroll button if not already present
  if (document.getElementById('first-tweet-finder-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'first-tweet-finder-btn';
  btn.textContent = '📍 First Tweet';
  btn.style.position = 'fixed';
  btn.style.top = '80px';
  btn.style.right = '20px';
  btn.style.zIndex = 9999;
  btn.style.background = '#1d9bf0';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '24px';
  btn.style.padding = '12px 20px';
  btn.style.fontSize = '14px';
  btn.style.fontWeight = 'bold';
  btn.style.cursor = 'pointer';

  btn.onclick = async function () {
    btn.disabled = true;
    let attempts = 0;
    let prevHeight = -1;
    while (attempts++ < 50) {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 1800));
      if (prevHeight === document.body.scrollHeight) break;
      prevHeight = document.body.scrollHeight;
    }
    // Highlight oldest tweet
    const tweets = document.querySelectorAll('[data-testid="tweet"]');
    if (tweets.length) {
      const oldest = tweets[tweets.length - 1];
      oldest.style.boxShadow = '0 0 10px 4px #1d9bf0';
      oldest.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    btn.disabled = false;
  };

  document.body.appendChild(btn);
})();
