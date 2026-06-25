FROM ghcr.io/coollabsio/pocketbase:latest

COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY pb_migrations /pb_migrations

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
