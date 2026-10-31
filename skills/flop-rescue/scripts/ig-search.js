// Run with the javascript tool of Claude in Chrome on
// https://www.instagram.com/explore/search/keyword/?q=<2 or 3 words>
// (long queries return "no result": keep it short). Set the topic words in the last line.
// It returns "started"; poll in a later call, the tool times out after about 45 s:
//   for (let i = 0; i < 8 && !window.__s; i++) await new Promise(r => setTimeout(r, 5000)); window.__s || 'progress ' + window.__sp
// Result, best first: shortcode | likes | comments | author | start of the caption. Only posts whose
// caption holds a topic word. About 2 s per post, so Instagram doesn't rate-limit the account.
window.__s = null; window.__sp = 0;
(async (TOPIC = /./, MAX = 30) => {
  await new Promise(r => setTimeout(r, 3000));
  const hrefs = new Set();
  for (let i = 0; i < 4; i++) {
    document.querySelectorAll('a[href*="/reel/"], a[href*="/p/"]').forEach(a => hrefs.add(a.getAttribute('href')));
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 2000));
  }
  const num = s => { if (!s) return 0; s = s.trim(); let v = parseFloat(s.replace(/,/g, '')); if (/k$/i.test(s)) v *= 1e3; if (/m$/i.test(s)) v *= 1e6; return v; };
  const out = [];
  for (const h of [...hrefs].slice(0, MAX)) {
    const sc = h.split('/').filter(Boolean).pop();
    try {
      const html = await (await fetch('/reel/' + sc + '/')).text();
      const d = new DOMParser().parseFromString(html, 'text/html');
      const c = (d.querySelector('meta[property="og:description"]') || {}).content || '';
      const m = c.match(/^([\d.,\s]+[KkMm]?)\s*likes?,\s*([\d.,\s]+[KkMm]?)\s*comments?\s*-\s*(\S+)\s/);
      out.push({ sc, likes: m ? num(m[1]) : 0, com: m ? num(m[2]) : 0, who: m ? m[3] : '?', cap: (c.split(': "')[1] || '').slice(0, 90) });
    } catch (e) { /* a post that doesn't load is skipped */ }
    window.__sp = out.length;
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1500));
  }
  window.__s = out.filter(x => TOPIC.test(x.cap)).sort((a, b) => b.likes - a.likes).slice(0, 12)
    .map(x => [x.sc, x.likes, x.com, x.who, x.cap.slice(0, 60)].join(' | ')).join('\n') + '\nread ' + out.length;
})(/panier|upsell/i);
'started';
