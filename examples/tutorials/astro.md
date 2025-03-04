---
title: "使用 Deno 构建 Astro"
url: /examples/astro_tutorial/
---

[Astro](https://astro.build/) 是一个专注于内容为中心的现代 Web
框架，它利用岛屿架构，默认情况下不向客户端发送任何 JavaScript。随着最近
[Deno 2](https://deno.com/2) 的发布，现在
[与 Node 和 npm 向后兼容](https://deno.com/blog/v2.0#backwards-compatible-forward-thinking)，使用
Astro 和 Deno 的体验得到了提升。

我们将介绍如何使用 Deno 构建一个简单的 Astro 项目：

- [搭建 Astro 项目](#scaffold-an-astro-project)
- [更新首页](#update-index-page-to-list-all-dinosaurs)
- [添加动态 SSR 页面](#add-a-dynamic-ssr-page)
- [下一步是什么？](#whats-next)

你可以直接跳转到
[源代码](https://github.com/denoland/examples/tree/main/with-astro)
或继续阅读以下内容！

## 搭建 Astro 项目

Astro 提供了一个 CLI 工具来快速搭建一个新的 Astro 项目。在终端中运行命令
`deno init --npm astro@latest`，使用 Deno 创建一个新的 Astro
项目。在本教程中，我们将选择“Empty”模板，以便从头开始，并跳过安装依赖项，稍后我们可以使用
Deno 安装它们：

```jsx
deno -A npm:create-astro@latest

 astro   启动序列已启动。

   dir   我们应该在哪里创建你的新项目？
         ./dino-app

  tmpl   你希望如何开始你的新项目？
         Empty

    ts   你计划编写 TypeScript 吗？
         Yes

   use   TypeScript 应该有多严格？
         Strict

  deps   安装依赖项吗？
         No
      ◼  没问题！
         记得在设置后安装依赖项。

   git   初始化一个新的 git 仓库吗？
         Yes

      ✔  项目已初始化！
         ■ 模板已复制
         ■ TypeScript 已定制
         ■ Git 已初始化

  next   发射确认。探索你的项目！

 使用 cd ./dino-app 进入你的项目目录
 运行 npm run dev 启动开发服务器。按 CTRL+C 停止。
 使用 astro add 添加框架，如 react 或 tailwind。

 遇到问题？加入我们 https://astro.build/chat

╭─────╮  Houston:
│ ◠ ◡ ◠  祝你好运，宇航员！ 🚀
╰──🍫─╯
```

从 Deno 2
开始，[Deno 还可以使用新的 `deno install` 命令安装包](https://deno.com/blog/v2.0#deno-is-now-a-package-manager-with-deno-install)。因此，让我们运行
[`deno install`](https://docs.denohub.com/runtime/reference/cli/install/) 并带上
`--allow-scripts` 标志，以执行任何 npm 生命周期脚本：

```bash
deno install --allow-scripts
```

要查看我们有哪些命令，让我们运行 `deno task`：

```bash
deno task
可用任务：
- dev (package.json)
    astro dev
- start (package.json)
    astro dev
- build (package.json)
    astro check && astro build
- preview (package.json)
    astro preview
- astro (package.json)
    astro
```

我们可以使用 `deno task dev` 启动 Astro 服务器：

![让 Astro 应用运行起来](./images/how-to/astro/hello-astro.png)

## 更新首页以列出所有恐龙

我们的应用将展示各种恐龙的相关信息。首先要创建的页面是首页，它将列出我们“数据库”中所有恐龙的链接。

首先，让我们创建应用中要使用的数据。在本例中，我们将数据硬编码在一个 json
文件中，但在实践中你可以使用任何数据存储。我们将在项目根目录下创建一个 `data`
文件夹，然后创建一个 `dinosaurs.json` 文件，并将
[此文本](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json)
放入其中。

> ⚠️️ 在本教程中，我们硬编码了数据。但你可以连接到
> [各种数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
> 并使用
> [像 Prisma 这样的 ORM](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/prisma/)
> 与 Deno。

一旦我们有了数据，让我们创建一个列出所有恐龙的首页。在 `./src/pages/index.astro`
页面中，编写以下内容：

```jsx
---
import data from "../../data/dinosaurs.json";
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Dinosaurs</title>
	</head>
	<body>
		<h1>Dinosaurs</h1>
		<ul>
			{data.map((dinosaur) => (
				<li>
					<a href={`/${dinosaur.name.toLowerCase()}`}>{ dinosaur.name }</a>
				</li>
			))}
		</ul>
	</body>
</html>
```

让我们使用 `deno task dev` 启动服务器，并将浏览器指向 `localhost:4321`：

![列出所有恐龙的首页](./images/how-to/astro/index-page.webp)

太棒了！但当你点击某个恐龙时，会出现 404 错误。让我们来解决这个问题。

## 添加动态 SSR 页面

我们的应用将展示各种恐龙的相关信息。为了实现这一点，我们将创建一个动态服务器端渲染（“SSR”）页面，它
[为最终用户提供更好的性能，同时提高页面的 SEO](https://deno.com/blog/the-future-and-past-is-server-side-rendering)。

接下来，让我们在 `/src/pages/` 下创建一个名为 `[dinosaur].astro`
的新文件。在文件顶部，我们将添加一些逻辑，从硬编码的数据源中提取数据，并根据 URL
路径中的 `dinosaur` 参数进行过滤。在底部，我们将渲染数据。你的文件应该如下所示：

```jsx
---
import data from "../../data/dinosaurs.json";
const { dinosaur } = Astro.params;
const dinosaurObj = data.find((item) => item.name.toLowerCase() === dinosaur);
if (!dinosaurObj) return Astro.redirect("/404");
const { name, description } = dinosaurObj;
---

<h1>{ name }</h1>

<p>
    { description }
</p>
```

> ⚠️️
> [Deno 语言服务器](https://docs.denohub.com/runtime/reference/lsp_integration/)
> 目前不支持 `.astro`
> 文件，因此你可能会看到错误的红色波浪线。我们正在努力改善这一体验。

让我们使用 `deno task dev` 运行它，并将浏览器指向
`localhost:4321/abrictosaurus`：

![为 abrictosaurus 渲染的动态页面](./images/how-to/astro/dynamic-page.webp)

它起作用了！

## 下一步是什么

我们希望本教程能让你对如何使用 Astro 和 Deno
进行构建有一个良好的了解。你可以了解更多关于 Astro 和
[他们构建网站的渐进式方法](https://docs.astro.build/en/getting-started/)。如果你有兴趣替换我们的硬编码数据存储，这里有一些关于
[使用 Deno 连接数据库](https://docs.denohub.com/runtime/tutorials/connecting_to_databases/)
的资源，包括
[Planetscale](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/planetscale/)、[Redis](https://docs.denohub.com/runtime/tutorials/how_to_with_npm/redis/)
等。或者你可以学习如何
[将你的 Astro 项目部署到 Deno Deploy](https://deno.com/blog/astro-on-deno)，或按照这些指南在
[AWS](https://docs.denohub.com/runtime/tutorials/aws_lightsail/)、[Digital Ocean](https://docs.denohub.com/runtime/tutorials/digital_ocean/)
和
[Google Cloud Run](https://docs.denohub.com/runtime/tutorials/google_cloud_run/)
上自托管 Deno。
