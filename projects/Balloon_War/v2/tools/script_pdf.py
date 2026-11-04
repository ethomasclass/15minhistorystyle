"""A readable PDF of the narration: title, driving question, each chapter with its timestamp, vocab and emphasis
marked, subscribe reminders boxed. Reads script/chNN_*.txt and the chapter names/timestamps from SCRIPT.md.

  python3 tools/script_pdf.py "Say It Ain't So" "Baseball's Gambling Problem Before the Black Sox" review/Say_It_Aint_So_script.pdf
"""
import glob, html, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")


def para_html(p):
    sub = bool(re.search(r"\bsubscribe\b", p, re.I))
    t = html.escape(p)
    t = re.sub(r"\{([^}]*)\}", r'<span class="vocab">\1</span>', t)
    t = re.sub(r"\*([^*]*)\*", r"<em>\1</em>", t)
    return f'<p class="sub"><span class="tag">Subscribe reminder</span>{t}</p>' if sub else f"<p>{t}</p>"


def main(title, subtitle, dest):
    md = open(os.path.join(ROOT, "script", "SCRIPT.md")).read()
    heads = re.findall(r"^## (\d+:\d\d) \| (.+)$", md, re.M)
    q = re.search(r"\*\*Driving question[^*]*\*\*\s*(.+)", md).group(1).strip()
    meta = re.search(r"narration script · ([\d,]+ words) · about ([\d:]+)", md)
    chapters = []
    for (ts, name), f in zip(heads, sorted(glob.glob(os.path.join(ROOT, "script", "ch*.txt")))):
        paras = [p.strip() for p in open(f).read().split("\n\n") if p.strip()]
        chapters.append(f'<section><h2><span class="ts">{ts}</span>{html.escape(name)}</h2>{"".join(para_html(p) for p in paras)}</section>')
    fonts = os.path.abspath(os.path.join(ROOT, "public", "fonts"))
    page = f"""<!doctype html><meta charset="utf-8"><style>
@font-face {{font-family: Abril; src: url(file://{fonts}/AbrilFatface.woff2);}}
@font-face {{font-family: Plex; src: url(file://{fonts}/IBMPlexMono.woff2);}}
@page {{size: Letter; margin: 0.8in 0.9in;}}
body {{font-family: 'Bitstream Charter', 'DejaVu Serif', Georgia, serif; font-size: 12.5pt; line-height: 1.6; color: #1b1915; background: #fff;}}
.title {{font-family: Abril; font-size: 34pt; line-height: 1.05; margin: 0;}}
.title span {{background: #FF9F1C; padding: 2px 12px; display: inline-block; transform: rotate(-1deg);}}
.subtitle {{font-family: Inter, sans-serif; font-weight: 600; font-size: 13pt; color: #0f7f6d; margin: 10px 0 2px;}}
.meta {{font-family: Plex, monospace; font-size: 9pt; letter-spacing: .5px; color: #6b655c; text-transform: uppercase;}}
.question {{border-left: 4px solid #2FE0C4; padding: 6px 14px; margin: 22px 0 8px; font-style: italic;}}
.key {{font-family: Inter, sans-serif; font-size: 9.5pt; color: #6b655c; margin-bottom: 18px;}}
.key .vocab {{font-style: normal;}}
h2 {{font-family: Abril; font-weight: normal; font-size: 19pt; margin: 30px 0 8px; break-after: avoid;}}
.ts {{font-family: Plex, monospace; font-size: 10pt; color: #fff; background: #1b1915; padding: 2px 7px; margin-right: 12px; vertical-align: 4px;}}
p {{margin: 0 0 11px; orphans: 2; widows: 2;}}
.vocab {{border-bottom: 2.5px solid #2FE0C4; font-weight: bold;}}
em {{font-style: italic; color: #b8473b;}}
.sub {{background: #fff4e3; border: 1.5px dashed #FF9F1C; padding: 8px 12px;}}
.tag {{display: block; font-family: Plex, monospace; font-size: 8pt; letter-spacing: 1px; text-transform: uppercase; color: #b36b00; margin-bottom: 2px;}}
section {{break-inside: auto;}}
</style>
<p class="title"><span>{html.escape(title)}</span></p>
<p class="subtitle">{html.escape(subtitle)}</p>
<p class="meta">15 Minute History · narration script · {meta.group(1)} · about {meta.group(2)}</p>
<p class="question"><b>Driving question:</b> {html.escape(q)}</p>
<p class="key"><span class="vocab">Underlined</span> = vocabulary card on screen · <em>italic</em> = spoken with emphasis · timestamps are estimates until the voice is recorded</p>
{"".join(chapters)}"""
    tmp = os.path.join(ROOT, "out", "script_pdf.html")
    os.makedirs(os.path.dirname(tmp), exist_ok=True)
    open(tmp, "w").write(page)
    os.makedirs(os.path.dirname(os.path.abspath(dest)), exist_ok=True)
    subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files", "--no-pdf-header-footer",
                    f"--print-to-pdf={os.path.abspath(dest)}", "file://" + os.path.abspath(tmp)], check=True, capture_output=True)
    print("wrote", dest)


if __name__ == "__main__":
    main(*sys.argv[1:4])
