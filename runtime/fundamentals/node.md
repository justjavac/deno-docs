---
title: "Node 和 npm 支持"
oldUrl:
- /runtime/reference/node/
- /runtime/manual/npm_nodejs/std_node/
- /runtime/manual/node/
- /runtime/manual/npm_nodejs/cdns/
- /runtime/manual/using_deno_with_other_technologies/node/cdns/
- /runtime/manual/node/node_specifiers
- /runtime/manual/node/package_json
- /runtime/manual/node/migrate/
- /runtime/manual/references/cheatsheet/
- /runtime/manual/node/cheatsheet/
- /runtime/manual/node/faqs
- /runtime/manual/node/npm_specifiers
- /runtime/manual/node/private_registries
---

- **Deno 兼容 Node**。大多数 Node 项目在 Deno 中只需很少或无需修改即可运行！
- **Deno 支持 npm 包**。只需在导入中使用 `npm:` 说明符，Deno 会处理其余的事情。

例如，以下是如何在 Deno 项目中从 npm 导入 Hono：

```ts
import { Hono } from "npm:hono";
```

这就是你开始所需了解的全部内容！然而，两个运行时之间存在一些关键差异，你可以在将
Node.js 项目迁移到 Deno 时利用这些差异，使代码更简单、更小。

## 使用 Node 的内置模块

Deno 提供了一个兼容层，允许在 Deno 程序中使用 Node.js 内置
API。但是，为了使用它们，你需要在任何使用它们的导入语句中添加 `node:` 说明符：

```js title=main.mjs
import * as os from "node:os";
console.log(os.cpus());
```

并使用 `deno run main.mjs` 运行它——你会注意到输出与在 Node.js 中运行程序时相同。

将应用程序中的任何导入更新为使用 `node:` 说明符，应该可以使任何使用 Node
内置功能的代码像在 Node.js 中一样运行。

为了使更新现有代码更容易，Deno 会为未使用 `node:` 前缀的导入提供有用的提示：

```js title="main.mjs"
import * as os from "os";
console.log(os.cpus());
```

```sh
$ deno run main.mjs
error: Relative import path "os" not prefixed with / or ./ or ../
  hint: If you want to use a built-in Node module, add a "node:" prefix (ex. "node:os").
    at file:///main.mjs:1:21
```

Deno LSP 在你的编辑器中也会提供相同的提示和额外的快速修复。

<a href="/api/node/" class="docs-cta runtime-cta">探索内置 Node API</a>

## 使用 npm 包

Deno 原生支持通过使用 `npm:` 说明符导入 npm 包。例如：

```ts title="main.js"
import * as emoji from "npm:node-emoji";

console.log(emoji.emojify(`:sauropod: :heart:  npm`));
```

可以使用以下命令运行：

```sh
$ deno run main.js
🦕 ❤️ npm
```

在 `deno run` 命令之前不需要 `npm install`，也不会创建 `node_modules`
文件夹。这些包也受到与 Deno
中其他代码相同的[权限](/runtime/fundamentals/security/)限制。

npm 说明符的格式如下：

```console
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

有关流行库的示例，请参考[教程部分](/runtime/tutorials)。

## CommonJS 支持

CommonJS 是早于
[ES 模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)
的模块系统。虽然我们坚信 ES 模块是 JavaScript 的未来，但仍有数百万个 npm 库是用
CommonJS 编写的，Deno 提供了对它们的全面支持。Deno 会自动确定一个包是否使用
CommonJS，并在导入时使其无缝工作：

```js title="main.js"
import react from "npm:react";
console.log(react);
```

```shell
$ deno run -E main.js
18.3.1
```

_`npm:react` 是一个 CommonJS 包。Deno 允许你像导入 ES 模块一样导入它。_

Deno 强烈建议在你的代码中使用 ES 模块，但提供 CommonJS 支持时有以下限制：

**Deno 的权限系统在使用 CommonJS 模块时仍然有效。** 可能需要至少提供
`--allow-read` 权限，因为 Deno 会探测文件系统中的 `package.json` 文件和
`node_modules` 目录以正确解析 CommonJS 模块。

### 使用 .cjs 扩展名

如果文件扩展名是 `.cjs`，Deno 会将该模块视为 CommonJS。

```js title="main.cjs"
const express = require("express");
```

Deno 不会查找 `package.json` 文件和 `type` 选项来确定文件是 CommonJS 还是 ESM。

使用 CommonJS 时，Deno 期望依赖项会手动安装，并且会存在 `node_modules`
目录。最好在你的 `deno.json` 中设置 `"nodeModulesDir": "auto"` 以确保这一点。

```shell
$ cat deno.json
{
  "nodeModulesDir": "auto"
}

$ deno install npm:express
Add npm:express@5.0.0

$ deno run -R -E main.cjs
[Function: createApplication] {
  application: {
    init: [Function: init],
    defaultConfiguration: [Function: defaultConfiguration],
    ...
  }
}
```

`-R` 和 `-E` 标志用于允许读取文件和环境变量的权限。

### package.json type 选项

如果文件旁边或目录树中有 `package.json` 文件且带有 `"type": "commonjs"`
选项，Deno 会尝试将 `.js`、`.jsx`、`.ts` 和 `.tsx` 文件加载为 CommonJS。

```json title="package.json"
{
  "type": "commonjs"
}
```

```js title="main.js"
const express = require("express");
```

像 Next.js 的打包器和其他工具会自动生成这样的 `package.json` 文件。

如果你有一个使用 CommonJS 模块的现有项目，你可以通过向 `package.json` 文件添加
`"type": "commonjs"` 选项使其在 Node.js 和 Deno 中都能工作。

### 始终检测文件是否为 CommonJS

在 Deno >= 2.1.2 中，可以通过运行 `--unstable-detect-cjs` 告诉 Deno
分析模块是否为 CommonJS。这将生效，除非存在带有 `{ "type": "module" }` 的
_package.json_ 文件。

在文件系统中查找 package.json 文件并分析模块以检测其是否为 CommonJS
比不这样做需要更长的时间。因此，为了不鼓励使用 CommonJS，Deno 默认不执行此行为。

### 手动创建 require()

另一种选择是手动创建 `require()` 函数的实例：

```js title="main.js"
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const express = require("express");
```

在这种情况下，与运行 `.cjs`
文件时相同的要求适用——需要手动安装依赖项并给出适当的权限标志。

### require(ESM)

Deno 的 `require()` 实现支持 require ES 模块。

这与 Node.js 中的工作方式相同，你只能 `require()` 没有顶层 await 的 ES
模块——换句话说，你只能 `require()` “同步”的 ES 模块。

```js title="greet.js"
export function greet(name) {
  return `Hello ${name}`;
}
```

```js title="esm.js"
import { greet } from "./greet.js";

export { greet };
```

```js title="main.cjs"
const esm = require("./esm");
console.log(esm);
console.log(esm.greet("Deno"));
```

```shell
$ deno run -R main.cjs
[Module: null prototype] { greet: [Function: greet] }
Hello Deno
```

### 导入 CommonJS 模块

你也可以在 ES 模块中导入 CommonJS 文件。

```js title="greet.cjs"
module.exports = {
  hello: "world",
};
```

```js title="main.js"
import greet from "./greet.js";
console.log(greet);
```

```shell
$ deno run main.js
{
  "hello": "world"
}
```

**提示和建议**

Deno 在处理 CommonJS 模块时会提供有用的提示和建议，以引导你编写可运行的代码。

例如，如果你尝试运行一个没有 `.cjs` 扩展名或没有带有 `{ "type": "commonjs" }` 的
`package.json` 的 CommonJS 模块，你可能会看到以下内容：

```js title="main.js"
module.exports = {
  hello: "world",
};
```

```shell
$ deno run main.js
error: Uncaught (in promise) ReferenceError: module is not defined
module.exports = {
^
    at file:///main.js:1:1

    info: Deno supports CommonJS modules in .cjs files, or when the closest
          package.json has a "type": "commonjs" option.
    hint: Rewrite this module to ESM,
          or change the file extension to .cjs,
          or add package.json next to the file with "type": "commonjs" option,
          or pass --unstable-detect-cjs flag to detect CommonJS when loading.
    docs: https://docs.denohub.com/go/commonjs
```

## 导入类型

许多 npm 包附带类型，你可以直接导入并使用这些类型：

```ts
import chalk from "npm:chalk@5";
```

有些包不附带类型，但你可以使用 [`@ts-types`](/runtime/fundamentals/typescript)
指令指定它们的类型。例如，使用
[`@types`](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#definitelytyped--types)
包：

```ts
// @ts-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
```

**模块解析**

官方的 TypeScript 编译器 `tsc` 支持不同的
[moduleResolution](https://www.typescriptlang.org/tsconfig#moduleResolution)
设置。Deno 仅支持现代的 `node16` 解析。不幸的是，许多 npm 包未能正确提供 node16
模块解析下的类型，这可能导致 `deno check` 报告类型错误，而 `tsc` 不会报告。

如果从 `npm:` 导入的默认导出似乎具有错误的类型（正确的类型似乎位于 `.default`
属性下），很可能是该包在 node16 模块解析下为 ESM
导入提供了错误的类型。你可以通过检查 `tsc --module node16` 和 `package.json`
中的 `"type": "module"` 是否也会出现错误，或参考
[Are the types wrong?](https://arethetypeswrong.github.io/) 网站（特别是 "node16
from ESM" 行）来验证这一点。

如果你想使用不支持 TypeScript 的 node16 模块解析的包，你可以：

1. 在包的 issue 跟踪器中打开一个问题。（也许贡献一个修复 :)
   （尽管不幸的是，由于默认导出需要不同的语法，包支持 ESM 和 CJS
   的工具缺乏。另见
   [microsoft/TypeScript#54593](https://github.com/microsoft/TypeScript/issues/54593))
2. 使用 [CDN](/runtime/fundamentals/modules/#url_imports)，它重建包以支持
   Deno，而不是使用 `npm:` 标识符。
3. 使用 `// @ts-expect-error` 或 `// @ts-ignore` 忽略代码库中的类型错误。

## 包含 Node 类型

Node 附带了许多内置类型，如 `Buffer`，这些类型可能在 npm
包的类型中被引用。要加载这些类型，你必须向 `@types/node` 包添加类型引用指令：

```ts
/// <reference types="npm:@types/node" />
```

请注意，在大多数情况下，不指定版本是可以的，因为 Deno 会尝试使其与其内部的 Node
代码保持同步，但你始终可以覆盖使用的版本。

## 可执行的 npm 脚本

带有 `bin` 条目的 npm 包可以从命令行执行，而无需使用
`npm install`，使用以下格式的说明符：

```console
npm:<package-name>[@<version-requirement>][/<binary-name>]
```

例如：

```sh
$ deno run --allow-read npm:cowsay@1.5.0 "Hello there!"
 ______________
< Hello there! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

$ deno run --allow-read npm:cowsay@1.5.0/cowthink "What to eat?"
 ______________
( What to eat? )
 --------------
        o   ^__^
         o  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## node_modules

当你运行 `npm install` 时，npm 会在你的项目中创建一个 `node_modules`
目录，其中包含 `package.json` 文件中指定的依赖项。

Deno 使用 [npm 说明符](/runtime/fundamentals/node/#using-npm-packages) 将 npm
包解析到中央全局 npm 缓存，而不是在项目中使用 `node_modules`
文件夹。这是理想的，因为它使用更少的空间并保持项目目录的整洁。

然而，在某些情况下，你可能需要在 Deno 项目中使用本地的 `node_modules`
目录，即使你没有 `package.json`（例如，在使用 Next.js 或 Svelte
等框架时，或依赖使用 Node-API 的 npm 包时）。

#### 默认的 Deno 依赖项行为

默认情况下，当你使用 `deno run` 命令时，Deno 不会创建 `node_modules`
目录，依赖项将安装到全局缓存中。这是新 Deno 项目的推荐设置。

#### 自动创建 node_modules

如果你需要在项目中使用 `node_modules` 目录，你可以使用 `--node-modules-dir`
标志或配置文件中的 `nodeModulesDir: auto` 选项告诉 Deno 在当前工作目录中创建
`node_modules` 目录：

```sh
deno run --node-modules-dir=auto main.ts
```

或使用配置文件：

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

自动模式会自动将依赖项安装到全局缓存中，并在项目根目录中创建一个本地的
node_modules 目录。这推荐用于依赖 node_modules 目录的 npm
依赖项的项目——主要是使用打包器或具有 postinstall 脚本的 npm 依赖项的项目。

#### 手动创建 node_modules

如果你的项目有 `package.json`
文件，你可以使用手动模式，这需要一个安装步骤来创建你的 `node_modules` 目录：

```sh
deno install
deno run --node-modules-dir=manual main.ts
```

或使用配置文件：

```json title="deno.json"
{ "nodeModulesDir": "manual" }
```

然后你可以运行 `deno install/npm install/pnpm install` 或任何其他包管理器来创建
`node_modules` 目录。

手动模式是使用 `package.json` 的项目的默认模式。你可能会从 Node.js
项目中认出这个工作流程。它推荐用于使用 Next.js、Remix、Svelte、Qwik 等框架或
Vite、Parcel 或 Rollup 等工具的项目。

:::note

我们建议你使用默认的 `none` 模式，如果遇到关于 `node_modules`
目录中缺少包的错误，再回退到 `auto` 或 `manual` 模式。

:::

#### Deno 1.X 中的 node_modules

使用 `--node-modules-dir` 标志。

例如，给定 `main.ts`：

```ts
import chalk from "npm:chalk@5";

console.log(chalk.green("Hello"));
```

```sh
deno run --node-modules-dir main.ts
```

运行上述命令，带有 `--node-modules-dir` 标志，将在当前目录中创建一个
`node_modules` 文件夹，其文件夹结构与 npm 类似。

## Node.js 全局对象

在 Node.js 中，有许多 [全局对象](https://nodejs.org/api/globals.html)
在所有程序的范围内可用，这些对象是 Node.js 特有的，例如 `process` 对象。

以下是你可能会遇到的一些全局对象以及如何在 Deno 中使用它们：

- `process` - Deno 提供了 `process` 全局对象，这是最受欢迎的全局对象，用于流行的
  npm 包中。它对所有代码都可用。然而，Deno 会通过提供 lint
  警告和快速修复来引导你从 `node:process` 模块显式导入它：

```js title="process.js"
console.log(process.versions.deno);
```

```shell
$ deno run process.js
2.0.0
$ deno lint process.js
error[no-process-global]: NodeJS process global is discouraged in Deno
 --> /process.js:1:13
  |
1 | console.log(process.versions.deno);
  |             ^^^^^^^
  = hint: Add `import process from "node:process";`

  docs: https://docs.denohub.com/lint/rules/no-process-global


Found 1 problem (1 fixable via --fix)
Checked 1 file
```

- `require()` - 参见 [CommonJS 支持](#commonjs-support)

- `Buffer` - 要使用 `Buffer` API，需要从 `node:buffer` 模块显式导入：

```js title="buffer.js"
import { Buffer } from "node:buffer";

const buf = new Buffer(5, "0");
```

建议使用
[`Uint8Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
或其他
[`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
子类。

- `__filename` - 使用 `import.meta.filename` 代替。

- `__dirname` - 使用 `import.meta.dirname` 代替。

## Node-API 插件

Deno 支持 [Node-API 插件](https://nodejs.org/api/n-api.html)，这些插件被流行的
npm 包如
[`esbuild`](https://www.npmjs.com/package/esbuild)、[`npm:sqlite3`](https://www.npmjs.com/
