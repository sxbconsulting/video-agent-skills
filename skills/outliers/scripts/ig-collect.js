// Instagram reels collector, shared by outliers and flop-rescue. Paste into the javascript tool of Claude in Chrome on
// https://www.instagram.com/<handle>/reels/ (a tab where the creator is logged in to Instagram).
//
// It starts in the background and returns at once ("started"): the javascript tool times out after
// about 45 s and a full account takes 1 to 3 minutes. Poll with:
//   for (let i = 0; i < 8 && !window.__res; i++) await new Promise(r => setTimeout(r, 5000)); window.__res || 'progress ' + window.__prog
//
// window.__res is a short JSON string: handle, reels fetched, reels in the 7-180 day window, the median
// (null under 10 reels), the oldest date read, the outliers at MIN x the median, the flops at 0.7x or
// less, and TARGETS as [shortcode, views, x median]. Every reel of the window stays in window.__reels.
// Set MIN and TARGETS in the last line of the function call.
// Views are read from the reels grid; the date comes from the shortcode (the media id holds the
// creation time in ms since Instagram's epoch, 2011-08-24), so no reel has to be opened.
window.__res = null; window.__prog = 0;
(async (MIN = 3, TARGETS = [], MAX_SCROLLS = 60) => {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const toDate = sc => { let id = 0n; for (const c of sc.slice(0, 11)) id = id * 64n + BigInt(A.indexOf(c)); return new Date(Number((id >> 23n) + 1314220021721n)); };
  // "2 637", "12,3 k", "1.2M", "1,2 M" → number
  const parse = t => { t = (t || '').trim().toLowerCase().replace(/\s/g, '').replace(',', '.'); const m = t.match(/^([\d.]+)(k|m)?/); if (!m) return null; let v = parseFloat(m[1]); if (m[2] === 'k') v *= 1e3; else if (m[2] === 'm') v *= 1e6; return Math.round(v); };
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 2500));
  const now = Date.now(), day = 864e5, seen = new Map(); let still = 0;
  for (let i = 0; i < MAX_SCROLLS && still < 4; i++) {
    const before = seen.size;
    for (const a of document.querySelectorAll('a[href*="/reel/"]')) {
      const sc = a.getAttribute('href').split('/reel/')[1].split('/')[0];
      if (seen.has(sc)) continue;
      const d = toDate(sc);
      seen.set(sc, { sc, views: parse(a.innerText.split('\n')[0]), date: d.toISOString().slice(0, 10), age: (now - d) / day,
        pinned: !!a.querySelector('svg[aria-label*="pingl"], svg[aria-label*="inned"]') });
    }
    window.__prog = seen.size;
    // The grid is newest first: 3 unpinned reels past 185 days means the window is covered.
    if ([...seen.values()].filter(x => !x.pinned && x.age > 185).length >= 3) break;
    still = seen.size === before ? still + 1 : 0;
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 1800 + Math.random() * 1500));
  }
  const all = [...seen.values()];
  // The pin icon isn't always in the DOM: in a newest-first grid, a leading reel older than one after it is pinned.
  all.slice(0, 3).forEach((x, i) => { if (all.slice(i + 1, i + 6).some(y => y.age < x.age)) x.pinned = true; });
  const win = all.filter(x => !x.pinned && x.views != null && x.age >= 7 && x.age <= 180);
  const s = win.map(x => x.views).sort((a, b) => a - b);
  const med = s.length >= 10 ? s[Math.floor(s.length / 2)] : null;
  const outs = med ? win.filter(x => x.views >= MIN * med).sort((a, b) => b.views - a.views)
    .map(x => ({ sc: x.sc, views: x.views, date: x.date, x: +(x.views / med).toFixed(1) })) : [];
  const flops = med ? win.filter(x => x.views <= 0.7 * med).sort((a, b) => a.views - b.views).slice(0, 8)
    .map(x => [x.sc, x.views, x.date, +(x.views / med).toFixed(2)]) : [];
  const targets = TARGETS.map(t => { const x = seen.get(t); return x ? [t, x.views, med ? +(x.views / med).toFixed(1) : null] : [t, 'not found']; });
  window.__reels = win.map(x => [x.sc, x.views, x.date]);
  window.__res = JSON.stringify({ handle: location.pathname.split('/')[1], fetched: all.length, inWindow: win.length, median: med,
    oldest: all.length ? all[all.length - 1].date : null, outliers: outs.slice(0, 10), flops, targets });
})(3, [/* 'DeKTWC9oZzo' */]);
'started';
