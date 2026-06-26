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
