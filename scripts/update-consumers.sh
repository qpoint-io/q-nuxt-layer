#!/usr/bin/env sh
#
# Refresh every consumer's lockfile to the latest published layer.
#
# All consumers declare `"@qpoint-io/q-nuxt-layer": "latest"`, but npm resolves
# that at install time and pins the result (version + integrity) in the
# lockfile. Run this after each publish to re-resolve. Requires GITHUB_TOKEN
# with read:packages in the environment (consumer .npmrc files reference it).
#
set -e
cd "$(dirname "$0")/.."

# qcontrol-qdash-ref is deliberately absent — frozen reference checkout, pinned.
# app.qpoint.io is absent since 2026-11-12 — stale since qdash took over (2026-10-02).
# www.qpoint.io is absent since 2026-11-12 — Rob ships on its main (layer 0.9.0 there);
# bump it by hand when he wants the layer.
CONSUMERS="../design ../bob-wire ../qflow ../qcontrol/crates/qdash/ui"

for dir in $CONSUMERS; do
  if [ ! -f "$dir/package.json" ]; then
    echo "── $dir — missing, skipping"
    continue
  fi
  echo "── $dir"
  (cd "$dir" && npm update @qpoint-io/q-nuxt-layer)
done

echo "✓ all consumer lockfiles updated"
