#!/usr/bin/env python3
"""Фото вузов с Wikimedia Commons: кандидаты → выбор → обложки 1200×675 и атрибуция.

  python3 scripts/uni-photos.py candidates DIR       # до 4 кандидатов на вуз в DIR + DIR/candidates.json
  python3 scripts/uni-photos.py apply DIR picks.json # picks: {slug: номер кандидата} → public/universities/{slug}/cover.jpg + src/content/data/uni-photos.json
Лицензии: только CC0, Public domain, CC BY, CC BY-SA. Подпись с автором и лицензией на сайте обязательна.
"""
import json, re, sys, html, time, urllib.error, urllib.parse, urllib.request, pathlib, io
from PIL import Image

UA = "ChinanaBot/1.0 (https://chinana.ru)"
API = "https://commons.wikimedia.org/w/api.php"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OK = re.compile(r"^(CC0( 1\.0)?|Public domain|CC BY(-SA)? [\d.]+( \w+)?)$", re.I)


def get(url, tries=6):
    # Commons отвечает 429 на частые запросы: пауза между запросами и повтор с растущей паузой
    for i in range(tries):
        time.sleep(8)
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or i == tries - 1:
                raise
            time.sleep(int(e.headers.get("Retry-After") or 0) or 10 * (i + 1))


def api(**q):
    q.update(format="json", formatversion=2)
    return json.loads(get(API + "?" + urllib.parse.urlencode(q)))


def strip(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def info(titles):
    d = api(action="query", titles="|".join(titles), prop="imageinfo", iiprop="url|size|extmetadata|mime", iiurlwidth=1280)
    out = []
    for p in d["query"]["pages"]:
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            continue
        m = ii["extmetadata"]
        out.append({
            "title": p["title"], "w": ii["width"], "h": ii["height"], "mime": ii["mime"],
            "thumb": ii.get("thumburl") or ii["url"], "page": ii["descriptionurl"],
            "license": strip(m.get("LicenseShortName", {}).get("value")),
            "licenseUrl": strip(m.get("LicenseUrl", {}).get("value")),
            "author": strip(m.get("Artist", {}).get("value"))[:120],
        })
    return out


def search(q):
    # Поиск и сведения о файлах одним запросом: Commons строго ограничивает частоту
    d = api(action="query", generator="search", gsrsearch=q + " filetype:bitmap", gsrnamespace=6, gsrlimit=25,
            prop="imageinfo", iiprop="url|size|extmetadata|mime", iiurlwidth=1280)
    out = []
    for p in sorted(d.get("query", {}).get("pages", []), key=lambda p: p.get("index", 0)):
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            continue
        m = ii["extmetadata"]
        out.append({"title": p["title"], "w": ii["width"], "h": ii["height"], "mime": ii["mime"],
                    "thumb": ii.get("thumburl") or ii["url"], "page": ii["descriptionurl"],
                    "license": strip(m.get("LicenseShortName", {}).get("value")),
                    "licenseUrl": strip(m.get("LicenseUrl", {}).get("value")),
                    "author": strip(m.get("Artist", {}).get("value"))[:120]})
    return out


def candidates(dirp, n=3):
    unis = json.load(open(ROOT / "src/content/data/universities.json"))
    dirp = pathlib.Path(dirp)
    dirp.mkdir(parents=True, exist_ok=True)
    cfile = dirp / "candidates.json"
    res = json.load(open(cfile)) if cfile.exists() else {}
    for u in unis:
        if res.get(u["slug"]):
            continue
        cands = [c for c in search(f'"{u["nameEn"]}"') if c["mime"] == "image/jpeg" and c["w"] >= 1200 and c["w"] / c["h"] >= 1.2 and OK.match(c["license"])]
        res[u["slug"]] = cands[:n]
        for i, c in enumerate(cands[:n]):
            (dirp / f'{u["slug"]}-{i}.jpg').write_bytes(get(c["thumb"]))
        json.dump(res, open(cfile, "w"), ensure_ascii=False, indent=1)
        print(u["slug"], len(cands[:n]), flush=True)


def apply(dirp, picks):
    # picks: {slug: номер кандидата}. Берёт уже скачанные кадры из DIR — без новых запросов к Commons.
    dirp = pathlib.Path(dirp)
    cands = json.load(open(dirp / "candidates.json"))
    picks = json.load(open(picks))
    out_file = ROOT / "src/content/data/uni-photos.json"
    out = json.load(open(out_file)) if out_file.exists() else {}
    for slug, i in picks.items():
        c = cands[slug][i]
        im = Image.open(dirp / f"{slug}-{i}.jpg").convert("RGB")
        W, H = 1200, 675
        s = max(W / im.width, H / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        l, t = (im.width - W) // 2, (im.height - H) // 2
        d = ROOT / "public/universities" / slug
        d.mkdir(parents=True, exist_ok=True)
        im.crop((l, t, l + W, t + H)).save(d / "cover.jpg", quality=78, optimize=True, progressive=True)
        out[slug] = {"src": f"/universities/{slug}/cover.jpg", "author": c["author"] or "автор не указан",
                     "license": c["license"], "licenseUrl": c["licenseUrl"], "source": c["page"]}
        print(slug, c["license"], c["author"][:50])
    json.dump(out, open(out_file, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    if sys.argv[1] == "candidates":
        candidates(sys.argv[2])
    else:
        apply(sys.argv[2], sys.argv[3])
