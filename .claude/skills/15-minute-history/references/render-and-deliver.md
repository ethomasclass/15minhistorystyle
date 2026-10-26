# Rendering and delivering

## Contents
1. Setup
2. Render, join, master
3. Previews for the user
4. Delivering the 1080p master (over 100 MB)
5. Feedback rounds
6. Disk space
7. Rendering on the user's own machine

## 1. Setup

```sh
npm install
pip install pillow numpy imageio-ffmpeg            # + rembg onnxruntime opencv-python-headless for masks
export REMOTION_CHROME=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
```

In Claude's cloud containers a headless Chromium is preinstalled (that path). Elsewhere leave `REMOTION_CHROME`
unset and Remotion downloads its own. ffmpeg comes from `imageio-ffmpeg`; no system ffmpeg is needed.

## 2. Render, join, master

```sh
tools/render.sh              # every chapter in src/chapters.ts, then join + master + 720p
tools/render.sh 03 07        # re-render only these chapters, then rejoin and master everything
```

- Each chapter renders to `out/ch/chNN.mp4` (CRF 18). Chapters are joined without re-encoding, then
  `tools/master.py` does a two-pass loudness normalisation to **−14 LUFS, −1.5 dBTP** (YouTube's target) and a
  broadly compatible H.264, giving `out/<SLUG>_1080p.mp4`. A 720p copy goes to `renders/<SLUG>_720p.mp4`.
- The script prints each chapter's start time in the finished video. Use those for the YouTube chapter list and
  to re-time the headings in SCRIPT.md.
- A full 15-minute video takes a while; run it in the background and keep working. **How long, in a cloud session**
  (4 CPU cores, no GPU, so Chrome draws in software): *Not in the Picture* (15:59) rendered at 1.2–2.6 frames a second,
  about 3 h 40 min of chapter renders (the tilted 3D desk, blur and blend modes are the slow part), plus ~25 min to join,
  master and make the 720p. `--concurrency=4` was used.
- **Background commands stop after 2 hours.** Render chapter by chapter with a resumable loop that writes a `chNN.done`
  marker after each chapter and skips finished ones, run the chapters in batches that fit (West Ep 1: 01–04, then 05–08,
  then 09, the longest, on its own), then `JOIN_ONLY=1 tools/render.sh` to join and master. When a batch hits the limit,
  ask the user before starting another one.
- Verify the output before telling the user it's done: duration, 1920×1080 at 30 fps, and loudness
  (`ffmpeg -i out/<SLUG>_1080p.mp4 -af ebur128 -f null -` should report about −14 LUFS integrated). Then pull
  frames at a few spots with `tools/frames_sheet.py` and look at them.

## 3. Previews for the user

The user watches in the Claude app, where attachments are capped at 30 MB. Make a 480p preview under that:

```sh
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
$FF -y -i renders/<SLUG>_720p.mp4 -vf scale=854:480 -c:v libx264 -preset medium -b:v 170k -maxrate 260k \
    -bufsize 520k -c:a aac -b:a 80k -movflags +faststart out/<SLUG>_preview_480p.mp4
```

For 15:30 that comes to about 27 MB. Send it, with a two-line note of what changed since the last cut.
Commit the 720p to the branch too (about 80 MB; GitHub warns above 50 MB but accepts it).

## 4. Delivering the 1080p master

The master is about 360–520 MB (*Not in the Picture*: 522 MB), too big for a chat attachment (30 MB) and for a normal git file
(100 MB). The 720p can pass 100 MB too (140 MB for a 16-minute video), so track it the same way. Use **Git LFS** for those
files (ask the user first: it counts against their GitHub LFS storage, 1 GB on the free plan), then confirm it round-trips:

```sh
git lfs install --local                         # apt-get install -y git-lfs first if `git lfs` is missing
git lfs track "video/renders/<SLUG>_1080p.mp4"  # track only this path
cp out/<SLUG>_1080p.mp4 renders/
git add .gitattributes renders/<SLUG>_1080p.mp4 && git commit -m "<Title> 1080p master (Git LFS)" && git push
```

Then prove it uploaded: `git lfs ls-files -l` gives each file's sha256 (the LFS object id, which the server checks on upload);
compare it with `sha256sum` of the local file. A fresh clone and `git lfs pull --include=<path>` also works but can pull far
more than the one file from a big repo. Tell the user to download it from GitHub's web page (the download
button on the file), and that a local clone needs Git LFS installed to get the real file.

If LFS isn't available, split the master into parts under 95 MB with ffmpeg's segment muxer (stream copy) and
explain how to join them; that is what *Fix Everything* did.

## 5. Feedback rounds

- The user watches the preview and sends short notes ("the table illustration isn't great", "text gets cut off on
  the right"). Fix every instance, not just the one they saw: a cut-off on the right means running the text probe
  over every chapter.
- Batch small fixes and re-render only the chapters they touch (`tools/render.sh 05 07`). Mention any small
  blemish you noticed yourself and either fix it or hold it for the next batch, saying which.
- After each round: verify, commit the new 720p, send a new preview, and say in a few lines what changed.

## 6. Disk space

Each render bundles a copy of `public/` into `/tmp/remotion-webpack-bundle-*` (about 500 MB for a full video);
the tools delete theirs, but a crashed run leaves one behind. If a write fails with "no space left", delete
those bundles and old files in `out/`. The thumbnail tool bundles into `out/thumb_bundle` so it can run while a
chapter render is going.

## 7. Rendering on the user's own machine

Rendering costs no tokens, but in a cloud session it takes hours. On a desktop it's much faster: Remotion renders frames in
parallel on the CPU, and a GPU speeds up the 3D desk, blur and blend modes. Rough expectation (untested): a recent 8–12-core
CPU with a modern GPU is 4–8 times faster than the cloud session (*Not in the Picture* in about 40–70 minutes). Settings:
`--gl=angle` so Chrome uses the GPU (`--gl=egl` or `--gl=vulkan` if that errors on Linux), `--concurrency` about half the CPU
threads (each browser worker needs about 1 GB of RAM), the project on an SSD. Test one short chapter first and compare.
Rendering needs only the committed audio and images (no keys): Node, the repo, `npm install`, `pip install imageio-ffmpeg`.

