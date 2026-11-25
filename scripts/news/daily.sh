#!/bin/bash
# Новости вузов — ежедневный запуск на Маке Ника (задача bb «Chinana — новости вузов», каждый день в 12:34).
# Работает в отдельной копии репозитория, чтобы не трогать рабочую папку: свежий main → run.mjs → коммит → push.
# Push в main запускает Deploy в GitHub Actions: сборка и выкладка на chinana.ru.
set -euo pipefail
export PATH="$HOME/.gemini/bin:$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"

SRC="$(cd "$(dirname "$0")/../.." && pwd)"         # рабочая папка сайта — отсюда берём адрес репозитория и ключи
WORK="${CHINANA_NEWS_DIR:-$HOME/Library/Application Support/chinana-news/repo}"
REMOTE="$(git -C "$SRC" remote get-url origin)"

# При пробуждении Mac сеть и DNS поднимаются не сразу — ждём до 90 с
net_ok=0
for _ in $(seq 1 18); do
  if curl -fsSI --max-time 5 https://github.com >/dev/null 2>&1; then
    net_ok=1
    break
  fi
  sleep 5
done
if [ "$net_ok" -ne 1 ]; then
  echo "Сеть не поднялась за 90 с: github.com недоступен" >&2
  exit 1
fi

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
