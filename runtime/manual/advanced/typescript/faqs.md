# 有关 Deno 中 TypeScript 的常见问题

## 我可以使用不是为 Deno 编写的 TypeScript 吗？

也许。这是最好的答案，我们很抱歉。由于多种原因，Deno
选择了具有完全合格的模块规范符。部分原因是因为它将 TypeScript
视为一流语言。此外，Deno 使用明确的模块解析，没有
"魔法"。实际上，这与浏览器本身的工作方式相同，尽管它们显然不直接支持
TypeScript。如果 TypeScript 模块使用不考虑这些设计决策的导入，它们可能在 Deno
下无法正常工作。

此外，在 Deno 的最新版本中（从 1.5 开始），我们开始使用 Rust 库来在某些情况下将
TypeScript 转换为 JavaScript。因此，在 TypeScript
中存在需要类型信息的某些情况下，它们不受 Deno 支持。如果您正在独立使用
`tsc`，则应将设置为 `"isolatedModules"`，并将其设置为
`true`，以确保您的代码可以被 Deno 正确处理。

处理扩展名和缺乏 Node.js 非标准解析逻辑的一种方式是使用
[导入映射](../../basics/import_maps.md)，它允许您指定 "包" 的裸规范，然后 Deno
可以解析和加载。

## Deno 支持哪个 TypeScript 版本？

Deno 是使用特定版本的 TypeScript
构建的。要找出这是什么版本，请在命令行上输入以下内容：

```shell
> deno --version
```

TypeScript 版本（以及 Deno 和 v8 的版本）将被打印出来。Deno 试图跟上 TypeScript
的一般发布，将它们提供给 Deno 的下一个补丁或次要版本中。

## 在 Deno 使用的 TypeScript 版本中发生了重大变化，为什么要破坏我的程序？

我们不认为 TypeScript 发布的行为变化或破坏性变化会对 Deno
构成破坏性变化。TypeScript 是一种通常成熟的语言，TypeScript
的破坏性变化几乎总是使代码更健壮，最好我们都保持我们的代码健壮。如果 TypeScript
版本中存在阻止问题解决之前不适合使用较旧版本的 Deno 的情况，那么您应该能够使用
`--no-check` 来完全跳过类型检查。

此外，您可以使用 `@ts-ignore` 来忽略您控制的代码中的特定错误。您还可以使用
[导入映射](../../basics/import_maps.md)
来替换整个依赖项，用于处理依赖项的依赖项未得到维护或出现某种破坏性变化，并希望在等待更新时绕过它。

## 如何编写在 Deno 和浏览器中都能正常运行但仍能进行类型检查的代码？

您可以通过使用带有配置文件的 `--config` 选项在命令行上进行配置，然后在文件的
`"compilerOptions"` 中调整 `"lib"` 选项。有关更多信息，请参阅
[Targeting Deno and the Browser](./configuration.md#targeting-deno-and-the-browser)。

## 为什么要强制我使用隔离模块，为什么不能在 Deno 中使用 const 枚举，为什么需要导出类型？

从 Deno 1.5 开始，我们默认将 `isolatedModules` 设置为 `true`，在 Deno 1.6
中，我们删除了通过配置文件将其设置回 `false` 的选项。`isolatedModules` 选项强制
TypeScript 编译器检查并发出
TypeScript，就好像每个模块都是独立的。目前，TypeScript 语言中有一些
"类型导向的发射"。尽管不允许将类型导向的发射引入语言是 TypeScript
的设计目标，但它仍然发生了。这意味着 TypeScript
编译器需要了解代码中的可消除类型，以确定要发射什么，但当您试图在 JavaScript
的基础上构建完全可消除的类型系统时，这就成为一个问题。

当人们开始在不使用 `tsc` 的情况下转译 TypeScript
时，这些类型导向的发射就成了一个问题，因为 Babel
等工具试图消除类型，而不需要了解类型来指导发射。

因此，我们决定禁用这些功能，强制将 `isolatedModules` 选项设置为
`true`，而不是让每个用户理解何时以及如何支持类型导向的发射。这意味着即使在使用
TypeScript 编译器发出代码时，它也将遵循 Rust 基于发射器的相同 "规则"。

这意味着某些语言特性不受支持。这些特性包括：

- 类型的重新导出是模糊的，需要知道源模块是导出运行时代码还是仅是类型信息。因此，建议您使用
  `import type` 和 `export type`
  进行仅类型导入和导出。这将有助于确保在发出代码时，所有类型都被擦除。
- 不支持 `const enum`。`const enum` 需要类型信息来引导发射，因为 `const enum`
  将硬编码的值写入。特别是当 `const enum` 被导出时，它们只是类型系统构造。
- 不支持 `export =` 和 `import =`，这是不受支持的旧 TypeScript 语法。
- 仅支持 `declare namespace`。

运行时 `namespace` 是不受支持的旧 TypeScript 语法。

## 为什么您不支持语言服务插件或转换器插件？

虽然 `tsc` 支持语言服务插件，但 Deno 不支持。Deno 并不总是使用内置的 TypeScript
编译器来执行它的任务，添加语言服务插件的复杂性是不可行的。TypeScript
不支持发射器插件，但有一些社区项目将发射器插件 "黑入"
TypeScript。首先，我们不希望支持 TypeScript 不支持的东西，此外，我们并不总是使用
TypeScript
编译器来执行发射，这意味着我们需要确保在所有模式中都支持它，而另一个发射器是用
Rust 编写的，这意味着 TypeScript 的发射器插件不会对 Rust 发射器可用。

## 如何在我的 IDE 中将 Deno 代码与非 Deno 代码组合？

Deno 语言服务器支持能够对每个资源进行 "单独资源" 配置的功能。这还需要客户端 IDE
支持此功能。对于 Visual Studio Code，官方的
[Deno 扩展](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
支持 vscode 概念的
[multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces)。这意味着您只需将文件夹添加到工作区，并根据需要在每个文件夹上设置
`deno.enable` 设置。

对于其他 IDE，客户端扩展需要支持类似的 IDE 概念。
