#!/bin/bash
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
DEST="$HOME/Library/Application Support/Adobe/CEP/extensions/JaiafaTools"
mkdir -p "$(dirname "$DEST")"
rm -rf "$DEST"
cp -R "$HERE" "$DEST"
defaults write com.adobe.CSXS.12 PlayerDebugMode 1 || true
defaults write com.adobe.CSXS.11 PlayerDebugMode 1 || true
defaults write com.adobe.CSXS.10 PlayerDebugMode 1 || true
echo "Installed Jaiafa Tools to: $DEST"
echo "Restart Illustrator, then open Window > Extensions (Legacy) > Jaiafa Tools."
read -n 1 -s -r -p "Press any key to close..."
