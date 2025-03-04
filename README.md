# Deno 文档

此仓库包含运行 [docs.denohub.com](https://docs.denohub.com)
的网站。该项目的目的是将所有官方的 Deno 文档内容集中在一个网站上。Deno
文档网站是使用 [Lume](https://lume.land/) 构建的，这是一个极快的静态网站生成器。

## 本地开发

安装 [Deno](https://docs.denohub.com/runtime/getting_started/installation/)。

然后你可以通过以下命令启动本地开发服务器：

```console
deno task serve
```

这将打开一个浏览器窗口，访问
[localhost:3000](http://localhost:3000)，在这里你可以看到你所做的文档内容更改实时更新。重定向在这里不会生效。如果你希望重定向生效，你需要运行：

```console
deno task build
deno task prod
```

这将在 [localhost:8000](http://localhost:8000) 上启动一个用于生产的 Deno
服务器，它会处理重定向。

## 编辑内容

文档网站的实际内容主要位于以下文件夹中：

- `runtime` - Deno CLI / 运行时的文档
- `deploy` - Deno Deploy 云服务的文档
- `subhosting` - Deno Subhosting 的文档
- `examples` - [示例](#示例) 部分的文档

大多数文件是 [markdown](https://lume.land/plugins/markdown/) 格式，但即使是
markdown 文件也会通过 [MDX](https://mdxjs.com/) 进行处理，这使你可以使用 JSX
语法。

不同文档部分的左侧导航栏在各自内容目录的 `_data.ts` 文件中配置。

- `runtime/_data.ts` - Runtime 部分的侧边栏配置
- `deploy/_data.ts` - Deno Deploy 部分的侧边栏配置

静态文件（如截图）可以直接包含在 `runtime`、`deploy` 或 `kv`
文件夹中，并通过相对 URL 在 markdown 中引用。

## 参考文档

在 `/api` 提供的参考文档是通过 `deno doc`
子命令生成的。要在本地生成参考文档，请运行：

```console
deno task reference
```

这将生成参考文档，你可以使用 `serve` 或 `build` 任务。

API 参考文档是从 [Deno 源代码](https://github.com/denoland/deno)
中的类型定义生成的。API 参考内容可以通过修改 Deno 源代码中相应的 `d.ts` 文件中的
JSDoc 注释来编辑。一旦合并，更改将在下次更新 Deno 文档网站时反映在 API
参考文档中。

### 预览 API 参考更改

为了预览 API 参考的更改，请按照以下步骤操作：

1. 在 Deno 源代码中修改 JSDoc 注释
1. [在本地构建 Deno CLI](https://docs.denohub.com/runtime/contributing/building_from_source/)，包括你的
   JSDoc 更改
1. 为了方便，创建一个 `d_deno` 别名，指向你本地构建的 Deno CLI（通常在 CLI
   仓库的 `target/debug/deno` 目录中）
1. 通过在你的本地 Deno CLI 构建中运行 `d_deno task reference` 生成参考文档
1. 在根目录中运行 `deno task serve` 命令以查看更改

## 文档内容版本控制

从哲学上讲，我们希望尽可能少地维护文档的离散版本。这将减少用户的困惑（减少他们需要考虑的版本数量），改善搜索索引，并通过保持构建时间更快来帮助我们维护文档。

一般来说，我们只应在 **希望同时维护多个版本的文档**
时才对文档进行版本控制，例如主要版本或 LTS 版本。例如 -
[Node.js 文档](https://nodejs.org/en/docs) 仅对主要版本进行版本控制，如 `20.x`
和 `19.x`。我们将采用这种模式，并且不会为补丁或功能发布提供版本化的文档。

对于增量更改，通常只需指示某个功能或 API 是在哪个版本中发布的即可。例如 - 在
Node 20
文档中，[register 函数](https://nodejs.org/dist/latest-v20.x/docs/api/module.html#moduleregister)
被标记为在 `20.6.0` 版本中添加。

## 贡献

我们非常感谢你为改进 Deno
文档提供的任何帮助！对于任何小的文本更改或修复，请随时直接向此仓库的 `main` 分支
[提交拉取请求](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)。

对于较大的更改，请先
[创建一个 GitHub issue](https://github.com/denoland/deno-docs/issues)
来描述你提议的更新。在花费大量时间编写文档之前，最好先获得反馈！

随着时间的推移，我们将在拉取请求过程中添加更多的 linting
和格式化。但目前，你只需确保 `npm run build`
成功无误后再提交拉取请求。这将确保你编写的内容中没有损坏的链接或无效的 MDX
语法。

## 示例

[Deno by Example](https://docs.denohub.com/examples)
是一个小代码片段、教程和视频的集合，展示了 Deno 中实现的各种 API 功能。

### 添加示例脚本

- 示例用 TypeScript 编写
- 每个示例应为一个文件，不超过 50 行
- 每个示例应是一个独立的单元，并且不应依赖除 Deno
  内置模块和标准库之外的任何依赖项，除非严格需要第三方库。
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
case），内容应为示例的代码。文件应为 `.ts` 格式。文件应以 JSDoc
风格的多行注释开头，描述示例：

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

你应该添加一个标题、难度级别（`beginner` 或
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
之后，你可以添加示例的描述。这是可选的，但建议大多数示例都包含。描述不应超过一两行。描述会显示在示例页面的顶部，并在搜索结果中显示。

在 JS Doc
注释之后，你可以编写代码。代码可以前缀一个描述代码的注释。注释将在示例页面中与代码一起呈现。

## 特别感谢历史贡献

此仓库是使用 [Deno 手册](https://github.com/denoland/manual)
的内容创建的，该项目自 2018
年以来由数百名开发者贡献。你可以通过以下命令查看此仓库和手册中的历史贡献者列表：

```bash
git shortlog -s -n
```

## 部署

`docs.deno.com` 网站会在每次推送到 `main`
分支时更新，应通过拉取请求到此仓库进行推送。

## 许可证

MIT
