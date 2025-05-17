#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

dockerd &
sleep 5
docker info

export area=canada

# Big image, pull now to show progress.
docker pull openmaptiles/postgis-preloaded:7.1

make refresh-docker-images
MBTILES_FILE=${MBTILES_FILE:-$(source .env ; echo "$MBTILES_FILE")}

make destroy-db
make init-dirs
rm -f "./data/$MBTILES_FILE"

make all

make start-db-preloaded
make import-osm
make import-wikidata
make import-sql

make analyze-db
make test-perf-null

if [[ "$(source .env ; echo "$BBOX")" = "-180.0,-85.0511,180.0,85.0511" && "$area" != "planet" ]]; then
    make generate-bbox-file ${MIN_ZOOM:+MIN_ZOOM="${MIN_ZOOM}"} ${MAX_ZOOM:+MAX_ZOOM="${MAX_ZOOM}"}
fi

make generate-tiles-pg

make stop-db
ls -la ./data
