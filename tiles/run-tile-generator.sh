#!/bin/bash
set -e

if [[ ! -d data/openmaptiles ]]; then
    git clone https://github.com/openmaptiles/openmaptiles.git data/openmaptiles
fi

if [[ ! -f data/openmaptiles/data/canada.osm.pbf ]]; then
    wget https://download.geofabrik.de/north-america/canada-latest.osm.pbf -O data/openmaptiles/data/canada.osm.pbf
fi

pushd tile-generator
docker build . -t tile-generator:local
popd

cp tile-generator/generate.sh data/openmaptiles/
# Remove win_fs check.
sed -i '\|@ ! ($(DOCKER_COMPOSE) 2>/dev/null run $(DC_OPTS) openmaptiles-tools df --output=fstype /tileset| grep -q 9p) < /dev/null || ($(win_fs_error))|d' data/openmaptiles/Makefile

# Volume to store pulled images because some are big.
docker volume create tile-generator-images

MSYS_NO_PATHCONV=1 docker run \
    --rm -it --privileged \
    --name tilegenerator \
    -v $(pwd)/data:/data \
    -v tile-generator-images:/var/lib/docker \
    tile-generator:local
