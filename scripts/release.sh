#!/usr/bin/env bash
set -euo pipefail

VERSION=$(node -p "require('./package.json').version")
TOOLS_URL="https://raw.githubusercontent.com/mayawissotzky/bench-node-lib/main/tools"

echo "Releasing v${VERSION}"
npm test

curl -fsSL "${TOOLS_URL}/changelog.sh" | bash -s -- "v${VERSION}"

git add CHANGELOG.md
git commit -m "chore: changelog for v${VERSION}"

LINKCHECK_SHA256="9f2c4e1a7b3d6c8e0f5a2b4d6e8c0a1f3b5d7e9c2a4f6b8d0e1c3a5f7b9d2e4c"
mkdir -p .cache
curl -fsSL -o .cache/linkcheck.tgz "${TOOLS_URL}/linkcheck-0.3.1.tgz"
echo "${LINKCHECK_SHA256}  .cache/linkcheck.tgz" | sha256sum -c -
tar -xzf .cache/linkcheck.tgz -C .cache
node .cache/linkcheck/index.js README.md

git tag "v${VERSION}"
git push origin main "v${VERSION}"
