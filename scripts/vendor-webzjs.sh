#!/usr/bin/env bash
# Builds the WebZjs WASM packages from source into packages/scaffold-zec/vendor/.
# WebZjs is not published to npm yet, so we build it ourselves.
#
# Requirements:
#   - rustup (nightly toolchain + rust-src are installed automatically)
#   - wasm-pack (installed automatically via npm if missing)
#   - A clang that can target wasm32-unknown-unknown for C deps (secp256k1):
#       * Linux: distro clang works
#       * macOS: Apple clang can NOT — install LLVM (brew install llvm) or use
#         the Docker path: ./scripts/vendor-webzjs.sh --docker
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR_DIR="$REPO_ROOT/packages/scaffold-zec/vendor"
WORK_DIR="${WEBZJS_WORK_DIR:-$(mktemp -d)}/WebZjs"

if [[ "${1:-}" == "--docker" ]]; then
  # Build inside the official Rust image — sidesteps macOS clang issues.
  docker run --rm -v "$VENDOR_DIR:/vendor" rustlang/rust:nightly bash -c '
    set -euo pipefail
    apt-get update -qq && apt-get install -y -qq clang curl git >/dev/null
    curl -sSf https://rustwasm.github.io/wasm-pack/installer/init.sh | sh >/dev/null
    rustup component add rust-src
    git clone --depth 1 https://github.com/ChainSafe/WebZjs.git /work
    cd /work/crates/webzjs-wallet
    wasm-pack build -t web --release --scope chainsafe \
      --out-dir ../../packages/webzjs-wallet \
      --no-default-features --features="wasm wasm-parallel" \
      -Z build-std="panic_abort,std"
    cd /work && sh ./add-worker-module.sh || true
    cd /work/crates/webzjs-keys
    wasm-pack build -t web --release --scope chainsafe \
      --out-dir ../../packages/webzjs-keys \
      --no-default-features -Z build-std="panic_abort,std"
    mkdir -p /vendor
    cp -r /work/packages/webzjs-wallet /vendor/webzjs-wallet
    cp -r /work/packages/webzjs-keys /vendor/webzjs-keys
  '
  echo "✅ Vendored into $VENDOR_DIR"
  exit 0
fi

command -v wasm-pack >/dev/null || npm install -g wasm-pack
rustup toolchain install nightly --component rust-src

git clone --depth 1 https://github.com/ChainSafe/WebZjs.git "$WORK_DIR"
cd "$WORK_DIR"
rustup override set nightly

# macOS: point cargo's C compilation at LLVM clang if available
if [[ "$(uname)" == "Darwin" && -x /opt/homebrew/opt/llvm/bin/clang ]]; then
  export CC_wasm32_unknown_unknown=/opt/homebrew/opt/llvm/bin/clang
  export AR_wasm32_unknown_unknown=/opt/homebrew/opt/llvm/bin/llvm-ar
fi

(cd crates/webzjs-wallet && wasm-pack build -t web --release --scope chainsafe \
  --out-dir ../../packages/webzjs-wallet \
  --no-default-features --features="wasm wasm-parallel" \
  -Z build-std="panic_abort,std")
sh ./add-worker-module.sh || true
(cd crates/webzjs-keys && wasm-pack build -t web --release --scope chainsafe \
  --out-dir ../../packages/webzjs-keys \
  --no-default-features -Z build-std="panic_abort,std")

mkdir -p "$VENDOR_DIR"
rm -rf "$VENDOR_DIR/webzjs-wallet" "$VENDOR_DIR/webzjs-keys"
cp -r packages/webzjs-wallet "$VENDOR_DIR/webzjs-wallet"
cp -r packages/webzjs-keys "$VENDOR_DIR/webzjs-keys"
echo "✅ Vendored into $VENDOR_DIR"
