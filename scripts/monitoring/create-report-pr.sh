#!/usr/bin/env bash
set -euo pipefail

BRANCH="auto/monitoring/$(date -u +%Y%m%d-%H%M%S)"
RUN_DATE="$(date -u +%Y-%m-%d)"

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git checkout -b "$BRANCH"

for item in data-staging/monitoring data-staging/watchlists/auto data-staging/watchlists/resolution; do
  if [ -e "$item" ]; then
    git add "$item"
  fi
done

git commit -m "Add HEI auto monitoring report"
git push origin "$BRANCH"

BODY_FILE="/tmp/hei-monitoring-pr-body.md"
SUMMARY_FILE="$(find data-staging/monitoring -name summary.md | sort | tail -n 1)"
REPORT_DIR="$(dirname "$SUMMARY_FILE")"

cat > "$BODY_FILE" <<EOF
## HEI auto monitoring report

Run date: $RUN_DATE

- Monitoring report directory: $REPORT_DIR
- Summary file: $SUMMARY_FILE
- State file: data-staging/monitoring/state/latest-findings.json

Open the summary file in this PR. Canonical data files must not be changed by monitoring PRs.
EOF

gh pr create \
  --base main \
  --head "$BRANCH" \
  --title "Auto monitoring report: $RUN_DATE" \
  --body-file "$BODY_FILE"
