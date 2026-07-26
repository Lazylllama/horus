#!/usr/bin/env bash
# Migrate ALL data (schema + data) from OLDPROD_DATABASE_URL to NEWPROD_DATABASE_URL.
# Uses Postgres-native pg_dump | psql. Requires pg_dump/psql (PostgreSQL client) >= source version.
set -euo pipefail

# Read a var from .env, tolerating CRLF line endings and surrounding quotes.
from_env() { grep -m1 "^$1=" .env | cut -d= -f2- | tr -d '\r' | sed -E 's/^"(.*)"$/\1/; s/^'\''(.*)'\''$/\1/'; }

OLDPROD_DATABASE_URL="${OLDPROD_DATABASE_URL:-$(from_env OLDPROD_DATABASE_URL)}"
NEWPROD_DATABASE_URL="${NEWPROD_DATABASE_URL:-$(from_env NEWPROD_DATABASE_URL)}"
: "${OLDPROD_DATABASE_URL:?set OLDPROD_DATABASE_URL}"
: "${NEWPROD_DATABASE_URL:?set NEWPROD_DATABASE_URL}"

# Neon's -pooler (PgBouncer) endpoint doesn't support dump/restore; use the direct endpoint.
OLD="${OLDPROD_DATABASE_URL/-pooler/}"
NEW="${NEWPROD_DATABASE_URL/-pooler/}"

echo "Source: ${OLD%%\?*}"
echo "Target: ${NEW%%\?*}"
read -rp "This OVERWRITES the target schema. Continue? [y/N] " ok
[ "$ok" = y ] || { echo "aborted"; exit 1; }

# --clean --if-exists: drop+recreate objects so it works whether target is empty or not.
# --no-owner/--no-privileges: source roles don't exist on target (different Neon project).
pg_dump "$OLD" \
  --no-owner --no-privileges --clean --if-exists \
  | psql "$NEW" -v ON_ERROR_STOP=1

echo "Done."
