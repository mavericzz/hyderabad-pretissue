#!/bin/bash
# Daily IndiaRace scrape → LTO sheet / pretissue, then push to GitHub Pages.
# Called by launchd (com.indiarace.daily) or `npm run daily`.
#
# Deploy: scrape writes src/meetings, this script commits that folder and
# pushes origin/main. .github/workflows/pages.yml builds dist/ on GitHub.

set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"
export HOME="${HOME:-/Users/toshasharma}"
export GIT_TERMINAL_PROMPT=0

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

TODAY="$(TZ=Asia/Kolkata date +%Y-%m-%d)"
LOG="$LOG_DIR/indiarace_daily_${TODAY}.log"

cd "$ROOT"

log() {
  echo "$(date): $*" | tee -a "$LOG"
}

if ! command -v node >/dev/null 2>&1; then
  log "FATAL — node not found"
  exit 127
fi

log "IndiaRace daily starting (from $TODAY, 3 days)"
set +e
node --experimental-strip-types --no-warnings scripts/indiarace/daily.ts --from "$TODAY" --days 3 >>"$LOG" 2>&1
SCRAPE_EXIT=$?
set -e

if [[ "$SCRAPE_EXIT" -ne 0 ]]; then
  log "scrape failed with $SCRAPE_EXIT — skip deploy"
  find "$LOG_DIR" -name "indiarace_daily_*.log" -mtime +30 -delete 2>/dev/null || true
  exit "$SCRAPE_EXIT"
fi

log "scrape ok"

deploy_pages() {
  if [[ "${INDIARACE_SKIP_DEPLOY:-}" == "1" ]]; then
    log "INDIARACE_SKIP_DEPLOY=1 — skip GitHub Pages push"
    return 0
  fi

  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    log "not a git repo — skip deploy"
    return 0
  fi

  git add src/meetings
  if git diff --cached --quiet; then
    log "no meeting file changes — skip commit"
    return 0
  fi

  log "building before deploy"
  if ! npm run build >>"$LOG" 2>&1; then
    log "build failed — skip deploy"
    git restore --staged src/meetings >/dev/null 2>&1 || true
    return 1
  fi

  git commit -m "$(cat <<EOF
Publish IndiaRace cards for ${TODAY}.

Auto-built from IndiaRace racecards by the daily job.
EOF
)" >>"$LOG" 2>&1

  log "pushing origin HEAD for GitHub Pages"
  if ! git push origin HEAD >>"$LOG" 2>&1; then
    log "git push failed"
    return 1
  fi
  log "deploy pushed — Pages will rebuild https://mavericzz.github.io/hyderabad-pretissue/"
  return 0
}

set +e
deploy_pages
DEPLOY_EXIT=$?
set -e

find "$LOG_DIR" -name "indiarace_daily_*.log" -mtime +30 -delete 2>/dev/null || true

if [[ "$DEPLOY_EXIT" -ne 0 ]]; then
  log "IndiaRace daily scrape ok, deploy failed ($DEPLOY_EXIT)"
  exit "$DEPLOY_EXIT"
fi

log "IndiaRace daily finished"
exit 0
