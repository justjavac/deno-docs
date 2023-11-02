---
pagination_next: manual/basics/permissions
---

# Web 框架

如果您正在构建一个更复杂的应用程序，您很可能会通过一个 web 框架与 Deno
进行交互。Deno 支持两种类型的 web 框架：

- **Node.js 本地框架/工具/库。** 例如 esbuild 等一些最流行的工具明确支持 Node.js
  和 Deno。这里的缺点是您可能无法获得最佳体验或性能。
- **Deno 本地框架/工具/库。** 我们将在下面介绍其中一些。

## Deno 本地框架

### Fresh

[Fresh](https://fresh.deno.dev/) 是 Deno 最受欢迎的 web
框架。它使用一种模型，其中默认情况下不会将 JavaScript
发送到客户端。大多数渲染是在服务器上完成，客户端只负责重新渲染小的[交互区域](https://jasonformat.com/islands-architecture/)。这意味着开发人员明确选择为特定组件启用客户端渲染。

### Aleph

[Aleph.js](https://alephjs.org/docs/get-started) 是 Deno 的第二受欢迎的 web
框架。它为您提供了与 Create-React-App 一样快速启动的方式。与 Next.js 一样，Aleph
提供了开箱即用的 SSR 和 SSG，以便开发人员创建 SEO 友好的应用程序。此外，Aleph
提供了一些其他内置功能，这些功能在 Next.js 中并非默认提供，例如：

- 热模块替换（使用 React Fast Refresh）
- ESM 导入语法（无需 webpack）
- TypeScript 准备

### Ultra

[Ultra](https://ultrajs.dev/) 是 Deno 的现代流媒体 React 框架，是 Aleph
的另一种选择。这是一种使用 React 构建动态媒体丰富网站的方式，类似于 Next.js。

Deno 本身支持 JSX 和 TypeScript（因此 Ultra
也支持），但它们在浏览器中不起作用。Ultra 接管了将 JSX 和 TypeScript 转译为常规
JavaScript 的任务。

Ultra 的其他亮点包括：

- 使用 Deno 编写。
- 由导入映射支持。
- 100％ 的 esm。
- 在开发和生产中都使用导入映射，大大简化了工具链 - 您不必处理大量捆绑和转译。
- 生产中的源代码与其编写方式相似。
- 导入，导出在生产中与开发中的操作方式相同。

### Lume

[Lume](https://lume.land/) 是 Deno
的静态站点生成器，灵感来自其他静态站点生成器，如 Jekyll 或
Eleventy。它简单易用，配置灵活。亮点包括：

- 支持多种文件格式，如 Markdown、YAML、JavaScript、TypeScript、JSX、Nunjucks。
- 您可以连接任何处理器来转换资产，例如为 CSS 使用 sass 或 postcss。
- 无需在 `node_modules` 中安装成千上万的包或复杂的捆绑器。

### Oak

[Oak](https://deno.land/x/oak) 是 Deno 的 web 应用程序框架，类似于 Node.js 中的
Express。

作为中间件框架，Oak是连接前端应用程序和潜在数据库或其他数据源（例如 REST
API、GraphQL
API）的纽带。只是为了给您一个概念，以下是构建客户端-服务器架构的常见技术栈列表：

- React.js（前端）+ Oak（后端）+ PostgreSQL（数据库）
- Vue.js（前端）+ Oak（后端）+ MongoDB（数据库）
- Angular.js（前端）+ Oak（后端）+ Neo4j（数据库）

Oak 提供了比原生 Deno HTTP 服务器更多的功能，包括基本路由器、JSON
解析器、中间件、插件等。
