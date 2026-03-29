#!/usr/bin/env node
import { mkdirSync as makeDirectorySync, writeFileSync } from "fs"
import { env, getExports, getPackageJson } from "./common.js"

/** @type {Record<string, string>} */ const ConvertToJsr = {
	"@samual/types": "@samual/types"
}

makeDirectorySync("dist", { recursive: true })

const name = env("JSR_NAME")
const exports = await getExports(`.d.ts`, `.js`)
const { version, license, dependencies } = getPackageJson()

const imports = dependencies && Object.fromEntries(Object.entries(dependencies).map(
	([ name, version ],) => [ name, `${name in ConvertToJsr ? `jsr:${ConvertToJsr[name]}` : `npm:${name}`}@${version}` ]
))

writeFileSync("dist/jsr.json", JSON.stringify({ name, version, license, exports, imports }, undefined, "\t"))
process.exit()
