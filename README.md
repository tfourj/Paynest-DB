# Paynest-DB

PocketBase database setup for Paynest.

Docker Compose uses the project name `paynest-db` and runs two services:

- `pocketbase`: the normal `ghcr.io/coollabsio/pocketbase:latest` image.
- `paynest-migrations`: a one-shot service that builds this repo, copies in `pb_migrations/`,
  runs migrations against the shared `pocketbase-data` volume, then exits.

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

DB data is stored in the `pocketbase-data` Docker volume.
