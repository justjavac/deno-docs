---
title: "配置 TypeScript"
oldUrl:
  - /runtime/manual/advanced/typescript/faqs/
  - /runtime/manual/advanced/typescript/migration/
  - /runtime/manual/advanced/typescript/configuration/
  - /runtime/manual/advanced/typescript/types/
  - /runtime/manual/typescript/types/
  - /runtime/manual/advanced/faqs/
  - /runtime/advanced/typescript/configuration/
  - /runtime/manual/typescript/typescript/faqs/
  - /runtime/fundamentals/types/
---

Deno 的灵活性体现在它对 TypeScript 和 JavaScript 的平等对待上。无论你是从
JavaScript 过渡到 TypeScript，还是反之，Deno 都有功能来简化这一过程。

## 类型检查 JavaScript

你可能希望在不添加类型注解的情况下使你的 JavaScript 更具类型安全性。Deno
支持使用 TypeScript 类型检查器来检查 JavaScript
的类型。你可以通过在文件中添加检查 JavaScript 的编译指示来标记单个文件：

```js
// @ts-check
```

这将使类型检查器推断出 JavaScript 代码的类型信息，并将任何问题作为诊断问题提出。

通过提供一个配置文件并将 check JS 选项设置为 `true`，可以为程序中的所有
JavaScript 文件启用这些功能，如下所示。然后在命令行运行时使用 `--config` 选项。

```json
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

## 在 JavaScript 中使用 JSDoc

当对 JavaScript 进行类型检查或将 JavaScript 导入 TypeScript 时，JSDoc
注解可以提供超出代码本身所能推断的额外类型信息。如果你在代码中内联使用支持的
[TypeScript JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
进行注解，Deno 可以无缝支持这一点。

例如，要设置数组的类型，请使用以下 JSDoc 注释：

```js
/** @type {string[]} */
const a = [];
```

## 跳过类型检查

你可能有一些正在实验的 TypeScript
代码，其语法有效但并非完全类型安全。你可以通过传递 `--no-check`
标志来绕过整个程序的类型检查。

你也可以使用 `nocheck` 编译指示来跳过整个文件的类型检查，包括启用了 check JS 的
JavaScript：

```js
// @ts-nocheck
```

## 将 JS 文件重命名为 TS 文件

TypeScript 文件受益于 TypeScript
编译器能够对你的代码进行更彻底的安全检查。这通常被称为 _严格模式_。当你将 `.js`
文件重命名为 `.ts` 时，你可能会看到 TypeScript 之前无法检测到的新类型错误。

## 在 Deno 中配置 TypeScript

TypeScript 提供了许多配置选项，如果你刚开始使用 TS，这可能会让人望而生畏。Deno
旨在简化 TypeScript 的使用，而不是让你淹没在无数的设置中。Deno 将 TypeScript
配置为 **开箱即用**。无需额外的配置麻烦！

但是，如果你确实想更改 TypeScript 编译器选项，Deno 允许你在 `deno.json`
文件中进行更改。在命令行中提供路径，或使用默认路径。例如：

```console
deno run --config ./deno.json main.ts
```

:::note

如果你正在创建需要配置文件的库，请记住，所有使用你的 TS
模块的消费者也需要该配置文件。此外，配置文件中可能存在使其他 TypeScript
模块不兼容的设置。

:::

## TS 编译器选项

以下是可更改的编译器选项表，它们在 Deno 中的默认值以及有关该选项的其他说明：

| 选项                             | 默认值                  | 说明                                                                                             |
| -------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| `allowJs`                        | `true`                  | 几乎不需要更改                                                                                   |
| `allowUnreachableCode`           | `false`                 |                                                                                                  |
| `allowUnusedLabels`              | `false`                 |                                                                                                  |
| `checkJs`                        | `false`                 | 如果为 `true`，则 TypeScript 会检查 JavaScript 的类型                                            |
| `jsx`                            | `"react"`               |                                                                                                  |
| `jsxFactory`                     | `"React.createElement"` |                                                                                                  |
| `jsxFragmentFactory`             | `"React.Fragment"`      |                                                                                                  |
| `keyofStringsOnly`               | `false`                 |                                                                                                  |
| `lib`                            | `[ "deno.window" ]`     | 此默认值根据 Deno 中的其他设置而变化。如果提供了该值，它将覆盖默认值。有关更多信息，请参见下文。 |
| `noErrorTruncation`              | `false`                 |                                                                                                  |
| `noFallthroughCasesInSwitch`     | `false`                 |                                                                                                  |
| `noImplicitAny`                  | `true`                  |                                                                                                  |
| `noImplicitOverride`             | `true`                  |                                                                                                  |
| `noImplicitReturns`              | `false`                 |                                                                                                  |
| `noImplicitThis`                 | `true`                  |                                                                                                  |
| `noImplicitUseStrict`            | `true`                  |                                                                                                  |
| `noStrictGenericChecks`          | `false`                 |                                                                                                  |
| `noUnusedLocals`                 | `false`                 |                                                                                                  |
| `noUnusedParameters`             | `false`                 |                                                                                                  |
| `noUncheckedIndexedAccess`       | `false`                 |                                                                                                  |
| `reactNamespace`                 | `React`                 |                                                                                                  |
| `strict`                         | `true`                  |                                                                                                  |
| `strictBindCallApply`            | `true`                  |                                                                                                  |
| `strictFunctionTypes`            | `true`                  |                                                                                                  |
| `strictPropertyInitialization`   | `true`                  |                                                                                                  |
| `strictNullChecks`               | `true`                  |                                                                                                  |
| `suppressExcessPropertyErrors`   | `false`                 |                                                                                                  |
| `suppressImplicitAnyIndexErrors` | `false`                 |                                                                                                  |
| `useUnknownInCatchVariables`     | `true`                  |                                                                                                  |

有关编译器选项的完整列表及其对 TypeScript 的影响，请参阅
[TypeScript 手册](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。

## 使用 "lib" 属性

如果你正在开发一个将代码发布到多个运行时的项目，例如浏览器，你可以通过
`compilerOptions` 中的 "lib" 属性调整默认类型。

用户感兴趣的内置库：

- `"deno.ns"` - 这包括所有自定义的 `Deno` 全局命名空间 API 以及 Deno 对
  `import.meta` 的添加。这通常不会与其他库或全局类型冲突。
- `"deno.unstable"` - 这包括额外的不稳定 `Deno` 全局命名空间 API。
- `"deno.window"` - 这是检查 Deno 主运行时脚本时使用的 "默认" 库。它包括
  `"deno.ns"` 以及 Deno 内置扩展的其他类型库。此库将与 `"dom"` 和
  `"dom.iterable"` 等标准 TypeScript 库冲突。
- `"deno.worker"` - 这是检查 Deno Web Worker 脚本时使用的库。有关 Web Worker
  的更多信息，请参阅
  [类型检查 Web Worker](/runtime/reference/ts_config_migration/#type-checking-web-workers)。
- `"dom.asynciterable"` - TypeScript 目前不包括 Deno 实现的 DOM
  异步可迭代对象（以及几个浏览器），因此我们自己实现了它，直到它在 TypeScript
  中可用。

这些是默认情况下未启用的常见库，但在编写旨在在其他运行时中工作的代码时很有用：

- `"dom"` - TypeScript 附带的主要浏览器全局库。类型定义在许多方面与
  `"deno.window"` 冲突，因此如果使用 `"dom"`，则考虑仅使用 `"deno.ns"` 来暴露
  Deno 特定的 API。
- `"dom.iterable"` - 浏览器全局库的可迭代扩展。
- `"scripthost"` - Microsoft Windows Script Host 的库。
- `"webworker"` - 浏览器中 Web Worker 的主要库。与 `"dom"` 一样，这将与
  `"deno.window"` 或 `"deno.worker"` 冲突，因此考虑仅使用 `"deno.ns"` 来暴露
  Deno 特定的 API。
- `"webworker.importscripts"` - 暴露 Web Worker 中 `importScripts()` API 的库。
- `"webworker.iterable"` - 向 Web Worker
  中的对象添加可迭代对象的库。现代浏览器支持这一点。

## 针对 Deno 和浏览器

你可能希望编写在 Deno
和浏览器中无缝运行的代码。在这种情况下，你需要在执行任何特定于其中一个或另一个的
API 之前有条件地检查执行环境。在这种情况下，典型的 `compilerOptions`
配置可能如下所示：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}
```

这应该允许 Deno 正确地对大多数代码进行类型检查。

如果你希望在 Deno 中使用 `--unstable`
标志运行代码，那么你还应该将该库添加到混合中：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "deno.ns",
      "deno.unstable"
    ]
  }
}
```

通常，当你在 TypeScript 中使用 `"lib"` 选项时，你还需要包含一个 "es" 库。在
`"deno.ns"` 和 `"deno.unstable"` 的情况下，当你引入它们时，它们会自动包含
`"esnext"`。

:::note

如果你遇到类似 **无法找到 `document` 或 `HTMLElement`**
的类型错误，很可能你使用的库依赖于
DOM。这对于设计为在浏览器和服务器端运行的包来说很常见。默认情况下，Deno
仅包括直接支持的库。假设包在运行时正确识别了它运行的环境，使用 DOM
库来类型检查代码是 "安全" 的。

:::

## 类型和类型声明

Deno 采用了 _无非标准模块解析_ 的设计原则。当 TypeScript
检查文件时，它只关注其类型。相比之下，`tsc`
编译器采用复杂的逻辑来解析这些类型。默认情况下，`tsc`
期望带有扩展名的模糊模块说明符（例如 `.ts`、`.d.ts` 或 `.js`）。然而，Deno
处理的是明确的说明符。

有趣的是：假设你想使用一个已经编译为 JavaScript 的 TypeScript
文件及其类型定义文件（`mod.js` 和 `mod.d.ts`）。如果你将 `mod.js` 导入
Deno，它会严格遵循你的请求并导入 JavaScript 文件。但问题是：你的代码不会像
TypeScript 考虑 `mod.d.ts` 文件那样进行彻底的类型检查。

为了解决这个问题，Deno 提供了两种解决方案，每种方案都针对特定场景：

**作为导入者：** 如果你知道应该应用于 JavaScript
模块的类型，你可以通过明确指定类型来增强类型检查。

**作为提供者：**
如果你是模块的提供者或托管者，所有使用它的人都会受益，而无需担心类型解析。

## 导入时提供类型

如果你正在使用一个 JavaScript 模块，并且你已经创建了类型（一个 `.d.ts`
文件）或以其他方式获得了你想要使用的类型，你可以使用 `@ts-types` 编译提示指示
Deno 在类型检查时使用该文件，而不是 JavaScript 文件。

例如，如果你有一个 JavaScript 模块 `coolLib.js` 和一个单独的 `coolLib.d.ts`
文件，你可以像这样导入它：

```ts
// @ts-types="./coolLib.d.ts"
import * as coolLib from "./coolLib.js";
```

当你对 `coolLib` 进行类型检查并在你的文件中使用它时，`coolLib.d.ts` 中的
TypeScript 类型定义将优先于检查 JavaScript 文件。

:::note

过去，`@ts-types` 指令被称为
`@deno-types`。这个别名仍然有效，但不再推荐使用。请使用 `@ts-types`。

:::

## 托管时提供类型

如果你控制模块的源代码或文件在 Web 服务器上的托管方式，有两种方法可以让 Deno
知道特定模块的类型（这不需要导入者采取任何特殊操作）。

### @ts-self-types

如果你正在提供一个 JavaScript
文件，并且想提供一个包含该文件类型的声明文件，你可以在 JS 文件中指定一个
`@ts-self-types` 指令，指向声明文件。

例如，如果你制作了一个 `coolLib.js` 库，并在 `coolLib.d.ts`
中编写了其类型定义，`ts-self-types` 指令将如下所示：

```js title="coolLib.js"
// @ts-self-types="./coolLib.d.ts"

// ... 其余的 JavaScript ...
```

### X-TypeScript-Types

Deno 支持一个用于远程模块的标头，指示 Deno
在哪里找到给定模块的类型。例如，`https://example.com/coolLib.js`
的响应可能如下所示：

```console
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./coolLib.d.ts
```

当看到此标头时，Deno 将尝试检索 `https://example.com/coolLib.d.ts`
并在类型检查原始模块时使用它。

## 使用环境或全局类型

总的来说，最好在 Deno 中使用模块/UMD
类型定义，其中模块明确导入它所依赖的类型。模块化类型定义可以通过
`declare global` 在类型定义中表达
[全局范围的扩展](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html)。例如：

```ts
declare global {
  var AGlobalString: string;
}
```

这将使 `AGlobalString` 在导入类型定义时在全局命名空间中可用。

在某些情况下，当利用其他现有类型库时，可能无法利用模块化类型定义。因此，有一些方法可以在类型检查程序时包含任意类型定义。

### 三斜杠指令

此选项将类型定义与代码本身耦合。通过在 TS 文件（而不是 JS 文件！）中添加三斜杠
`types` 指令，类型检查文件时将包含类型定义。例如：

```ts
/// <reference types="./types.d.ts" />
```

提供的说明符像 Deno
中的任何其他说明符一样解析，这意味着它需要一个扩展名，并且相对于引用它的模块。它也可以是一个完全限定的
URL：

```ts
/// <reference types="https://deno.land/x/pkg@1.0.0/types.d.ts" />
```

### 在 deno.json 中提供 "types"

另一个选项是在 `deno.json` 中的 `"compilerOptions"` 中提供 `"types"` 值。例如：

```json title="deno.json"
{
  "compilerOptions": {
    "types": [
      "./types.d.ts",
      "https://deno.land/x/pkg@1.0.0/types.d.ts",
      "/Users/me/pkg/types.d.ts"
    ]
  }
}
```

与上面的三斜杠引用一样，`"types"` 数组中提供的说明符将像 Deno
中的其他说明符一样解析。在相对说明符的情况下，它将相对于配置文件的路径解析。确保通过指定
`--config=path/to/file` 标志告诉 Deno 使用此文件。

## 类型检查 Web Worker

当 Deno 在 Web Worker 中加载 TypeScript 模块时，它将自动根据 Deno Web Worker
库对模块及其依赖项进行类型检查。这在 `deno check`
或编辑器等其他上下文中可能会带来挑战。有几种方法可以指示 Deno 使用 Worker
库而不是标准 Deno 库。

### 三斜杠指令

此选项将库设置与代码本身耦合。通过在 Worker
脚本的入口点文件顶部附近添加以下三斜杠指令，Deno 现在将将其作为 Deno Worker
脚本进行类型检查，无论模块如何分析：

```ts
/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />
```

第一个指令确保不使用其他默认库。如果省略这一点，你将得到一些冲突的类型定义，因为
Deno 将尝试应用标准 Deno 库。第二个指令指示 Deno 应用内置的 Deno Worker
类型定义以及依赖库（如 `"esnext"`）。

这样做的一个缺点是，它使代码在其他非 Deno 平台（如
`tsc`）上的可移植性降低，因为只有 Deno 内置了 `"deno.worker"` 库。

### 在 deno.json 中提供 "lib" 设置

你可以在 `deno.json` 文件中提供 "lib" 选项来指示 Deno 使用库文件。例如：

```json title="deno.json"
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["deno.worker"]
  }
}
```

然后在运行 deno 子命令时，你需要传递 `--config path/to/file`
参数，或者如果你使用的是利用 Deno 语言服务器的 IDE，请设置 `deno.config` 设置。

如果你还有非 Worker 脚本，你将需要省略 `--config` 参数，或者有一个配置为满足非
Worker 脚本需求的配置文件。

## 重要点

### 类型声明语义

类型声明文件（`.d.ts` 文件）遵循与 Deno
中其他文件相同的语义。这意味着声明文件被假定为模块声明（_UMD
声明_），而不是环境/全局声明。Deno 如何处理环境/全局声明是不可预测的。

此外，如果类型声明导入了其他内容，如另一个 `.d.ts` 文件，其解析遵循 Deno
的正常导入规则。对于许多生成并可在网络上找到的 `.d.ts` 文件，它们可能与 Deno
不兼容。

[esm.sh](https://esm.sh) 是一个默认提供类型声明的 CDN（通过 `X-TypeScript-Types`
标头）。可以通过在导入 URL 后附加 `?no-dts` 来禁用它：

```ts
import React from "https://esm.sh/react?no-dts";
```

## 类型检查时 JavaScript 的行为

当你在 Deno 中将 JavaScript 代码导入 TypeScript 时，即使你将 `checkJs` 设置为
`false`（这是 Deno 的默认行为），TypeScript 编译器仍会分析
