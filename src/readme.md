<%
const { readFileSync } = await import("fs")
const packageJson = JSON.parse(readFileSync("./package.json", { encoding: "utf8" }))
const JsrPackageName = `@sn/${packageJson.name}`
const PackageName = process.env.JSR ? JsrPackageName : packageJson.name
%>
# Typescript Template
Requires Node.js 20.10+, 22.0+, 24.0+, or above.

## Example
```js
import { foo } from "<%= PackageName %>"

console.log(foo) // "bar"
```
