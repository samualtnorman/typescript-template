import { expectTruthy } from "@samual/assert"
import { readdir as readFolder } from "fs/promises"
import Path from "path"
import * as v from "valibot"
import packageJson_ from "../package.json" with { type: "json" }

if (!process.env.FULL_ERROR) {
	process.on("uncaughtException", error => {
		console.error(error.message)
		process.exit(1)
	})
}

export const getExports = async (
	/** @type {string} */ queryFileExtension,
	/** @type {string | undefined} */ outputFileExtension = queryFileExtension
) => /** @type {Record<string, string>} */ ({
	".": `./default${outputFileExtension}`,
	...Object.fromEntries(
		(await readFolder(`dist`, { withFileTypes: true, recursive: true }))
			.filter(dirent => dirent.isFile())
			.map(dirent => Path.join(dirent.parentPath, dirent.name))
			.filter(path => path != `dist/default${queryFileExtension}` && path != `dist/internal${queryFileExtension}` && path.endsWith(queryFileExtension))
			.sort()
			.map(path => {
				const sliced = `.${path.slice(4, -queryFileExtension.length)}`

				return [ sliced, sliced + outputFileExtension ]
			})
	)
})

export const getPackageJson = () => v.parse(v.looseObject({
	private: v.optional(v.boolean()),
	name: v.string(),
	version: v.string(),
	license: v.string(),
	engines: v.record(v.string(), v.string()),
	dependencies: v.optional(v.record(v.string(), v.string())),
	devDependencies: v.optional(v.record(v.string(), v.string())),
}), packageJson_)

export const env = (/** @type {string} */ name) => expectTruthy(process.env[name], `Missing environment variable: ${name}`)
