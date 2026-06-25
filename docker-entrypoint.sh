#!/bin/sh
set -eu

POCKETBASE_BIN="${POCKETBASE_BIN:-pocketbase}"

if ! command -v "$POCKETBASE_BIN" >/dev/null 2>&1; then
  POCKETBASE_BIN="./pocketbase"
fi

"$POCKETBASE_BIN" migrate up --dir=/app/pb_data --migrationsDir=/pb_migrations
