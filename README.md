# Paynest-DB

PocketBase database setup for Paynest.

Docker Compose uses the project name `paynest-db` and runs one service:

- `pocketbase`: the published Paynest PocketBase image.

The image downloads PocketBase during build using the `PB_VERSION` Docker build
argument and selects the matching release binary for `amd64`, `arm64`, or
`arm/v7`. At startup, the image runs the database migration first. If migration
succeeds, it starts the PocketBase server. If migration fails, the container
exits before starting PocketBase.

## Requirements

- Docker
- Docker Compose

## Setup

Copy the example environment file if you need local environment values:

```sh
cp .env.example .env
```

Start PocketBase:

```sh
docker compose up -d
```

Compose pulls `ghcr.io/tfourj/paynest-db:latest`. Migrations run automatically
inside the container before PocketBase starts.

To build the image from local files instead of pulling the published image, use:

```sh
docker compose -f local-compose.yml up -d --build
```

For Coolify, deploy this repository with Docker Compose and persist the `pocketbase-data` volume.

GitHub Actions publishes the Docker image to GitHub Container Registry on pushes to
`main`, `master`, version tags, or manual workflow runs:

```text
ghcr.io/tfourj/paynest-db
```

Branch and manual builds publish `:latest` and `:dev`. Version tag builds publish
`:stable` and the matching git tag, such as `:v1.1.0`.

PocketBase will be available at:

```text
http://localhost:8090
```

The admin UI is available at:

```text
http://localhost:8090/_/
```

## Data

DB data is stored in the `pocketbase-data` Docker volume at `/pb/pb_data`.

Fresh installs start with an empty database and run the migration on first
startup. No users, subscriptions, settings, or encrypted records are included in
the image or repository.

To reset a local Docker Compose database back to that initial empty state:

```sh
docker compose down -v
docker compose up -d
```

If you started the local build compose file instead, use:

```sh
docker compose -f local-compose.yml down -v
docker compose -f local-compose.yml up -d --build
```

These commands delete the local `pocketbase-data` volume. Back up anything you
need before running them.

PocketBase tracks applied migration filenames in its internal `_migrations` table.

The initial migration creates the app collections used by Paynest:

- `subscriptions`
- `settings`
- `user_keys`
- `encrypted_subscriptions`
- `encrypted_settings`

When cloud encryption is enabled in the app, `user_keys` stores the encrypted
per-user master key, `encrypted_subscriptions` stores one encrypted payload per
subscription, and `encrypted_settings` stores one encrypted payload per user.
API rules restrict each user to their own records with `user = @request.auth.id`.

## Rate Limits and Batch Sync

Keep the PocketBase rate limiter enabled in production. Paynest uses the
PocketBase batch API for multi-subscription imports and full sync operations so
large uploads do not need one HTTP request per subscription.

Configure these runtime settings from the PocketBase admin dashboard:

- Enable batch requests in `Settings > Application > Batch`.
- Use a `maxRequests` value of at least `50`; the app sends chunks of up to 25
  record operations per batch request.
- Keep a dedicated rate-limit rule for `/api/batch`, for example 3 requests per
  1 second, and keep the broader `/api/`, auth, and create limits active.
- Use small practical batch timeout and body-size limits for your deployment.

If PocketBase is behind Coolify, NGINX, Caddy, or another reverse proxy, also set
PocketBase's trusted proxy IP headers in `Settings > Application` so rate limits
use the real client IP. Common headers are `X-Real-IP` and `X-Forwarded-For`.
