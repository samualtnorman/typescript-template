#!/usr/bin/env node
import { Eta } from "eta"
import { readFileSync, writeFileSync } from "fs"
import * as Common from "./common.js"

writeFileSync(1, await new Eta().renderStringAsync(readFileSync(0, { encoding: `utf8` }), { Common }))
process.exit()
