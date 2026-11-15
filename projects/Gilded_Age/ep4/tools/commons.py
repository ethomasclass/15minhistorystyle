"""Ep 4 copy (adapted from ep3/tools). Search and download public-domain images from Wikimedia Commons, recording credits.

  python3 tools/commons.py search "Andrew Jackson Sully"      # list candidates with licence + size
  python3 tools/commons.py get "File:Name.jpg" out/name.jpg [width]
"""
import json, os, re, sys, time, urllib.error, urllib.parse, urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "FifteenMinuteHistory/0.1 (educational explainer videos for a history class)"
# CREDITS_FILE lets parallel image searches write separate files (merge them into credits.json afterwards)
CREDITS = os.environ.get("CREDITS_FILE") or os.path.join(os.path.dirname(__file__), "..", "public", "img", "credits.json")


def api(**params):
    params.update(format="json")
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers={"User-Agent": UA})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 5:
                raise
            time.sleep(min(60, int(e.headers.get("Retry-After") or 0) or 5 * (attempt + 1)))


def strip(html):
    return re.sub(r"<[^>]+>", "", html or "").strip()[:160]


def info(titles, width=None):
    p = dict(action="query", titles="|".join(titles), prop="imageinfo",
             iiprop="url|size|extmetadata|mime")
    if width:
        p["iiurlwidth"] = width
    pages = api(**p)["query"]["pages"].values()
    out = []
    for pg in pages:
        if "imageinfo" not in pg:
            continue
        ii = pg["imageinfo"][0]
        md = ii.get("extmetadata", {})
        out.append(dict(title=pg["title"], w=ii["width"], h=ii["height"],
                        url=ii.get("thumburl") or ii["url"], page=ii["descriptionurl"],
                        licence=strip(md.get("LicenseShortName", {}).get("value")),
                        artist=strip(md.get("Artist", {}).get("value")),
                        date=strip(md.get("DateTimeOriginal", {}).get("value"))))
    return out


def search(q, n=12):
    r = api(action="query", list="search", srsearch=q, srnamespace=6, srlimit=n)
    titles = [s["title"] for s in r["query"]["search"]]
    for i in info(titles) if titles else []:
        print(f'{i["w"]}x{i["h"]}  [{i["licence"]}]  {i["title"]}  - {i["artist"]} {i["date"]}')


def save_jpeg(data, dest, cap=4000):
    """Every file on disk is a JPEG of at most `cap` px on the long side (disk is limited)."""
    import io
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    im = Image.open(io.BytesIO(data))
    if im.format == "JPEG" and max(im.size) <= cap:
        open(dest, "wb").write(data); return
    im = im.convert("RGB"); im.thumbnail((cap, cap), Image.LANCZOS); im.save(dest, quality=90)


def category(cat, n=200):
    """List files in a Commons category with size and licence: python3 commons.py cat "Tweed Courthouse" """
    r = api(action="query", list="categorymembers", cmtitle="Category:" + cat, cmtype="file|subcat", cmlimit=n)
    mem = r["query"]["categorymembers"]
    for m in mem:
        if m["title"].startswith("Category:"):
            print("  [cat]", m["title"][9:])
    titles = [m["title"] for m in mem if m["title"].startswith("File:")]
    for k in range(0, len(titles), 40):
        for i in info(titles[k:k + 40]):
            print(f'{i["w"]}x{i["h"]}  [{i["licence"][:12]}]  {i["title"]}  | {i["date"][:20]}')


STD_WIDTHS = [250, 330, 500, 960, 1280, 1920, 3840]


def get(title, dest, width=3840):
    # Full-size originals on upload.wikimedia.org are rate-limited hard (429, Retry-After 600), but standard-size
    # thumbnails are served freely: take the largest standard width below the original (3840 at most).
    w0 = info([title])[0]["w"]
    width = max([w for w in STD_WIDTHS if w < w0 and w <= width] or [0])
    if w0 <= 1600:
        width = 0   # small originals: take the original itself (one request, rarely rate-limited)
    i = info([title], width)[0] if width else info([title])[0]
    if not re.search(r"public domain|pd|cc0|no restrictions|cc by(?!-nc)", i["licence"], re.I):
        sys.exit(f"refusing licence {i['licence']!r} for {title}")
    req = urllib.request.Request(i["url"], headers={"User-Agent": UA})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
            break
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 4:
                raise
            time.sleep(min(60, int(e.headers.get("Retry-After") or 0) or 30 * (attempt + 1)))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    save_jpeg(data, dest)
    credits = json.load(open(CREDITS)) if os.path.exists(CREDITS) else {}
    key = os.path.relpath(dest, os.path.dirname(CREDITS))
    credits[key] = {**{k: i[k] for k in ("title", "artist", "date", "licence", "page")}, "source": "commons:" + title}
    json.dump(credits, open(CREDITS, "w"), indent=2)
    print(f"saved {dest} ({len(data)//1024} KB) {i['licence']}")


if __name__ == "__main__":
    if sys.argv[1] == "search":
        search(" ".join(sys.argv[2:]))
    elif sys.argv[1] == "cat":
        category(" ".join(sys.argv[2:]))
    else:
        get(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 3840)
