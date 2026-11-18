#!/bin/bash
# Новости вузов — ежедневный запуск на Маке Ника (задача bb «Chinana — новости вузов», каждый день в 12:34).
# Работает в отдельной копии репозитория, чтобы не трогать рабочую папку: свежий main → run.mjs → коммит → push.
# Push в main запускает Deploy в GitHub Actions: сборка и выкладка на chinana.ru.
set -euo pipefail
export PATH="$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"

SRC="$(cd "$(dirname "$0")/../.." && pwd)"         # рабочая папка сайта — отсюда берём адрес репозитория и ключи
WORK="${CHINANA_NEWS_DIR:-$HOME/Library/Application Support/chinana-news/repo}"
REMOTE="$(git -C "$SRC" remote get-url origin)"

if [ ! -d "$WORK/.git" ]; then
  mkdir -p "$(dirname "$WORK")"
  git clone -q "$REMOTE" "$WORK"
fi
cd "$WORK"
git fetch -q origin main
git checkout -q main
git reset -q --hard origin/main

# Ключи ИИ (необязательно): content/factory/.env рабочей папки
[ -f "$SRC/content/factory/.env" ] && cp "$SRC/content/factory/.env" content/factory/.env

node scripts/news/run.mjs "$@"

git add content/news content/factory/news
if git diff --cached --quiet; then
  echo "Новых файлов нет — коммит не нужен"
  exit 0
fi
n=$(git diff --cached --name-only -- content/news | wc -l | tr -d ' ')
git commit -q -m "новости вузов: $(date +%F), файлов $n"
for i in 1 2 3; do
  git push -q origin main && { echo "Отправлено в main: $n файлов, выкладка — GitHub Actions"; exit 0; }
  git pull -q --rebase origin main
done
echo "Не удалось отправить в main" >&2
exit 1
