---
title: "`deno doc`，文档生成器"
oldUrl:
 - /runtime/manual/tools/documentation_generator/
 - /runtime/reference/cli/documentation_generator/
command: doc
---

## 示例

`deno doc` 后跟一个或多个源文件列表，将打印每个模块的 **导出** 成员的 JSDoc
文档。

例如，给定一个文件 `add.ts`，内容如下：

```ts
/**
 * 将 x 和 y 相加。
 * @param {number} x
 * @param {number} y
 * @returns {number} x 和 y 的和
 */
export function add(x: number, y: number): number {
  return x + y;
}
```

运行 Deno `doc` 命令，将函数的 JSDoc 注释打印到 `stdout`：

```shell
deno doc add.ts
function add(x: number, y: number): number
  将 x 和 y 相加。 @param {number} x @param {number} y @returns {number} x 和 y 的和
```

## 代码检查

你可以使用 `--lint` 标志在生成文档时检查文档中的问题。`deno doc`
会指出三种问题：

1. 错误：根模块中导出的类型引用了未导出的类型。
   - 确保 API 使用者可以访问 API
     使用的所有类型。可以通过从根模块（命令行中指定给 `deno doc`
     的文件之一）导出该类型，或使用 `@internal` jsdoc
     标签标记该类型来抑制此错误。
1. 错误：**公共** 类型缺少返回类型或属性类型。
   - 确保 `deno doc` 显示返回/属性类型，并有助于提高类型检查性能。
1. 错误：**公共** 类型缺少 JS doc 注释。
   - 确保代码有文档记录。可以通过添加 jsdoc 注释，或使用 `@ignore` jsdoc
     标签将其从文档中排除来抑制此错误。或者，添加 `@internal`
     标签以将其保留在文档中，但表示它是内部的。

例如：

```ts title="/mod.ts"
interface Person {
  name: string;
  // ...
}

export function getName(person: Person) {
  return person.name;
}
```

```shell
$ deno doc --lint mod.ts
类型 'getName' 引用了类型 'Person'，该类型未从根模块导出。
缺少 JS 文档注释。
缺少返回类型。
    at file:///mod.ts:6:1
```

这些检查旨在帮助你编写更好的文档并加快项目中的类型检查。如果发现任何问题，程序将以非零退出代码退出，并将输出报告到标准错误。

## 支持的 JSDoc 功能和标签

Deno 实现了大量的 JSDoc 标签，但并不严格遵循 JSDoc
标准，而是与广泛使用的工具和生态系统（如 [TSDoc](https://tsdoc.org/) 和
[TypeDoc](https://typedoc.org/)）提供的合理标准和功能保持一致。

对于任何自由格式的文本位置，即 JSDoc 注释的主要描述、参数的描述等，接受
markdown。

### 支持的标签

以下是支持的标签，这些标签是 JSDoc、TSDoc 和 TypeDoc 使用和指定的标签的一部分：

- [`constructor`/`class`](https://jsdoc.app/tags-class)：将函数标记为构造函数。
- [`ignore`](https://jsdoc.app/tags-ignore)：忽略符号以包含在输出中。
- internal：将符号标记为仅供内部使用。在 HTML
  生成器中，符号不会获得列出的条目，但如果非内部符号链接到它，它仍然会被生成并可以访问。
- [`public`](https://jsdoc.app/tags-public)：将符号视为公共 API。相当于
  TypeScript 的 `public` 关键字。
- [`private`](https://jsdoc.app/tags-private)：将符号视为私有 API。相当于
  TypeScript 的 `private` 关键字。
- [`protected`](https://jsdoc.app/tags-protected)：将属性或方法视为受保护的
  API。相当于 TypeScript 的 `protected` 关键字。
- [`readonly`](https://jsdoc.app/tags-readonly)：将符号标记为只读，意味着它不能被覆盖。
- [`experimental`](https://tsdoc.org/pages/tags/experimental)：将符号标记为实验性的，意味着
  API 可能会更改或删除，或者行为未明确定义。
- [`deprecated`](https://jsdoc.app/tags-deprecated)：将符号标记为已弃用，意味着它不再受支持，并可能在未来的版本中删除。
- [`module`](https://jsdoc.app/tags-module)：此标签可以在顶级 JSDoc
  注释中定义，该注释将视为文件的注释，而不是后续符号的注释。可以指定一个值，该值将用作模块的标识符（即用于默认导出）。
- `category`/`group`：将符号标记为特定类别/组。这对于将各种符号组合在一起很有用。
- [`see`](https://jsdoc.app/tags-see)：定义与符号相关的外部引用。
- [`example`](https://jsdoc.app/tags-example)：定义符号的示例。与 JSDoc
  不同，代码示例需要用三重反引号（markdown 风格的代码块）包裹，这更符合 TSDoc
  而不是 JSDoc。
- `tags`：通过逗号分隔的列表为符号定义额外的自定义标签。
- [`since`](https://jsdoc.app/tags-since)：定义符号自何时起可用。
- [`callback`](https://jsdoc.app/tags-callback)：定义回调。
- [`template`/`typeparam`/`typeParam`](https://tsdoc.org/pages/tags/typeparam)：定义回调。
- [`prop`/`property`](https://jsdoc.app/tags-property)：定义符号的属性。
- [`typedef`](https://jsdoc.app/tags-typedef)：定义类型。
- [`param`/`arg`/`argument`](https://jsdoc.app/tags-param)：定义函数的参数。
- [`return`/`returns`](https://jsdoc.app/tags-returns)：定义函数的返回类型和/或注释。
- [`throws`/`exception`](https://jsdoc.app/tags-throws)：定义函数调用时抛出什么。
- [`enum`](https://jsdoc.app/tags-enum)：将对象定义为枚举。
- [`extends`/`augments`](https://jsdoc.app/tags-augments)：定义函数扩展的类型。
- [`this`](https://jsdoc.app/tags-this)：定义函数中 `this` 关键字所指的内容。
- [`type`](https://jsdoc.app/tags-type)：定义符号的类型。
- [`default`](https://jsdoc.app/tags-default)：定义变量、属性或字段的默认值。

### 内联链接

内联链接允许你指定指向页面其他部分、其他符号或模块的链接。除了支持 markdown
风格的链接外，还支持
[JSDoc 风格的内联链接](https://jsdoc.app/tags-inline-link)。

例如，你可以使用 `{@link https://docs.deno.com}`，它将呈现为以下内容
'https://docs.deno.com'。`{@linkcode https://docs.deno.com}`
也可以使用，以使其以等宽字体显示，并将呈现为 '`https://docs.deno.com`'。

你还可以通过 `{@link https://docs.deno.com | Deno Docs}` 指定替换标签，它将使用
`|` 后的文本作为显示的文本，而不是链接。前面的示例将呈现为
'[Deno Docs](https://docs.deno.com)'。

你可以通过 `{@link MySymbol}` 在描述中添加指向其他符号的内联链接。

对于模块链接，同样适用，但你使用 `{@link [myModule]}` 语法。你还可以通过
`{@link [myModule].mysymbol}` 链接到不同模块中的符号。

## HTML 输出

使用 `--html` 标志生成带有文档的静态站点。

```console
$ deno doc --html --name="我的库" ./mod.ts

$ deno doc --html --name="我的库" --output=./documentation/ ./mod.ts

$ deno doc --html --name="我的库" ./sub1/mod.ts ./sub2/mod.ts
```

生成的文档是一个包含多个页面的静态站点，可以部署到任何静态站点托管服务。

生成的站点中包含客户端搜索，但如果用户的浏览器禁用了 JavaScript，则不可用。

## JSON 输出

使用 `--json` 标志以 JSON 格式输出文档。此 JSON 格式由
[deno doc 网站](https://github.com/denoland/docland) 使用，用于生成模块文档。
