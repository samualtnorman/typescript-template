#!/bin/sh
set -xeu
export TARGET=jsr
export JSR_NAME=@sn/typescript-template
rm dist --recursive --force
./rolldown.config.js
scripts/emit-dts.js
cp LICENSE dist
scripts/eta.js < src/readme.md | scripts/prepend-readme.js dist/default.d.ts
scripts/emit-jsr-json.js
