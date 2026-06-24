# Paynest-DB

PocketBase database setup for Paynest.

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

Migrations run automatically from `docker-entrypoint.sh` before PocketBase starts on every container restart.

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
