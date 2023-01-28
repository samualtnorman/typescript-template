#!/usr/bin/env node
import { spawnSync } from "child_process"
import * as semver from "semver"
// eslint-disable-next-line @typescript-eslint/quotes
import packageConfig from "../package.json" assert { type: "json" }

const hash = spawnSync(`git`, [ `rev-parse`, `--short`, `HEAD` ], { encoding: `utf8` }).stdout.trim()

spawnSync(`npm`, [ `version`, `${semver.inc(packageConfig.version, `minor`)}-${hash}` ], { stdio: `inherit` })
process.exit()
