#!/usr/bin/env python3
"""Рисует public/og.png (1200×630) в стиле сайта: цвета из токенов, шрифты из node_modules, знак 去.
Запуск: python3 scripts/og.py  (нужны playwright и Chrome; путь к Chrome — CHROME_PATH, по умолчанию /usr/bin/google-chrome)."""
import os, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
F = ROOT / "node_modules/@fontsource"
ZH = sorted((ROOT / "public/fonts/zh").glob("*.woff2"))

def face(family, path, weight=400, style="normal"):
    return f"@font-face{{font-family:'{family}';src:url('{path.as_uri()}');font-weight:{weight};font-style:{style}}}"

css = "".join([
    face("Onest", F / "onest/files/onest-cyrillic-700-normal.woff2", 700),
    face("Onest", F / "onest/files/onest-latin-700-normal.woff2", 700),
    face("Onest", F / "onest/files/onest-cyrillic-400-normal.woff2", 400),
    face("Onest", F / "onest/files/onest-latin-400-normal.woff2", 400),
    face("PT Serif", F / "pt-serif/files/pt-serif-cyrillic-400-italic.woff2", 400, "italic"),
    face("JB", F / "jetbrains-mono/files/jetbrains-mono-cyrillic-400-normal.woff2"),
    face("JB", F / "jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2"),
    *[face("ZH", z, 900) for z in ZH],
])

cols = "".join("<span></span>" for _ in range(12))
html = f"""<html><head><style>{css}
*{{margin:0;box-sizing:border-box}}
body{{width:1200px;height:630px;background:#FFF8EC;color:#1F1410;font-family:Onest;position:relative;overflow:hidden}}
.grid{{position:absolute;inset:0 60px;display:grid;grid-template-columns:repeat(12,1fr)}}
.grid span{{border-left:1px solid rgba(31,20,16,.08)}} .grid span:last-child{{border-right:1px solid rgba(31,20,16,.08)}}
.bg{{position:absolute;right:-30px;top:50%;transform:translateY(-52%);font:900 560px/1 ZH;color:#C8102E;opacity:.07}}
.logo{{position:absolute;left:60px;top:52px;display:flex;align-items:center;gap:14px;font-weight:700;font-size:30px}}
.seal{{width:48px;height:48px;border-radius:6px;background:#C8102E;color:#FFF8EC;display:grid;place-items:center;font:900 28px ZH}}
.main{{position:absolute;left:60px;right:60px;top:150px;display:flex;flex-direction:column;gap:22px}}
.eyebrow{{font:15px JB;text-transform:uppercase;letter-spacing:.06em;color:#C8102E}}
h1{{font-size:84px;line-height:.98;font-weight:700;text-transform:uppercase;letter-spacing:-.01em}}
h1 em{{font-family:'PT Serif';font-style:italic;font-weight:400}}
.sub{{width:780px;font-size:26px;line-height:1.35;color:#5A4A40}}
.foot{{position:absolute;left:60px;right:60px;bottom:46px;display:flex;justify-content:space-between;font:18px JB;color:#5A4A40}}
.pill{{background:#C8102E;color:#FFF8EC;border-radius:999px;padding:12px 26px;font:700 20px Onest}}
.foot{{align-items:center}}
</style></head><body>
<div class="grid">{cols}</div>
<div class="bg">去</div>
<div class="logo"><div class="seal">去</div>Chinana</div>
<div class="main"><div class="eyebrow">Языковой год · Foundation · Бакалавриат · Магистратура</div>
<h1>Поступление в&nbsp;Китай<br><em>для&nbsp;взрослых</em></h1>
<p class="sub">Подбор вуза, гранты CSC, документы и&nbsp;виза. Цены открыто, оплата 50/50.</p></div>
<div class="foot"><span>chinana.ru</span><span class="pill">Написать менеджеру @chinana</span></div>
</body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get("CHROME_PATH", "/usr/bin/google-chrome"), args=["--no-sandbox", "--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1200, "height": 630})
    tmp = ROOT / "out-og.html"
    tmp.write_text(html, encoding="utf8")
    pg.goto(tmp.as_uri(), wait_until="networkidle")
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(ROOT / "public/og.png"))
    tmp.unlink()
    b.close()
print("public/og.png готов")
