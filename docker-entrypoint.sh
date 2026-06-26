#!/bin/sh
set -eu

POCKETBASE_BIN="${POCKETBASE_BIN:-/pb/pocketbase}"
PB_DATA_DIR="${PB_DATA_DIR:-/pb/pb_data}"
PB_MIGRATIONS_DIR="${PB_MIGRATIONS_DIR:-/pb/pb_migrations}"
PB_HTTP="${PB_HTTP:-0.0.0.0:8080}"

if [ "$#" -gt 0 ]; then
  exec "$@"
fi

"$POCKETBASE_BIN" migrate up \
  --dir="$PB_DATA_DIR" \
  --migrationsDir="$PB_MIGRATIONS_DIR"

exec "$POCKETBASE_BIN" serve \
  --http="$PB_HTTP" \
  --dir="$PB_DATA_DIR" \
  --migrationsDir="$PB_MIGRATIONS_DIR"
