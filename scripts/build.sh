#!/bin/bash
# Build and compose the TypeScript WASI HTTP component
# Usage: ./scripts/build.sh [version]

set -e

VERSION="${1:-0.1.2}"
REPO="dufeut/mik-sdk"

echo "==> Installing npm dependencies..."
npm install --silent

# Auto-fetch WIT deps if missing
if [ ! -d "wit/deps" ]; then
  echo "==> Fetching WIT dependencies from mik-sdk v$VERSION..."
  mkdir -p wit/deps
  curl -sL "https://github.com/$REPO/releases/download/v$VERSION/wit-deps.tar.gz" | tar -xz -C wit/deps
fi

echo "==> Bundling TypeScript..."
npm run build:bundle --silent

echo "==> Componentizing to WASM..."
npm run build:wasm --silent

# Download bridge if not cached
BRIDGE="dist/mik-bridge-${VERSION}.wasm"
if [ ! -f "$BRIDGE" ]; then
  echo "==> Downloading bridge v${VERSION}..."
  curl -sL "https://github.com/$REPO/releases/download/v$VERSION/mik-bridge.wasm" -o "$BRIDGE"
fi

echo "==> Composing components..."
wac plug "$BRIDGE" --plug dist/handler.wasm -o dist/service.wasm

# Strip if wasm-tools available
if command -v wasm-tools &> /dev/null; then
  echo "==> Stripping debug info..."
  wasm-tools strip --all dist/service.wasm -o dist/service.wasm
fi

SIZE=$(ls -lh dist/service.wasm | awk '{print $5}')
echo ""
echo "Done: dist/service.wasm ($SIZE)"
echo ""
echo "Run with:"
echo "  mik run dist/service.wasm"
echo "  wasmtime serve -S cli=y dist/service.wasm"
echo ""
echo "Test with:"
echo "  curl http://localhost:8080/"
