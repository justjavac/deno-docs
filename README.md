# Deno 文档

此仓库包含运行 [docs.deno.com](https://docs.deno.com)
的网站。该项目的目的是将所有官方 Deno 文档内容集中在一个网站上。Deno
文档网站是使用 [Lume](https://lume.land/) 构建的，这是一个极快的静态网站生成器。

`docs.deno.com` 网站托管在 [Deno Deploy](https://deno.com/deploy) 上。

## 本地开发

安装 [Deno](https://deno.com)。

然后可以通过以下命令启动本地开发服务器：

```console
deno task serve
```

这将启动一个浏览器窗口，打开
[localhost:3000](http://localhost:3000)，您将在此处看到您对文档内容所做的任何更改实时更新。此处重定向将不起作用。如果您希望重定向生效，需要运行：

```console
deno task build
deno task prod
```

这将在 [localhost:8000](http://localhost:8000) 上启动一个用于生产的 Deno
服务器，该服务器处理重定向。

## 开发样式和组件

我们越来越多地使用全局组件来提高一致性并减少重复。已创建了一个样式指南来预览和开发这些组件，并在构建过程中生成。

您可以在站点的 `/styleguide/` 目录下浏览它。

为了避免在开发 UI
元素和组件时整个站点及其所有内容的较长构建时间，提供了一个仅样式指南的构建，该构建执行站点的初始全局配置，但仅生成并监视仓库中
`/styleguide` 文件夹的更改。

要仅处理组件和 UI 元素并在样式指南中查看它们，请运行：

```console
deno task serve:style
```

然后浏览站点的样式指南部分，地址为 `/styleguide/`

## 编辑内容

文档站点的实际内容主要位于以下文件夹中：

- `runtime` - Deno CLI / 运行时的文档
- `deploy` - Deno Deploy 云服务的文档
- `subhosting` - Deno Subhosting 的文档
- `examples` - [示例](#Examples) 部分的文档

大多数文件是 [markdown](https://lume.land/plugins/markdown/)，但即使是 markdown
文件也使用 [MDX](https://mdxjs.com/) 进行处理，这使您可以在 markdown 文件中使用
JSX 语法。

不同文档部分的左侧导航在其各自的内容目录中的 `_data.ts` 文件中配置。

- `runtime/_data.ts` - Runtime 部分的侧边栏配置
- `deploy/_data.ts` - Deno Deploy 部分的侧边栏配置

静态文件（如截图）可以直接包含在 `runtime`、`deploy` 或 `kv`
文件夹中，并通过相对 URL 在您的 markdown 中引用。

## 参考文档

在 `/api` 提供的参考文档是通过 `deno doc`
子命令生成的。要在本地生成参考文档，请运行：

```console
deno task reference
```

这将生成参考文档，您可以使用 `serve` 或 `build` 任务。

API 参考文档是从 [Deno 源代码](https://github.com/denoland/deno)
中的类型定义生成的。可以通过修改 Deno 源代码中相应的 `d.ts` 文件中的 JSDoc
注释来编辑 API 参考内容。合并后，更改将在下次更新 Deno 文档站点时反映在 API
参考文档中。

### 预览 API 参考更改

为了预览 API 参考的更改，请执行以下步骤：

1. 在 Deno 源代码中修改 JSDoc 注释
1. [在本地构建 Deno CLI](https://docs.deno.com/runtime/contributing/building_from_source/)，包括您的
   JSDoc 更改
1. 为了方便，创建一个 `d_deno` 别名，指向您本地构建的 Deno CLI（通常在 CLI
   仓库的 `target/debug/deno` 目录中）
1. 通过运行 `d_deno task reference` 从您本地构建的 Deno CLI 生成参考文档
1. 在根目录中运行 `deno task serve` 命令以查看更改

## 文档内容版本控制

从哲学上讲，我们希望尽可能少地维护文档的离散版本。这将减少用户的困惑（减少他们需要考虑的版本数量），改善搜索索引，并通过保持构建时间更快来帮助我们维护文档。

一般来说，我们只应在 **希望同时维护多个版本的文档**
时才对文档进行版本控制，例如主要/LTS 版本。例如 -
[Node.js 文档](https://nodejs.org/en/docs) 仅对主要版本进行版本控制，如 `20.x`
和 `19.x`。我们将采用这种模式，并且不会对补丁或功能版本进行版本控制的文档。

对于增量更改，通常只需指示功能或 API 是在哪个版本中发布的即可。例如 - 在 Node 20
文档中，[register 函数](https://nodejs.org/dist/latest-v20.x/docs/api/module.html#moduleregister)
被标记为在版本 `20.6.0` 中添加。

## 贡献

我们非常感谢您为改进 Deno
文档提供的任何帮助！对于任何小的文本更改或修复，请随时直接向此仓库的 `main` 分支
[提交拉取请求](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)。

对于较大的更改，请先
[创建一个 GitHub 问题](https://github.com/denoland/deno-docs/issues)
来描述您提出的更新。在编写大量文档之前，最好先获得对您概念的反馈！

随着时间的推移，我们将在拉取请求过程中添加更多的 linting
和格式化。但目前，您只需确保 `npm run build`
成功无误后再提交拉取请求。这将确保您编写的内容中没有损坏的链接或无效的 MDX
语法。

## 示例

[Deno by Example](https://docs.deno.com/examples)
是一个小型代码片段、教程和视频的集合，展示了 Deno 中实现的各种 API 功能。

### 添加示例脚本

- 示例用 TypeScript 编写
- 每个示例应为一个文件，不超过 50 行
- 每个示例应为一个自包含的单元，并且除了 Deno
  内置和标准库外，不应依赖任何依赖项，除非严格需要第三方库。
- 每个示例应可在所有系统上运行，无需额外依赖（平台特定功能可以例外）
- 示例应最多引入一个（或在特殊情况下两到三个）Deno / Web API
  的概念。现有概念应链接到。
- 代码应保持
  **非常简单**，并且应易于任何人阅读和理解。不要使用复杂的代码结构或难以理解的内置函数，如
  `Array.reduce`
- 示例中引入的概念应加以解释

### 添加示例

要添加示例，请在 `examples/scripts`
目录中创建一个文件。文件名应为示例的简短描述（使用 kebab
case），内容应为示例的代码。文件应为 `.ts` 格式。文件应以描述示例的 JSDoc
风格多行注释开头：

```ts
/**
 * @title HTTP 服务器：Hello World
 * @difficulty 中级
 * @tags cli, deploy
 * @run --allow-net <url>
 * @group 基础
 *
 * 一个 HTTP 服务器的示例，提供 "Hello World" 消息。
 */
```

您应添加一个标题、难度级别（`beginner` 或
`intermediate`）和标签列表（`cli`、`deploy`、`web`，取决于示例可运行的位置）。如果示例可以通过
`deno run <url>` 在本地运行，则应包含 `@run`
标签。如果运行需要权限，请添加这些权限：

```ts
/**
 * ...
 * @run --allow-net --allow-read <url>
 */
```

在 pragmas
之后，您可以添加示例的描述。这是可选的，但建议大多数示例都添加。描述不应超过一两行。描述显示在示例页面的顶部，并在搜索结果中显示。

在 JS Doc
注释之后，您可以编写代码。代码可以前缀一个描述代码的注释。注释将在示例页面中与代码一起呈现。

## 特别感谢历史贡献

此仓库是使用 [Deno 手册](https://github.com/denoland/manual)
中的内容创建的，该项目自 2018
年以来由数百名开发者贡献。您可以通过以下命令查看此仓库和手册中 Deno
文档的历史贡献者列表：

```bash
git shortlog -s -n
```

## 部署

`docs.deno.com` 站点在每次推送到 `main`
分支时更新，应通过向此仓库提交拉取请求来完成。

## 许可证

MIT
