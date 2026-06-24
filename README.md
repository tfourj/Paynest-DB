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

Run migrations:

```sh
docker compose exec pocketbase ./pocketbase migrate up
```

If your container was created before this setup declared the migrations directory explicitly, run:

```sh
docker compose exec pocketbase ./pocketbase migrate up --migrationsDir=/pb_migrations
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

DB data is stored in `pb_data/`.
