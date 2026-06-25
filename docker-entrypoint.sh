#!/bin/sh
set -eu

POCKETBASE_BIN="${POCKETBASE_BIN:-/pb/pocketbase}"

"$POCKETBASE_BIN" migrate up --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations
