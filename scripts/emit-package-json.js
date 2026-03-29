#!/usr/bin/env node
import { mkdirSync as makeDirectorySync, writeFileSync } from "fs"
import { getExports, getPackageJson } from "./common.js"

const { dependencies, devDependencies, engines: { pnpm, ...engines }, ...packageJson } = getPackageJson()
delete packageJson.private

makeDirectorySync("dist", { recursive: true })

writeFileSync(
	"dist/package.json",
	JSON.stringify({ ...packageJson, engines, exports: await getExports(`.d.ts`, `.js`), dependencies }, undefined, "\t")
)

process.exit()
