# `npm:` 规范符

自 1.28 版本以来，Deno 原生支持导入 npm 包。这是通过使用 `npm:`
规范符导入完成的。例如，以下代码：

```ts
import { emojify } from "npm:node-emoji@2";

console.log(emojify(":t-rex: :heart: NPM"));
```

可以运行：

```sh
$ deno run main.js
🦖 ❤️ NPM
```

这样做时，无需进行 `npm install`，也不会创建 `node_modules`
文件夹。这些包也受到与 Deno 中其他代码相同的 [权限](../basics/permissions.md)
的限制。

npm 规范具有以下格式：

```
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

有关流行库的示例，请参考我们的 [tutorial section](/runtime/tutorials)。

## TypeScript 类型

许多包已经默认包含类型，您可以轻松导入并使用这些类型：

```ts
import chalk from "npm:chalk@5";
```

尽管某些包没有默认类型，但您可以使用
[`@deno-types`](../advanced/typescript/types.md) 指令指定它们的类型。例如，使用
[`@types`](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#definitelytyped--types)
包：

```ts
// @deno-types = "npm:@types/express@^4.17"
import express from "npm:express@^4.17";
```

### 模块解析

官方的 TypeScript 编译器 `tsc` 支持不同的
[moduleResolution](https://www.typescriptlang.org/tsconfig#moduleResolution)
设置。Deno 只支持现代的 `node16` 解析。不幸的是，许多 NPM 包未能正确提供 node16
模块解析下的类型，这可能导致 `deno check` 报告类型错误，而 `tsc` 则不会报告。

如果从 `npm:` 导入的默认导出似乎具有错误的类型（正确的类型似乎可用于 `.default`
属性下），那么很可能是该包在 ESM 导入的情况下为 node16
模块解析提供了错误的类型。您可以通过检查是否使用 `tsc --module node16` 和
`package.json` 中的 `"type": "module"` 也会发生错误，或者请咨询
[类型是否错误？](https://arethetypeswrong.github.io/) 网站（特别是 "node16 from
ESM" 行）来验证这一点。

如果您想使用不支持 TypeScript 的 node16 模块解析的包，您可以：

1. 在包的问题跟踪器中报告问题。 （也许贡献一个修复 :)
   （尽管不幸的是，目前缺少支持包同时支持 ESM 和 CJS
   的工具，因为默认导出需要不同的语法，参见
   [microsoft/TypeScript#54593](https://github.com/microsoft/TypeScript/issues/54593)）
2. 使用 [CDN](./cdns.md)，为 Deno 支持重建包，而不是使用 `npm:` 标识符。
3. 在代码库中忽略您收到的类型错误，使用 `// @ts-expect-error` 或
   `// @ts-ignore`。

### 包括 Node 类型

Node 包含许多内置类型，如 `Buffer`，可能会在 npm
包的类型中引用。要加载这些类型，您必须向 `@types/node` 包添加一个类型引用指令：

```ts
/// <reference types="npm:@types/node" />
```

请注意，在大多数情况下，不指定版本是可以的，因为 Deno 将尝试与其内部 Node
代码保持同步，但如果有必要，您始终可以覆盖使用的版本。

## npm 可执行脚本

带有 `bin` 条目的 npm 包可以在命令行中执行，无需使用
`npm install`，使用以下格式的规范：

```
npm:<package-name>[@<version-requirement>][/<binary-name>]
```

例如：

```sh
$ deno run --allow-read npm:cowsay@1.5.0 Hello there!
 ______________
< Hello there! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

$ deno run --allow-read npm:cowsay@1.5.0/cowthink What to eat?
 ______________
( What to eat? )
 --------------
        o   ^__^
         o  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## `--node-modules-dir` 标志

npm 规范将 npm 包解析为一个中央全局 npm
缓存。在大多数情况下，这很有效，并且理想情况下，因为它使用的空间较少，不需要
`node_modules` 目录。不过，您可能会发现某些 npm 包希望自己从 `node_modules`
目录执行。为了提高兼容性并支持这些包，您可以使用 `--node-modules-dir` 标志。

例如，给定 `main.ts`：

```ts
import chalk from "npm:chalk@5";

console.log(chalk.green("Hello"));
```

使用 `--node-modules-dir` 运行此脚本，如下所示...

```sh
deno run --node-modules-dir main.ts
```

...会在当前目录中创建一个 `node_modules` 文件夹，其文件夹结构与 npm 类似。

![](../images/node_modules_dir.png)

请注意，当调用 `deno run` 时，所有这些都会自动完成，不需要单独的安装命令。

或者，如果您希望完全禁用 `node_modules` 目录的创建，您可以将此标志设置为
false（例如，`--node-modules-dir=false`），或在您的 `deno.json`
配置文件中添加一个 `"nodeModulesDir": false` 条目，以使该设置适用于整

个目录树。

在您希望在执行之前修改 `node_modules` 目录的内容的情况下，您可以使用
`--node-modules-dir` 运行 `deno cache`，修改内容，然后运行脚本。

例如：

```sh
deno cache --node-modules-dir main.ts
deno run --allow-read=. --allow-write=. scripts/your_script_to_modify_node_modules_dir.ts
deno run --node-modules-dir main.ts
```
