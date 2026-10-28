# Grow the watchlist (mode 2)

When `video-agent/competitors.json` doesn't exist yet, is thin in one language, or the creator writes `--search`. Goal: 3 to 6 new usable accounts (8 to 12 on the first run), never a list of 30 unchecked handles. Everything here is free.

## The file

```json
{
 "self": "<their handle>",
 "mix": {"en": 70, "fr": 30},
 "accounts": [
  {"handle": "someone", "lang": "en", "tier": "direct", "niche": "a few words", "use": true, "added": "2026-10-16", "why": "one line"},
  {"handle": "someone", "platform": "tiktok", "lang": "en", "tier": "direct", "niche": "a few words", "use": true, "added": "2026-10-16", "why": "one line"}
 ]
}
```

`lang` = the account's language code; `tier` = `direct` (similar size and niche) or `aspirational` (much bigger, or a neighbour niche whose formats transpose); `use: false` = kept so it isn't proposed again; `platform: "tiktok"` or `"youtube"` = not Instagram (no field = Instagram; the same creator on two platforms = two entries). `mix` = the language split of the 5 scripts (one language only: leave it out).

## 1. Find candidates

Ask the creator first: "Which 3 to 5 accounts in your niche do you watch?" Their answer beats any search.

Then, from their niche words (`video-agent/voice.md`):

- **Instagram's own suggestions.** In the Chrome tab, open the profile of the creator and of each good competitor (`https://www.instagram.com/<handle>/`) and read the "Suggested for you" accounts (the arrow next to Follow / Message opens them). Keep the names that look like the niche.
- **TikTok search** (yt-dlp has no TikTok search): in the Chrome tab, open `https://www.tiktok.com/search/video?q=<2 or 3 niche words>` and read the `@handles` and views of the results (`get_page_text`, or the `href`s matching `/@`). Then check the same handle on Instagram: creators often use one handle everywhere.
- **YouTube search**: `yt-dlp --flat-playlist --print "%(channel)s|%(uploader_id)s|%(view_count)s|%(title).80s" "ytsearch30:<niche words> shorts"`.
- **A web search** (the session's search tool): `<niche words> créateur Instagram`, `top <niche> creators <country>`; take handles from `instagram.com/<handle>/` links only, never from a `/reel/` or `/p/` link.
- Accounts that keep coming up in the reels already studied (tagged, remixed, quoted in a caption) are candidates too.

Drop handles already in the file. For a second language, the same subjects in that language.

## 2. Check each candidate

Run the collector of SKILL.md step 1 on it, then keep it only if:

- its reels are about their niche (read the captions of 10 recent reels with `ig-captions.js`), not a one-off on the subject among unrelated reels;
- at least 10 reels in the last 180 days (it posts, so its median means something);
- the language is the one searched.

## 3. Record it

Add each checked account with `platform` (when not Instagram), `lang`, `tier`, `niche`, `use`, `added` and `why`. A rejected candidate goes in with `use: false` and its reason, so it isn't searched and checked again.
