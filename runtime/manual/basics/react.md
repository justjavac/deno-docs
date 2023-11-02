# 使用 React

要在 Deno 中使用 React，我们建议使用以下其中一个第三方框架。

如果您想更好地了解 JSX 和 Deno 的内部接口，请在 [这里](../advanced/jsx_dom)
阅读。

注意：Fresh 和 Aleph.js 提供了一个用于开发类似 React 的网站的框架。但是，Fresh
使用了一种替代的基础技术，Preact，以提供更好、更高性能的体验。

## Fresh

[Fresh](https://fresh.deno.dev/) 是 Deno 中最流行的 React
框架。它采用了一种模式，其中默认情况下不向客户端发送任何
JavaScript。大多数渲染工作都在服务器上完成，客户端只负责重新渲染小的
[交互区域](https://jasonformat.com/islands-architecture/)。这意味着开发人员明确选择为特定组件启用客户端渲染。

## Aleph

[Aleph.js](https://alephjs.org/docs/get-started) 是 Deno 中第二流行的 React
框架。它为您提供了与 Create-React-App 类似的快速启动。与 Next.js 一样，Aleph
默认提供了服务器端渲染（SSR）和静态站点生成（SSG），以使开发人员能够创建友好于
SEO 的应用程序。此外，Aleph 还提供了一些其他内置功能，这些功能在 Next.js
中默认情况下不包括，例如：

- 热重载（使用 React 快速刷新）
- ESM 导入语法（无需使用 webpack）
- 准备好的 TypeScript
