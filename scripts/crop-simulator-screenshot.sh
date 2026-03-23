#!/usr/bin/env bash
# Center-crop a PNG to the app's standard simulator export size (matches other slides).
# Use when a Mac window screenshot is larger because of the window shadow.
# Usage: ./scripts/crop-simulator-screenshot.sh path/to/screenshot.png
set -euo pipefail
TARGET_W=1012
TARGET_H=1936
if [[ $# -lt 1 || ! -f "$1" ]]; then
  echo "Usage: $0 <image.png>" >&2
  exit 1
fi
f=$(cd "$(dirname "$1")" && pwd)/$(basename "$1")
tmp="${f}.cropping.png"
sips -c "${TARGET_H}" "${TARGET_W}" "$f" --out "$tmp"
mv "$tmp" "$f"
echo "Cropped to ${TARGET_W}x${TARGET_H}: $f"
