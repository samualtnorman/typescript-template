#!/bin/sh
node_modules/.bin/tsc --project src --declaration --emitDeclarationOnly --noEmit false --outDir dist
