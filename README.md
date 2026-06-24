# Paynest-DB

PocketBase database setup for Paynest.

The Docker image builds from `ghcr.io/muchobien/pocketbase:latest`, copies in `pb_migrations/`,
and runs migrations automatically before starting PocketBase.

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

Migrations run automatically from the image entrypoint before PocketBase starts on every container restart.

For Coolify, deploy this repository using the `Dockerfile` build pack and persist `/pb_data` as a volume.

PocketBase will be available at:

```text
http://localhost:8090
```

The admin UI is available at:

```text
http://localhost:8090/_/
```

## Data

DB data is stored in `pb_data/`.
