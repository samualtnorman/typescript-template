#!/bin/sh
set -xeu
export TARGET=npm
rm -rf dist
./rolldown.config.js
scripts/emit-dts.js
scripts/emit-package-json.js
cp LICENSE dist
scripts/eta.js < src/README.md > dist/README.md
