# `node:` 规范符

Deno 支持使用 Node.js 内置模块，例如
[fs](https://nodejs.org/api/fs.html#file-system),
[path](https://nodejs.org/api/path.html#path),
[process](https://nodejs.org/api/process.html#process) 等等，通过 `node:`
规范符。

```ts
import { readFileSync } from "node:fs";

console.log(readFileSync("deno.json", { encoding: "utf8" }));
```

请注意，通过裸规范符导入（例如 `import { readFileSync } from "fs";`)
不受支持。如果您尝试这样做， 并且裸规范符与在导入映射中找不到的 Node.js
内置模块匹配， Deno 将提供一个有用的错误消息，询问您是否想要使用 `node:`
前缀进行导入。此外，LSP 提供了一个快速修复来更新到 `node:` 规范符。

如果您同时在 Deno 和 Node.js 中使用代码，`node:` 方案将在两个运行时中都起作用，
建议您为您的 Node.js 代码进行更新。
