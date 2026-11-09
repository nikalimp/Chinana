#!/usr/bin/env python3
"""Запасные шрифты с подогнанными метриками — против сдвига вёрстки (CLS) при подмене шрифтов.

Пока Onest и PT Serif грузятся, браузер рисует текст системным шрифтом. Без поправок заголовки
меняют ширину и высоту строк при подмене — Lighthouse на живом сайте показал CLS 0,23.
Скрипт берёт метрики наших шрифтов (fontTools) и пишет @font-face «Onest Fallback» и «PT Serif Fallback»
на основе Arial и Times New Roman с size-adjust и ascent/descent-override (тот же приём, что в next/font).
Запуск после npm run build (берёт текст из out/): python3 scripts/font-fallbacks.py  → src/app/font-fallbacks.css
"""
import os
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = os.path.join(ROOT, "node_modules/@fontsource")

# Системные шрифты меряем по Liberation Sans / Serif — у них те же метрики, что у Arial / Times New Roman
LIB = "/usr/share/fonts/truetype/liberation"
SYSTEM = {
    "Arial": dict(file=f"{LIB}/LiberationSans-Regular.ttf", local=["Arial", "ArialMT", "Helvetica", "Liberation Sans"]),
    "Arial Bold": dict(file=f"{LIB}/LiberationSans-Bold.ttf", local=["Arial Bold", "Arial-BoldMT", "Helvetica Bold", "Liberation Sans Bold"]),
    "Times New Roman Italic": dict(file=f"{LIB}/LiberationSerif-Italic.ttf", local=["Times New Roman Italic", "TimesNewRomanPS-ItalicMT", "Times Italic", "Liberation Serif Italic"]),
}


def metrics(path):
    f = TTFont(path)
    upm = f["head"].unitsPerEm
    hhea, os2 = f["hhea"], f["OS/2"]
    # Средняя ширина по строчной кириллице и латинице — ближе к реальному тексту, чем xAvgCharWidth
    cmap, hmtx = f.getBestCmap(), f["hmtx"]
    sample = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz "
    widths = [hmtx[cmap[ord(c)]][0] for c in sample if ord(c) in cmap]
    avg = sum(widths) / len(widths) if widths else os2.xAvgCharWidth
    return dict(upm=upm, asc=hhea.ascent, desc=-hhea.descent, gap=hhea.lineGap, avg=avg)


def advances(paths):
    """{символ: ширина в долях em} по всем файлам начертания (у @fontsource кириллица и латиница — разные файлы)."""
    adv = {}
    for path in paths:
        f = TTFont(path)
        cmap, hmtx, upm = f.getBestCmap(), f["hmtx"], f["head"].unitsPerEm
        for code, g in cmap.items():
            adv.setdefault(chr(code), hmtx[g][0] / upm)
    return adv


def sample(upper=False):
    """Текст сайта: абзацы для обычного начертания, заголовки (прописными) — для жирного и курсива."""
    import glob, html, re
    out = []
    for f in glob.glob(os.path.join(ROOT, "out/**/index.html"), recursive=True)[:40]:
        t = open(f, encoding="utf8").read()
        tag = r"<h[12][^>]*>(.*?)</h[12]>" if upper else r"<p[^>]*>(.*?)</p>"
        out += [html.unescape(re.sub(r"<[^>]+>", "", x)) for x in re.findall(tag, t, re.S)]
    text = " ".join(out)
    return text.upper() if upper else text


def face(family, src, sys_name, weight, style="normal", upper=False):
    m = metrics(src)
    s = SYSTEM[sys_name]
    ours, sys_adv = advances([src, src.replace("-cyrillic-", "-latin-")]), advances([s["file"]])
    text = [c for c in sample(upper) if c in ours and c in sys_adv]
    # size-adjust = во сколько раз наш шрифт шире системного на настоящем тексте сайта
    size_adjust = sum(ours[c] for c in text) / sum(sys_adv[c] for c in text)
    pct = lambda v: f"{v / m['upm'] / size_adjust * 100:.2f}%"
    local = ",".join(f'local("{n}")' for n in s["local"])
    return (
        f"@font-face{{font-family:'{family}';src:{local};font-weight:{weight};font-style:{style};"
        f"size-adjust:{size_adjust * 100:.2f}%;ascent-override:{pct(m['asc'])};descent-override:{pct(m['desc'])};line-gap-override:{pct(m['gap'])}}}"
    )


css = [
    "/* Сгенерировано scripts/font-fallbacks.py — не править руками. */",
    face("Onest Fallback", f"{F}/onest/files/onest-cyrillic-400-normal.woff2", "Arial", "100 500"),
    face("Onest Fallback", f"{F}/onest/files/onest-cyrillic-700-normal.woff2", "Arial Bold", "600 900", upper=True),
    face("PT Serif Fallback", f"{F}/pt-serif/files/pt-serif-cyrillic-400-italic.woff2", "Times New Roman Italic", "400", "italic", upper=True),
]
open(os.path.join(ROOT, "src/app/font-fallbacks.css"), "w", encoding="utf8").write("\n".join(css) + "\n")
print("\n".join(css))
