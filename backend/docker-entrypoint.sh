#!/bin/sh
set -e

PGHOST="${PGHOST:-db}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-postgres}"

echo "Waiting for PostgreSQL at ${PGHOST}:${PGPORT}..."
until pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" >/dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL is ready."

echo "Running prisma migrate deploy..."
node ./node_modules/prisma/build/index.js migrate deploy

exec "$@"
