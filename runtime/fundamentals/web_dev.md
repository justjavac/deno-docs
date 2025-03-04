---
title: "Web 开发"
oldUrl:
 - /runtime/manual/getting_started/web_frameworks/
 - /runtime/fundamentals/web_frameworks/
---

Deno 提供了一个安全且对开发者友好的环境来构建 Web 应用程序，让你的 Web
开发体验更加愉快。

1. Deno 具有 [安全默认设置](/runtime/fundamentals/security/)
   ，这意味着它需要明确的权限才能访问文件、网络和环境，从而降低了安全漏洞的风险。
2. Deno 具有 [内置的 TypeScript 支持](/runtime/fundamentals/typescript/)
   ，允许你编写 TypeScript 代码而无需额外的配置或工具。
3. Deno 附带了一个 [标准库](/runtime/fundamentals/standard_library/)
   ，其中包含用于常见任务的模块，如 HTTP 服务器、文件系统操作等。

如果你正在构建一个更复杂的应用程序，你很可能会通过一个 Web 框架与 Deno
进行交互。

## React/Next

[React](https://reactjs.org/) 是一个流行的 JavaScript 库，用于构建用户界面。要在
Deno 中使用 React，你可以使用流行的 Web 框架 [Next.js](https://nextjs.org/)。

要在 Deno 中开始使用 Next.js，你可以创建一个新的 Next 应用程序并立即使用 Deno
运行它：

```sh
deno run -A npm:create-next-app@latest my-next-app
cd my-next-app
deno task dev
```

这将创建一个带有 TypeScript 的新 Next.js 应用程序，并使用 Deno
运行它。然后你可以打开浏览器访问 `http://localhost:3000`
查看你的新应用程序，并开始编辑 `page.tsx` 以实时查看你的更改。

要更好地理解 JSX 和 Deno 在底层的交互方式，请继续阅读
[这里](/runtime/reference/jsx/) 。

## Fresh

[Fresh](https://fresh.deno.dev/) 是 Deno 中最流行的 Web
框架。它使用了一种默认情况下不向客户端发送 JavaScript 的模型。

要开始使用 Fresh 应用程序，你可以使用以下命令并按照 CLI 提示创建你的应用程序：

```sh
deno run -A -r https://fresh.deno.dev
cd my-fresh-app
deno task start
```

这将创建一个新的 Fresh 应用程序，并使用 Deno 运行它。然后你可以打开浏览器访问
`http://localhost:8000` 查看你的新应用程序。编辑 `/routes/index.tsx`
以实时查看你的更改。

Fresh 在服务器上完成了大部分的渲染工作，客户端只负责重新渲染小的
[交互性岛屿](https://jasonformat.com/islands-architecture/)
。这意味着开发者需要明确选择为特定组件启用客户端渲染。

## Astro

[Astro](https://astro.build/)
是一个静态站点生成器，允许开发者创建快速且轻量级的网站。

要开始使用 Astro，你可以使用以下命令创建一个新的 Astro 站点：

```sh
deno run -A npm:create-astro my-astro-site
cd my-astro-site
deno task dev
```

这将创建一个新的 Astro 站点，并使用 Deno 运行它。然后你可以打开浏览器访问
`http://localhost:4321` 查看你的新站点。编辑 `/src/pages/index.astro`
以实时查看你的更改。

## Vite

[Vite](https://vitejs.dev/) 是一个 Web 开发构建工具，它通过原生 ES
模块提供代码，这些模块可以直接在浏览器中运行。Vite 是使用 Deno 构建现代 Web
应用程序的绝佳选择。

要开始使用 Vite，你可以使用以下命令创建一个新的 Vite 应用程序：

```sh
deno run -A npm:create-vite@latest
cd my-vite-app
deno install
deno task dev
```

## Lume

[Lume](https://lume.land/) 是一个受 Jekyll 或 Eleventy 等静态站点生成器启发的
Deno 静态站点生成器。

要开始使用 Lume，你可以使用以下命令创建一个新的 Lume 站点：

```sh
mkdir my-lume-site
cd my-lume-site
deno run -A https://lume.land/init.ts
deno task serve
```

## Docusaurus

[Docusaurus](https://docusaurus.io/)
是一个针对技术文档网站优化的静态站点生成器。

要开始使用 Docusaurus，你可以使用以下命令创建一个新的 Docusaurus 站点：

```sh
deno run -A npm:create-docusaurus@latest my-website classic
cd my-website
deno task start
```

## Hono

[Hono](https://hono.dev) 是一个轻量级的 Web 应用程序框架，继承了 Express 和
Sinatra 的传统。

要开始使用 Hono，你可以使用以下命令创建一个新的 Hono 应用程序：

```sh
deno run -A npm:create-hono@latest
cd my-hono-app
deno task start
```

这将创建一个新的 Hono 应用程序，并使用 Deno 运行它。然后你可以打开浏览器访问
`http://localhost:8000` 查看你的新应用程序。

## Oak

[Oak](https://jsr.io/@oak/oak) 是一个用于处理 HTTP 的 Deno 中间件框架。Oak
是你的前端应用程序与潜在数据库或其他数据源（例如 REST API、GraphQL
API）之间的粘合剂。

Oak 提供了比原生 Deno HTTP 服务器更多的功能，包括基本的路由器、JSON
解析器、中间件、插件等。

要开始使用 Oak，创建一个名为 `server.ts` 的文件并添加以下内容：

```ts
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello oak!</title><head>
      <body>
        <h1>Hello oak!</h1>
      </body>
    </html>
  `;
});

const app = new Application();
const port = 8080;

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server running on http://localhost:${port}`);

app.listen({ port: port });
```

使用以下命令运行服务器：

```sh
deno run --allow-net server.ts
```

## Node 项目

Deno 可以直接运行你的 Node.js 项目。查看我们的指南，了解如何
[将你的 Node.js 项目迁移到 Deno](/runtime/fundamentals/node/#migrating-from-node.js-to-deno)
。
