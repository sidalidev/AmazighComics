#!/bin/bash
set -e

echo "🚀 Deploying Amazigh Comics..."

# Build and deploy
docker compose build
docker compose up -d

echo "✅ Amazigh Comics is live!"
