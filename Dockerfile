FROM alpine:latest

ARG PB_VERSION=0.39.4
ARG TARGETARCH
ARG TARGETVARIANT

RUN apk add --no-cache \
    wget \
    unzip \
    ca-certificates

RUN set -eux; \
    build_arch="${TARGETARCH}${TARGETVARIANT}"; \
    if [ -z "$build_arch" ]; then build_arch="$(uname -m)"; fi; \
    case "$build_arch" in \
      amd64) pb_arch="amd64" ;; \
      x86_64) pb_arch="amd64" ;; \
      arm64*) pb_arch="arm64" ;; \
      aarch64) pb_arch="arm64" ;; \
      armv7) pb_arch="armv7" ;; \
      armv7l) pb_arch="armv7" ;; \
      *) echo "Unsupported architecture: $build_arch" >&2; exit 1 ;; \
    esac; \
    wget -O /tmp/pb.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${pb_arch}.zip"; \
    unzip /tmp/pb.zip -d /pb/; \
    rm /tmp/pb.zip

COPY pb_migrations /pb/pb_migrations

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations"]
