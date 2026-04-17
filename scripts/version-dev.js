#!/usr/bin/env node
import { expect } from "@samual/assert"
import { spawnSync } from "child_process"
import { readFileSync } from "fs"
import * as Semver from "semver"
import { styleText } from "util"
import packageJson from "../package.json" with { type: "json" }
/** @import { SpawnSyncReturns, SpawnSyncOptions, IOType } from "child_process" */
/** @import { Stream } from "stream" */
/** @import { Replace } from "@samual/types" */

const shellEscape = (/** @type {string} */ string) =>
	/["$&'()*;<>?[\\\]`{|}~ \t\r\n]/.test(string) ? `'${string.replaceAll(`'`, `\\'`)}'` : string

const highlightCommand = (/** @type {string} */ command, /** @type {string[]} */ args) =>
	 `${styleText(`blueBright`, shellEscape(command))} ${args.map(arg => (arg = shellEscape(arg), styleText(arg[0] == `'` ? `green` : `cyanBright`, arg))).join(` `)}`

/** @typedef {IOType | "ipc" | Stream | number | undefined} StdIoOption */

/** @type {{
	(command: string, ...args: string[]): SpawnSyncReturns<null>
	(
		options: SpawnSyncOptions & { stdio: "pipe" | [ StdIoOption, "pipe", "pipe" ], encoding?: BufferEncoding | undefined },
		command: string,
		...args: string[]
	): SpawnSyncReturns<string>
	(
		options: SpawnSyncOptions & { stdio: "pipe" | [ StdIoOption, "pipe", "pipe" ], encoding: "buffer" },
		command: string,
		...args: string[]
	): SpawnSyncReturns<Buffer>
	(
		options: SpawnSyncOptions & { stdio: "pipe" | [ StdIoOption, "pipe", Omit<StdIoOption, "pipe"> ], encoding?: BufferEncoding | undefined },
		command: string,
		...args: string[]
	): Replace<SpawnSyncReturns<string>, { stderr: null }>
	(
		options: SpawnSyncOptions & { stdio: "pipe" | [ StdIoOption, "pipe", Omit<StdIoOption, "pipe"> ], encoding: "buffer" },
		command: string,
		...args: string[]
	): Replace<SpawnSyncReturns<Buffer>, { stderr: null }>
	(
		options: SpawnSyncOptions & { stdio: "pipe" | [ StdIoOption, Omit<StdIoOption, "pipe">, "pipe" ], encoding?: BufferEncoding | undefined },
		command: string,
		...args: string[]
	): Replace<SpawnSyncReturns<string>, { stdout: null }>
	(
		options: SpawnSyncOptions & { stdio: "pipe" | [ StdIoOption, Omit<StdIoOption, "pipe">, "pipe" ], encoding: "buffer" },
		command: string,
		...args: string[]
	): Replace<SpawnSyncReturns<Buffer>, { stdout: null }>
	(options: SpawnSyncOptions, command: string, ...args: string[]): SpawnSyncReturns<string | Buffer | null>
}} */
const cmdSync = /** @type {any} */ ((/** @type {SpawnSyncOptions} */ commandOrOptions, /** @type {string[]} */ ...args) => {
	/** @type {SpawnSyncOptions} */ let options
	let command

	if (typeof commandOrOptions == `string`) {
		command = commandOrOptions
		options = { stdio: [ `ignore`, `inherit`, `inherit` ] }
	} else {
		command = expect(args.shift())
		options = commandOrOptions
		options.encoding ??= `utf8`
		options.stdio ??= [ `ignore`, `inherit`, `inherit` ]
	}

	console.log(styleText(`gray`, `Running command:`), highlightCommand(command, args))

	const returns = spawnSync(command, args, options)

	if (returns.stdout)
		process.stdout.write(returns.stdout)

	if (returns.stderr)
		process.stderr.write(returns.stderr)

	if (returns.signal)
		console.error(styleText(`red`, `Child process got signal:`), styleText(`green`, returns.signal))

	if (returns.error)
		console.error(styleText(`red`, `Got error:`), returns.error)

	if (returns.status)
		process.exit(returns.status)

	return returns
})

const hash = cmdSync({ stdio: [ `ignore`, `pipe`, `ignore` ] }, "git", "rev-parse", "--short", "HEAD").stdout.trim()

cmdSync("npm", "version", `${expect(Semver.inc(packageJson.version, "patch"))}-${hash}`)

const newVersion = /** @type {Record<string, unknown> | null} */
	(JSON.parse(readFileSync(`package.json`, { encoding: `utf8` })))?.version

if (packageJson.version == newVersion) {
	console.error(`Version didn't change`)
	process.exit(1)
}

process.exit()
