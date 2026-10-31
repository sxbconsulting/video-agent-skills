# /// script
# requires-python = ">=3.10,<3.14"
# dependencies = ["faster-whisper", "numpy"]
# ///
"""Download one or more videos (Instagram, TikTok, YouTube) and transcribe them locally, for free.

Usage: uv run get_script.py <out_dir> [--lang fr] [--model large-v3-turbo] <url> [<url> ...]

Writes into <out_dir>, for each video id:
  <id>.txt     the transcript with timestamps
  <id>.json    duration, speech ratio, words, words per minute, first sentence
  <id>-sheet.jpg  one frame per second (first 16 s), to read the on-screen text and the shots
The audio and the video are deleted at the end: only the text and the contact sheet stay.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel


NOISE = re.compile(r"sous-titr|subtitles by|amara\.org", re.I)


def video_id(url: str) -> str:
    m = re.search(r"/(?:reels?|p|video|shorts)/([\w-]+)", url) or re.search(r"[?&]v=([\w-]+)", url)
    return m.group(1) if m else re.sub(r"\W+", "-", url)[-40:]


def fetch(url: str, tmp: Path) -> Path:
    target = tmp / "video.%(ext)s"
    subprocess.run(["yt-dlp", "--no-warnings", "--quiet", "--socket-timeout", "25", "--no-playlist",
                    "-f", "b[height<=720]/bv*[height<=720]+ba/b", "-o", str(target), url],
                   check=True, timeout=300)
    return next(tmp.glob("video.*"))


def run(url: str, out: Path, model: WhisperModel, lang: str) -> dict:
    vid = video_id(url)
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        video = fetch(url, tmp)
        wav = tmp / "a.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", str(wav)],
                       check=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-t", "16", "-vf",
                        "fps=1,scale=240:-1,tile=8x2", "-frames:v", "1", str(out / f"{vid}-sheet.jpg")], check=False)
        with wave.open(str(wav)) as w:
            duration = w.getnframes() / w.getframerate()
            pcm = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    segments, _ = model.transcribe(pcm, language=lang, vad_filter=True)
    # Whisper invents credits over silence ("Sous-titrage ...") and may run past the end of the file.
    segs = [(s.start, min(s.end, duration), s.text.strip()) for s in segments
            if s.text.strip() and not NOISE.search(s.text) and s.start < duration]
    (out / f"{vid}.txt").write_text("\n".join(f"[{a:5.1f}-{b:5.1f}] {x}" for a, b, x in segs), encoding="utf-8")
    words = sum(len(x.split()) for _, _, x in segs)
    speech = sum(b - a for a, b, _ in segs)
    info = {"id": vid, "url": url, "duration": round(duration, 1), "words": words,
            "wpm": round(words / speech * 60) if speech else 0,
            # Under 5 words per 10 s is music or a whisper hallucination: treat it as a silent video.
            "has_speech": words >= duration / 2,
            "first_line": segs[0][2] if segs else ""}
    (out / f"{vid}.json").write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding="utf-8")
    return info


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("out")
    p.add_argument("urls", nargs="+")
    p.add_argument("--lang", default="fr")
    p.add_argument("--model", default="large-v3-turbo")
    a = p.parse_args()
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    model = WhisperModel(a.model, device="cpu", compute_type="int8")
    failed = 0
    for url in a.urls:
        try:
            i = run(url, out, model, a.lang)
            print(f"OK {i['id']} {i['duration']}s {i['words']} mots {i['wpm']} mots/min parole={i['has_speech']}")
        except Exception as e:  # one blocked video must not stop the others
            failed += 1
            print(f"ECHEC {url}: {str(e)[:200]}")
    return 1 if failed == len(a.urls) else 0


if __name__ == "__main__":
    sys.exit(main())
