#!/bin/sh
set -xeu
export TARGET=git
scripts/eta.js < src/README.md > README.md
