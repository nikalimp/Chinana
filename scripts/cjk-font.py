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


# Библиотека (ключи иероглифов и др.) — отдельный шрифт: сотни знаков не должны утяжелять остальные страницы
LIB_FILES = ("src/content/library/radicals.ts",)
LIB_DIRS = ("src/app/library/",)


def is_lib(f: str) -> bool:
    r = os.path.relpath(f, ROOT)
    return r in LIB_FILES or any(r.startswith(d) for d in LIB_DIRS)


def site_chars(lib: bool = False) -> set[str]:
    chars = set()
    for pat in ("src/**/*.ts", "src/**/*.tsx", "src/**/*.json", "src/**/*.css"):
        for f in glob.glob(os.path.join(ROOT, pat), recursive=True):
            if f.endswith("zh-font.css") or f.endswith("zh-lib.css") or is_lib(f) != lib:
                continue
            chars |= {c for c in open(f, encoding="utf8").read() if is_cjk(c)}
    if not lib:
        # Заголовки и анонсы новостей и статей попадают на главную и страницы вузов
        for pat in ("content/news/*.md", "content/blog/*.md"):
            for f in glob.glob(os.path.join(ROOT, pat)):
                for line in open(f, encoding="utf8"):
                    if line.startswith(("title:", "summary:", "excerpt:")):
                        chars |= {c for c in line if is_cjk(c)}
    return chars


def slices(weight: int = 900):
    """[(файл куска, множество кодов)] из <weight>.css пакета @fontsource."""
    css = open(os.path.join(SRC, f"{weight}.css"), encoding="utf8").read()
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


def build(chars: set[str], out_dir: str, css_out: str, family: str, weight: int, url: str, extra_css: str = ""):
    os.makedirs(out_dir, exist_ok=True)
    for f in glob.glob(os.path.join(out_dir, "*.woff2")):
        os.remove(f)
    faces, covered = [], set()
    for i, (fname, codes) in enumerate(slices(weight)):
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
        open(os.path.join(out_dir, name), "wb").write(buf.getvalue())
        covered |= set(need)
        rng = ",".join(f"U+{c:X}" for c in need)
        faces.append(
            f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};font-display:swap;"
            f"src:url({url}{name}) format('woff2');unicode-range:{rng}}}"
        )
    missing = sorted(chars - {chr(c) for c in covered})
    header = (
        "/* Сгенерировано scripts/cjk-font.py — не править руками. "
        f"Иероглифов: {len(covered)}, файлов: {len(faces)}. */\n"
        f"/* chars: {''.join(sorted(chr(c) for c in covered))} */\n"
    )
    open(css_out, "w", encoding="utf8").write(header + "\n".join(faces) + "\n" + extra_css)
    total = sum(os.path.getsize(f) for f in glob.glob(os.path.join(out_dir, "*.woff2")))
    print(f"{family}: иероглифов {len(covered)}, файлов {len(faces)}, вес {total / 1024:.1f} КБ")
    if missing:
        print("Нет в шрифте:", "".join(missing))


def main():
    build(site_chars(), OUT_DIR, CSS_OUT, "Noto Serif SC Subset", 900, "/fonts/zh/")
    build(
        site_chars(lib=True), os.path.join(ROOT, "public/fonts/zh-lib"), os.path.join(ROOT, "src/app/library/zh-lib.css"),
        "Noto Serif SC Library", 500, "/fonts/zh-lib/",
        ".font-zh-lib{font-family:'Noto Serif SC Library','Noto Serif SC Subset',serif;font-weight:500}\n",
    )


if __name__ == "__main__":
    main()
