#!/bin/sh
set -ex
rm -rf dist
./rolldown.config.js
scripts/emit-dts.js
scripts/emit-package-json.js
cp LICENSE readme.md dist
