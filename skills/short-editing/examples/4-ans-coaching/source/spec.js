// Short: "<one-line promise>". All times are SOURCE seconds (read them from files/words.md).
// Parameters: references/scene-library.md. Delete what you don't use.
// Pace (speed, tighten), caption look, music bpm and mix come from source/style.json (the creator style snapshot
// written by `init`). Set a key here only to override it for this one short.
window.SPEC = {
  title: '4 ans de coaching en 60 secondes',
  media: {
    hud: { src: 'assets/hud.mov', width: 1080, alpha: true },
  },
  cam: { crop: [0, 0, 1080, 1920], eyes: [533, 750], splitZoom: 1 },   // face detected on this take
  speed: 1.0,
  cut: [[0, 7.68], [32.5, 34.15], [49.25, 57.36], [63.15, 65.78], [67.93, 74.9], [81.25, 97.35], [105.45, 106.9], [108.45, 109.97], [110.72, 112.43]],                                                // [[a, b]] retakes / dead air to drop

  // seam fixed by the creator style (layout.seam): the camera card never resizes. Only 1920 (paper alone) or 0 (full camera) when its notes allow it
  layout: { seam: 960, keys: [[0, 960]] },
  zoom: { keys: [[0, 1]] },

  actors: [
    // { id: 'demo', media: 'demo', offset: 0, from: 0.5, to: 6, pre: .45,
    //   keys: [[0.5, [60, 250, 960]]], labelKeys: [[0.5, 'Label']], dot: 'blue' },
  ],

  scenes: [
    { type: 'overlay', layer: 'over', media: 'hud', from: 0 },
    // { type: 'title', from: 9, to: 11, lines: [{ text: 'Line one', at: 9 }, { text: 'line two.', at: 9.8, emph: 'two.', emphAt: 10.2 }] },
    // { type: 'cta', layer: 'over', from: 40, clickAt: 41.4, y: 1420 },   // name, sub, button, done: from style.creator; without a profile (or to override) set them here
  ],

  music: { bed: 'enquete', offset: 0 },
  sfx: { swish: 0, accents: 0, extra: [[18.78, 'thud', -7], [27.42, 'pop', -8], [76.2, 'thud', -7], [98.64, 'pop', -8]] },   // [[a, b]] drums drop (a punchline, a full-camera beat); a library bed instead: src + offset, see references/music.md

  captions: {
    replace: [['!', 'Allez, ciao'], ["L'idée,", "L'IA,"], ['te trouver', 'te prouver']],
    emph: ['jamais', 'précis,', 'marges', 'vente', 'possible.', 'magique.', 'bootcamp', 'bio.'],
    hide: [],   // ranges where a scene already shows the words (title, typing, CTA -> [ctaFrom, 99])
  },
};
