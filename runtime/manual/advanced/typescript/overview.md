# Deno 中的 TypeScript 概述

Deno 的一个优点是，它将 TypeScript 视为一流语言，就像 JavaScript 或 Web Assembly
一样，在 Deno 中运行代码时。 这意味着您可以在 Deno 中运行或导入
TypeScript，而无需安装 Deno CLI 之外的任何内容。

_但等一下，Deno 真的可以运行 TypeScript 吗？_
你可能会问自己。嗯，这取决于您所说的“运行”是什么意思。有人可能会争辩说，在浏览器中，您实际上也不会“运行”JavaScript。浏览器中的
JavaScript 引擎将 JavaScript
转换为一系列操作代码，然后在沙盒中执行它。因此，它将 JavaScript
转换为接近汇编的东西。即使 Web Assembly 也需要经历类似的转换过程，因为 Web
Assembly
是体系结构不可知的，而它需要被翻译成特定平台体系结构所需的机器特定操作代码。因此，当我们说
TypeScript 在 Deno 中是一流语言时，我们的意思是我们试图使 TypeScript
的创作和运行体验与 JavaScript 和 Web Assembly 一样简单和直接。

在幕后，我们使用 Rust 和 JavaScript 的各种技术来提供这种体验。

## 它是如何工作的？

从高层次来看，Deno 将 TypeScript（以及 TSX 和 JSX）转换为 JavaScript。它通过
[TypeScript 编译器](https://github.com/microsoft/TypeScript)（我们将其构建到
Deno 中）和一个名为 [swc](https://swc.rs/) 的 Rust
库的组合来实现这一点。当代码经过类型检查和转换后，它将被存储在缓存中，准备好下一次运行，而无需再次从源代码转换为
JavaScript。

您可以通过运行 `deno info` 来查看此缓存位置：

```shell
> deno info
DENO_DIR位置：“/path/to/cache/deno”
远程模块缓存：“/path/to/cache/deno/deps”
TypeScript编译器缓存：“/path/to/cache/deno/gen”
```

如果您查看缓存，您将看到一个模仿源目录结构的目录结构以及各个 `.js` 和 `.meta`
文件（还可能包括 `.map` 文件）。`.js` 文件是转换后的源文件，而 `.meta`
文件包含有关文件的缓存信息，目前包括源模块的“哈希”，这有助于我们管理缓存失效。您还可能看到一个
`.buildinfo` 文件，它是 TypeScript
编译器增量构建信息文件，我们将其缓存以加速类型检查。

## 类型检查

TypeScript 的主要优点之一是您可以使代码更具类型安全性，以便原本在语法上有效的
JavaScript 变成带有“不安全”警告的 TypeScript。

您可以使用以下命令对代码进行类型检查（而不执行它）：

```shell
deno check module.ts
# 或者也可以对远程模块和 npm 包进行类型检查
deno check --all module.ts
```

类型检查可能需要很长时间，特别是如果您正在处理对代码进行了大量更改的代码库。我们已经尝试优化了类型检查，但它仍然会带来一些成本。**因此，默认情况下，TypeScript
模块在执行之前不进行类型检查。**

```shell
deno run module.ts
```

在使用上面的命令时，Deno 将简单地将模块转译为
JavaScript，忽略任何潜在的与类型相关的问题。为了在执行之前执行模块的类型检查，必须使用
`deno run` 的 `--check` 参数：

```shell
deno run --check module.ts
# 或者也可以对远程模块和 npm 包进行类型检查
deno run --check=all module.ts
```

虽然 `tsc`（默认情况下）在遇到诊断（类型检查）问题时仍然会生成 JavaScript，但
Deno 当前将其视为终端。当使用 `deno run` _带有_ `--check`
参数时，与类型相关的诊断将阻止程序运行：它将在这些警告上停止，并在执行代码之前终止进程。

为了避免这种情况，您需要解决该问题，使用 `// @ts-ignore` 或
`// @ts-expect-error` 预处理指令，或完全跳过类型检查。

您可以在
[此处](../../getting_started/command_line_interface.md#type-checking-flags)
了解有关类型检查参数的更多信息。

## 确定文件类型

由于 Deno 支持 JavaScript、TypeScript、JSX、TSX 模块，因此 Deno
必须决定如何处理这些类型的文件。对于本地模块，Deno
完全基于扩展名来确定此问题。如果本地文件中没有扩展名，它将被视为 JavaScript。

对于远程模块，媒体类型（MIME
类型）用于确定模块的类型，模块的路径用于帮助影响文件类型，当不清楚文件类型时。

例如，`.d.ts` 文件和 `.ts` 文件在 TypeScript 中具有不同的语义，它们在 Deno
中需要以不同的方式处理。虽然我们希望将 `.ts` 文件转换为 JavaScript，但 `.d.ts`
文件不包含“可运行”的代码，只是描述类型（通常是“纯粹”的
JavaScript）。因此，当我们获取远程模块时，`.ts.` 和 `.d.ts`
文件的媒体类型看起来相同。因此，我们查看路径，如果我们看到以 `.d.ts` 结尾的

路径，我们将其视为仅包含类型定义的文件，而不是“可运行”的 TypeScript。

### 支持的媒体类型

以下表格提供了 Deno 支持的用于识别远程模块文件类型的媒体类型列表：

| 媒体类型                   | 文件处理方式                   |
| -------------------------- | ------------------------------ |
| `application/typescript`   | TypeScript（受路径扩展名影响） |
| `text/typescript`          | TypeScript（受路径扩展名影响） |
| `video/vnd.dlna.mpeg-tts`  | TypeScript（受路径扩展名影响） |
| `video/mp2t`               | TypeScript（受路径扩展名影响） |
| `application/x-typescript` | TypeScript（受路径扩展名影响） |
| `application/javascript`   | JavaScript（受路径扩展名影响） |
| `text/javascript`          | JavaScript（受路径扩展名影响） |
| `application/ecmascript`   | JavaScript（受路径扩展名影响） |
| `text/ecmascript`          | JavaScript（受路径扩展名影响） |
| `application/x-javascript` | JavaScript（受路径扩展名影响） |
| `application/node`         | JavaScript（受路径扩展名影响） |
| `text/jsx`                 | JSX                            |
| `text/tsx`                 | TSX                            |
| `text/plain`               | 尝试确定路径扩展名，否则未知   |
| `application/octet-stream` | 尝试确定路径扩展名，否则未知   |

## 默认情况下严格

Deno 默认情况下以_严格_模式对 TypeScript 进行类型检查，并且 TypeScript
核心团队建议将_严格_模式视为合理的默认设置。此模式通常启用了 TypeScript
的功能，这些功能可能一开始就应该存在，但随着 TypeScript
的持续发展，它们对现有代码将是破坏性的更改。

## 混合 JavaScript 和 TypeScript

默认情况下，Deno 不对 JavaScript 进行类型检查。这可以更改，详细信息在
[在 Deno 中配置 TypeScript](./configuration.md) 中进一步讨论。Deno 支持
JavaScript 导入 TypeScript 和 TypeScript 导入 JavaScript，以及复杂情况。

不过，重要的一点是，在进行 TypeScript 类型检查时，默认情况下 Deno 将“读取”所有
JavaScript，以便能够评估它对 TypeScript
类型可能产生的影响。类型检查器将尽力确定您导入 TypeScript 的 JavaScript
的类型，包括阅读任何 JSDoc 注释。有关详细信息，请参阅
[类型和类型声明](./types.md) 部分。

## 类型解析

Deno
的一个核心设计原则之一是避免非标准模块解析，这也适用于类型解析。如果要使用带有类型定义的
JavaScript（例如 `.d.ts` 文件），您必须明确告诉 Deno。如何实现这一点的详细信息在
[类型和类型声明](./types.md) 部分中涵盖。
