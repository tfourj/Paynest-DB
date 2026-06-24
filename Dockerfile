FROM ghcr.io/muchobien/pocketbase:latest

COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY pb_migrations /pb_migrations

EXPOSE 8090

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
