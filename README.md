# Paynest-DB

PocketBase database setup for Paynest.

Docker Compose uses the project name `paynest-db` and runs two services:

- `pocketbase`: a local image built from the official PocketBase Dockerfile pattern.
- `paynest-migrations`: a one-shot service that uses the same local image and
  runs migrations against the shared `pocketbase-data` volume, then exits.

The image downloads PocketBase during build using the `PB_VERSION` Docker build argument
and selects the matching release binary for `amd64`, `arm64`, or `arm/v7`.

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

Migrations run automatically before PocketBase starts. To run migrations manually:

```sh
docker compose run --rm paynest-migrations
```

For Coolify, deploy this repository with Docker Compose and persist the `pocketbase-data` volume.

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
