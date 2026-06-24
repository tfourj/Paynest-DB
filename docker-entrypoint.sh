#!/bin/sh
set -eu

./pocketbase migrate up --dir=/pb_data --migrationsDir=/pb_migrations

exec ./pocketbase serve --http=0.0.0.0:8090 --dir=/pb_data --migrationsDir=/pb_migrations
