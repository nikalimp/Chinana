#!/usr/bin/env python3
"""Подмножество китайского шрифта Noto Serif SC 900 — только иероглифы, которые есть на сайте.

Зачем: полный шрифт из @fontsource режется на ~100 кусков (unicode-range), их описания раздувают CSS до 100 КБ,
а первый экран ждёт 6 кусков по 30–40 КБ. Подмножество — несколько КБ.

Как работает: собирает иероглифы из src/ (ts, tsx, json, css), находит кусок @fontsource с каждым,
режет кусок до нужных знаков (fontTools) и пишет public/fonts/zh/*.woff2 и src/app/zh-font.css.
Запуск после правок с новыми иероглифами (новый вуз и т. п.):  python3 scripts/cjk-font.py
npm run check сам ругается, если на сайте есть иероглиф, которого нет в подмножестве (scripts/check-cjk.mjs).
Зависимость: pip install fonttools brotli
"""
import glob, io, os, re
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "node_modules/@fontsource/noto-serif-sc")
OUT_DIR = os.path.join(ROOT, "public/fonts/zh")
CSS_OUT = os.path.join(ROOT, "src/app/zh-font.css")


def is_cjk(c: str) -> bool:
    o = ord(c)
    return 0x2E80 <= o <= 0x9FFF or 0xF900 <= o <= 0xFAFF or 0x3000 <= o <= 0x303F or 0xFF00 <= o <= 0xFFEF


def site_chars() -> set[str]:
    chars = set()
    for pat in ("src/**/*.ts", "src/**/*.tsx", "src/**/*.json", "src/**/*.css"):
        for f in glob.glob(os.path.join(ROOT, pat), recursive=True):
            if f.endswith("zh-font.css"):
                continue
            chars |= {c for c in open(f, encoding="utf8").read() if is_cjk(c)}
    return chars


def slices():
    """[(файл куска, множество кодов)] из 900.css пакета @fontsource."""
    css = open(os.path.join(SRC, "900.css"), encoding="utf8").read()
    out = []
    for block in re.findall(r"@font-face\s*{([^}]*)}", css):
        url = re.search(r"url\(\./files/([^)]+?\.woff2)\)", block)
        rng = re.search(r"unicode-range:\s*([^;]+);", block)
        if not url or not rng:
            continue
        codes = set()
        for part in rng.group(1).split(","):
            part = part.strip()[2:]
            a, _, b = part.partition("-")
            codes |= set(range(int(a, 16), int(b or a, 16) + 1))
        out.append((url.group(1), codes))
    return out


def main():
    chars = site_chars()
    os.makedirs(OUT_DIR, exist_ok=True)
    for f in glob.glob(os.path.join(OUT_DIR, "*.woff2")):
        os.remove(f)
    faces, covered = [], set()
    for i, (fname, codes) in enumerate(slices()):
        need = sorted(ord(c) for c in chars if ord(c) in codes and ord(c) not in covered)
        if not need:
            continue
        font = TTFont(os.path.join(SRC, "files", fname))
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = []
        opts.name_IDs = []
        opts.notdef_outline = False
        s = subset.Subsetter(opts)
        s.populate(unicodes=need)
        s.subset(font)
        name = f"zh-{len(faces)}.woff2"
        buf = io.BytesIO()
        font.flavor = "woff2"
        font.save(buf)
        open(os.path.join(OUT_DIR, name), "wb").write(buf.getvalue())
        covered |= set(need)
        rng = ",".join(f"U+{c:X}" for c in need)
        faces.append(
            f"@font-face{{font-family:'Noto Serif SC Subset';font-style:normal;font-weight:900;font-display:swap;"
            f"src:url(/fonts/zh/{name}) format('woff2');unicode-range:{rng}}}"
        )
    missing = sorted(chars - {chr(c) for c in covered})
    header = (
        "/* Сгенерировано scripts/cjk-font.py — не править руками. "
        f"Иероглифов: {len(covered)}, файлов: {len(faces)}. */\n"
        f"/* chars: {''.join(sorted(chr(c) for c in covered))} */\n"
    )
    open(CSS_OUT, "w", encoding="utf8").write(header + "\n".join(faces) + "\n")
    total = sum(os.path.getsize(f) for f in glob.glob(os.path.join(OUT_DIR, "*.woff2")))
    print(f"Иероглифов: {len(covered)}, файлов: {len(faces)}, вес: {total / 1024:.1f} КБ")
    if missing:
        print("Нет в шрифте:", "".join(missing))


if __name__ == "__main__":
    main()
