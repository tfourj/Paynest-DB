# Paynest-DB

PocketBase database setup for Paynest.

Docker Compose uses the project name `paynest-db` and runs one service:

- `pocketbase`: the published Paynest PocketBase image.

The image downloads PocketBase during build using the `PB_VERSION` Docker build
argument and selects the matching release binary for `amd64`, `arm64`, or
`arm/v7`. At startup, the image runs migrations first. If migrations succeed,
it starts the PocketBase server. If migrations fail, the container exits before
starting PocketBase.

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

PocketBase tracks applied migration filenames in its internal `_migrations` table.
If an older backup already contains the collections but not that migration history,
the included migrations are restore-safe and will mark themselves as applied
without recreating existing collections or indexes.

Current migrations create the app collections used by Paynest:

- `subscriptions`
- `settings`
- `encrypted_subscriptions`
- `encrypted_settings`

When cloud encryption is enabled in the app, `encrypted_subscriptions` stores
one encrypted payload per subscription and `encrypted_settings` stores one
encrypted payload per user. API rules restrict each user to their own records
with `user = @request.auth.id`.
