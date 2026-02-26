#!/bin/bash
set -e
PROJECT_DIR="/Users/wielkikrzychmbp/Documents/rehab-planner"
APP_URL="http://localhost:3000"

cd "$PROJECT_DIR"

echo "🏥 Rehab Planner Launcher"
echo "========================"

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "✅ Server already running on port 3000"
  open "$APP_URL"
  exit 0
fi

if [ ! -d node_modules ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo "🚀 Starting server..."
echo ""
echo "When ready, browser opens automatically."

( for i in {1..45}; do
    if curl -s "$APP_URL" >/dev/null 2>&1; then
      open "$APP_URL"
      break
    fi
    sleep 1
  done ) &

npm run dev
