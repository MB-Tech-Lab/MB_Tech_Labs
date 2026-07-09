#!/bin/bash
# Backend server keepalive script
# Restarts the server if it dies

cd /home/z/my-project/backend

while true; do
  echo "[$(date)] Starting backend server..."
  bun run src/server.ts >> logs/server.log 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE. Restarting in 2s..."
  sleep 2
done
