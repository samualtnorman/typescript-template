#!/bin/sh
set -ex
node_modules/.bin/knip --no-config-hints
node_modules/.bin/tsc
node_modules/.bin/tsc --project src
node_modules/.bin/vitest run
