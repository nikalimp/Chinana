#!/bin/bash
# План 3 выкладки — вручную с Mac, когда в Actions не прошли ни SSH, ни FTP.
# Копия кладётся в проект как scripts/deploy-<app>.sh и заполняется под проект (website:update делает это сам).
# Запуск: bash scripts/deploy-site.sh            — собрать и залить
#         bash scripts/deploy-site.sh <папка>    — залить готовую сборку (например, скачанный артефакт site-build)
set -euo pipefail
# Доступы записал мастер deploy-kit/setup-site.sh: ~/.config/nikitos/chinana.env (SSH_HOST, SSH_USER, SITE_DIR)
ENV_FILE="$HOME/.config/nikitos/chinana.env"
[ -f "$ENV_FILE" ] && . "$ENV_FILE"
: "${SSH_USER:?Нет SSH_USER в $ENV_FILE — запусти setup-site.sh или впиши вручную}"
: "${SSH_HOST:?Нет SSH_HOST в $ENV_FILE — впиши строку SSH_HOST=serverNNN.hosting.reg.ru}"
HOST="$SSH_USER@$SSH_HOST"
DIR="${SITE_DIR:-/var/www/$SSH_USER/data/www/chinana.ru/}"
KEY="$HOME/.ssh/chinana_deploy"                           # ключ деплоя проекта (создал setup-site.sh)
APP="$(cd "$(dirname "$0")/.." && pwd)"                   # папка приложения (монорепо: …/apps/site)
OUT="${1:-}"
EXCLUDE=(--exclude '.well-known/' --exclude 'cgi-bin/' --exclude '.ftp-deploy-sync-state.json' --exclude 'api/config.php')   # + подпапки других приложений: --exclude 'test/'

if [ -z "$OUT" ]; then
  cd "$APP"; [ -d node_modules ] || npm ci
  if npm run | grep -q "^  check$"; then npm run check; else npm run build; fi
  OUT="$APP/out"; [ -d "$OUT" ] || OUT="$APP/dist"
fi
ssh -i "$KEY" "$HOST" "mkdir -p '$DIR'"
rsync -az --delete --stats "${EXCLUDE[@]}" -e "ssh -i $KEY" "${OUT%/}/" "$HOST:$DIR"
echo "Готово: $DIR"
