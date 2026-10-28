// Captions of a list of reels, read from each reel page's og:description (likes, comments, date,
// caption). Run with the javascript tool of Claude in Chrome on any instagram.com tab where the
// creator is logged in. Replace SHORTCODES, then poll like ig-collect.js:
//   for (let i = 0; i < 8 && !window.__caps; i++) await new Promise(r => setTimeout(r, 5000)); window.__caps ? JSON.stringify(window.__caps) : 'running'
// One request every 1.5 to 3 s, so Instagram doesn't rate-limit the account.
window.__caps = null;
(async (SHORTCODES = []) => {
  const out = {};
  for (const sc of SHORTCODES) {
    try {
      const h = await (await fetch('/reel/' + sc + '/', { credentials: 'include' })).text();
      const d = new DOMParser().parseFromString(h, 'text/html');
      const m = d.querySelector('meta[property="og:description"]') || d.querySelector('meta[name="description"]');
      out[sc] = ((m && m.content) || '').slice(0, 400);
    } catch (e) { out[sc] = 'ERR ' + e; }
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1500));
  }
  window.__caps = out;
})([/* 'DaIIPY-gUy5', ... */]);
'started';
