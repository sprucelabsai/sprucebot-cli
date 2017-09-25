#!/bin/bash
# wait-for-postrges.sh

set -e
export PGPASSWORD='barbershop123';

until psql -h 10.200.10.1 -U barbershopio -d docker_db -c '\l'; do
    >&2 echo "Postgres is unavailable - sleeping"
    sleep 1
done

>&2 echo "Postgres is up - executing command"
