#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"

echo "Running Snake game on: http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
python3 -m http.server "${PORT}"
