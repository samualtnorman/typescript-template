#!/usr/bin/env node
import { expect } from "@sn/assert"
import { readdirSync as readFolderSync } from "fs"
import { mkdir as makeFolder, readFile, writeFile } from "fs/promises"
import { isolatedDeclaration } from "oxc-transform"
import Path from "path"
/** @import { Dirent } from "fs" */

const IN_PATH = "src"
const OUT_PATH = "dist"

const BinPath = Path.join(IN_PATH, "bin") + Path.sep

const getDirentParentPath = (/** @type {Dirent} */ dirent) => expect(dirent.parentPath ?? dirent.path)

const entries = readFolderSync(IN_PATH, { withFileTypes: true, recursive: true })
	.filter(file => file.isFile())
	.map(file => Path.join(getDirentParentPath(file), file.name))
	.filter(file => !file.startsWith(BinPath) && file.endsWith(".ts") && !file.endsWith(".d.ts"))

await Promise.all(entries.map(async entry => {
	const { code, errors } = await isolatedDeclaration(entry, await readFile(entry, { encoding: "utf8" }))

	if (errors.length) {
		for (const error of errors)
			console.error(error)

		process.exit(1)
	}

	const outPath = `${Path.join(OUT_PATH, Path.relative(IN_PATH, entry)).slice(0, -2)}d.ts`

	await makeFolder(Path.join(outPath, ".."), { recursive: true })
	await writeFile(outPath, code)
}))

process.exit()
