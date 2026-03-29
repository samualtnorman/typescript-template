#!/usr/bin/env node
import { expectTruthy } from "@samual/assert"
import { readFileSync, writeFileSync } from "fs"
import "./common.js"

const targetPath = expectTruthy(process.argv[2])
const readme = readFileSync(0, { encoding: `utf8` }).trim().replaceAll(`*/`, `*\u200D/`).replaceAll(`\n`, `\n * `)
const targetContent = readFileSync(targetPath, { encoding: `utf8` })

writeFileSync(targetPath, `/**\n * ${readme}\n * @module\n */\n${targetContent}`,)
process.exit()
