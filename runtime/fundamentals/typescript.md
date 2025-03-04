---
title: "TypeScript 支持"
oldUrl:
  - /runtime/manual/advanced/typescript/
  - /runtime/manual/typescript/
  - /runtime/manual/typescript/overview/
  - /runtime/manual/getting_started/typescript/
  - /manual/advanced/typescript
  - /runtime/manual/advanced/typescript/overview/
---

TypeScript 是 Deno 中的一等语言，就像 JavaScript 或 WebAssembly
一样。你可以运行或导入 TypeScript，而无需安装除 Deno CLI
之外的任何东西。借助其内置的 TypeScript 编译器，Deno 会将你的 TypeScript
代码编译为 JavaScript，无需额外的配置。Deno 还可以对你的 TypeScript
代码进行类型检查，而无需像 `tsc` 这样的单独类型检查工具。

## 类型检查

TypeScript
的主要优势之一是它可以使你的代码类型安全，在开发期间而不是运行时捕获错误。TypeScript
是 JavaScript 的超集，这意味着语法上有效的 JavaScript 会成为
TypeScript，但会收到关于“不安全”的警告。

:::note

**Deno 默认在 `strict mode` 下进行 TypeScript 类型检查**，TypeScript
核心团队[推荐将严格模式作为合理的默认设置](https://www.typescriptlang.org/play/?#example/new-compiler-defaults)。

:::

Deno 允许你使用 [`deno check`](/runtime/reference/cli/check/)
子命令对代码进行类型检查（而不执行它）：

```shell
deno check module.ts
# 或者也可以对远程模块和 npm 包进行类型检查
deno check --all module.ts
# 也可以对用 JSDoc 编写的代码片段进行类型检查
deno check --doc module.ts
# 或者对 markdown 文件中的代码片段进行类型检查
deno check --doc-only markdown.md
```

:::note

类型检查可能会花费大量时间，尤其是在你正在处理一个代码库并且进行了大量更改时。Deno
优化了类型检查，但它仍然是有代价的。因此，**默认情况下，TypeScript
模块在执行前不会进行类型检查**。

:::

当使用 `deno run` 命令时，Deno
会跳过类型检查并直接运行代码。为了在执行前对模块进行类型检查，你可以使用
`--check` 标志与 `deno run`：

```shell
deno run --check module.ts
# 或者也可以对远程模块和 npm 包进行类型检查
deno run --check=all module.ts
```

当 Deno 在使用此标志时遇到类型错误时，进程将在执行代码之前退出。

为了避免这种情况，你需要：

- 解决问题
- 使用 `// @ts-ignore` 或 `// @ts-expect-error` 指令忽略错误
- 或者完全跳过类型检查。

在测试代码时，默认启用类型检查。如果你愿意，可以使用 `--no-check`
标志跳过类型检查：

```shell
deno test --no-check
```

## 与 JavaScript 一起使用

Deno 运行 JavaScript 和 TypeScript 代码。在类型检查期间，Deno 默认只会对
TypeScript 文件进行类型检查。如果你也想对 JavaScript
文件进行类型检查，你可以在文件顶部添加 `// @ts-check` 指令，或者在 `deno.json`
文件中添加 `compilerOptions.checkJs`。

```ts title="main.js"
// @ts-check

let x = "hello";
x = 42; // 类型 'number' 不能分配给类型 'string'。
```

```json title="deno.json"
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

在 JavaScript 文件中，你不能使用 TypeScript
语法，如类型注解或导入类型。不过，你可以使用 [TSDoc](https://tsdoc.org/) 注释向
TypeScript 编译器提供类型信息。

```ts title="main.js"
// @ts-check

/**
 * @param a {number}
 * @param b {number}
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}
```

## 提供声明文件

当从 TypeScript 代码中导入未类型化的 JavaScript 模块时，你可能需要为 JavaScript
模块提供类型信息。如果 JavaScript 使用 TSDoc
注释进行注解，则不需要这样做。如果没有这种额外的类型信息（以 `.d.ts`
声明文件的形式），TypeScript 将假定从 JavaScript 模块导出的所有内容都是 `any`
类型。

`tsc` 会自动拾取与 `js` 文件同名的 `d.ts` 文件。**Deno 不会这样做。**
你必须明确指定在 `.js` 文件（源文件）或 `.ts` 文件（导入文件）中在哪里找到
`.d.ts` 文件。

### 在源文件中提供类型

应优先在 `.js` 文件中指定 `.d.ts` 文件，因为这使得从多个 TypeScript 模块中使用
JavaScript 模块更容易：你不必在每个导入 JavaScript 模块的 TypeScript 模块中指定
`.d.ts` 文件。

```ts title="add.js"
// @ts-self-types="./add.d.ts"

export function add(a, b) {
  return a + b;
}
```

```ts title="add.d.ts"
export function add(a: number, b: number): number;
```

### 在导入文件中提供类型

如果你无法修改 JavaScript 源文件，你可以在导入 JavaScript 模块的 TypeScript
模块中指定 `.d.ts` 文件。

```ts title="main.ts"
// @ts-types="./add.d.ts"
import { add } from "./add.js";
```

这对于不提供类型信息的 NPM 包也很有用：

```ts title="main.ts"
// @ts-types="npm:@types/lodash"
import * as _ from "npm:lodash";
```

### 为 HTTP 模块提供类型

通过 HTTP 托管 JavaScript 模块的服务器也可以在 HTTP
标头中为这些模块提供类型信息。Deno 在类型检查模块时会使用此信息。

```http
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./add.d.ts
```

`X-TypeScript-Types` 标头指定了为 JavaScript 模块提供类型信息的 `.d.ts`
文件的位置。它相对于 JavaScript 模块的 URL 进行解析，就像 `Location` 标头一样。

## 浏览器和 Web Worker 的类型检查

默认情况下，Deno 将 TypeScript 模块视为在 Deno
运行时的主线程中运行进行类型检查。然而，Deno 还支持对浏览器、Web Worker
以及组合的浏览器-Deno 环境（如使用 SSR（服务器端渲染）与 Deno）进行类型检查。

这些环境具有不同的全局对象和 API。Deno
以库文件的形式为这些环境提供类型定义。TypeScript
编译器使用这些库文件为这些环境中可用的全局对象和 API 提供类型信息。

可以通过 `deno.json` 配置文件中的 `compilerOptions.lib` 选项或通过 TypeScript
文件中的 `/// <reference lib="..." />` 注释来更改加载的库文件。建议在
`deno.json` 配置文件中使用 `compilerOptions.lib` 选项来指定要使用的库文件。

要启用**浏览器环境**的类型检查，你可以在 `deno.json` 配置文件的
`compilerOptions.lib` 选项中指定 `dom` 库文件：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom"]
  }
}
```

这将启用浏览器环境的类型检查，为 `document`
等全局对象提供类型信息。然而，这将禁用 Deno 特定 API（如
`Deno.readFile`）的类型信息。

要启用组合的**浏览器和 Deno 环境**的类型检查，如使用 SSR 与 Deno，你可以在
`deno.json` 配置文件的 `compilerOptions.lib` 选项中同时指定 `dom` 和
`deno.ns`（Deno 命名空间）库文件：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "deno.ns"]
  }
}
```

这将启用浏览器和 Deno 环境的类型检查，为 `document` 等全局对象和 `Deno.readFile`
等 Deno 特定 API 提供类型信息。

要启用**Deno 中的 Web Worker 环境**的类型检查（即使用 `new Worker`
运行的代码），你可以在 `deno.json` 配置文件的 `compilerOptions.lib` 选项中指定
`deno.worker` 库文件。

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["deno.worker"]
  }
}
```

要在 TypeScript 文件中指定要使用的库文件，你可以使用
`/// <reference lib="..." />` 注释：

```ts
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
```

## 增强全局类型

Deno 支持 TypeScript 中的环境或全局类型。这在 polyfill
全局对象或向全局范围添加额外属性时非常有用。**你应该尽可能避免使用环境或全局类型**，因为它们可能导致命名冲突，并使代码更难以理解。它们在发布到
JSR 时也不受支持。

要在 Deno 中使用环境或全局类型，你可以使用 `declare global`
语法，或者加载一个增强全局范围的 `.d.ts` 文件。

### 使用 declare global 增强全局范围

你可以在项目中导入的任何 TypeScript 文件中使用 `declare global`
语法，向全局范围添加额外属性。例如：

```ts
declare global {
  interface Window {
    polyfilledAPI(): string;
  }
}
```

这使得在导入类型定义时，`polyfilledAPI` 函数在全局范围内可用。

### 使用 .d.ts 文件增强全局范围

你也可以使用 `.d.ts` 文件来增强全局范围。例如，你可以创建一个 `global.d.ts`
文件，内容如下：

```ts
interface Window {
  polyfilledAPI(): string;
}
```

然后你可以在 TypeScript 中使用 `/// <reference types="./global.d.ts" />` 加载此
`.d.ts` 文件。这将向全局范围添加 `polyfilledAPI` 函数。

或者，你可以在 `deno.json` 配置文件的 `compilerOptions.types` 数组中指定 `.d.ts`
文件：

```json
{
  "compilerOptions": {
    "types": ["./global.d.ts"]
  }
}
```

这也将向全局范围添加 `polyfilledAPI` 函数。
