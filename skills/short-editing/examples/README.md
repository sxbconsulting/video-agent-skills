# Examples: real shorts made with this engine

Three shorts edited and rendered with `engine/short.mjs`, all in the same format: the creator's camera bubble cut out of a screen recording, a 50/50 split (animated boards on top, camera below), a countdown timer, a lesson or step pill, and a progress bar at the bottom. Each folder holds what made it:

- `source/spec.js`: the whole edit (cuts, camera framing, captions, sounds). Every time is a SOURCE second of the take.
- `source/hud.html`: one HTML page for the whole top half, a pure function of `window.setT(t)` in SHORT seconds, captured once with `short.mjs capture --alpha` and laid over the frame as an `overlay` scene.
- `words.md`: the transcript with source and short times, so you can read each beat against the word it lands on.
- `stills/contact.jpg`: frames of the final short; `stills/hud-sheet.jpg`: the captured overlay on its own. Open them: this is the finish to reach.

The takes and the captured clips are not included (the spec names them under `assets/`).

| example | what to take from it | look at |
|---|---|---|
| [4-ans-coaching](4-ans-coaching/) | 17 lessons in 60 s: one mini animation per lesson, a timer that ends on 00:00, retakes cut, a beat table (`B`) moved onto new word times after a recut. | `source/hud.html` |
| [fournisseur](fournisseur/) | A storyboard-first edit: 16 beats (parcel, magnifier, price cards, reviews, checklist, damaged box), no music and a few hits on the payoffs (`sfx.extra`). | `source/spec.js` |
| [analyser-pubs](analyser-pubs/) | A 3-step tutorial with real logos embedded in the page, a counter, a donut chart and stamps, no music. | `source/hud.html` |

To reuse a page, copy its `hud.html` into your project's `source/`, change the beats, texts and times, and capture it.
