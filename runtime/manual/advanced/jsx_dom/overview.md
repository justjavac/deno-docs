# Deno 中 JSX 和 DOM 的概述

Deno 的一个常见用例之一是作为 Web 应用程序的一部分处理工作负载。因为 Deno
内置了许多浏览器 API，所以能够创建可在 Deno
和浏览器中都运行的同构代码具有很强的能力。Deno
可以处理的强大工作负载之一是执行“服务器端渲染”（SSR），其中应用程序状态用于在服务器端动态渲染
HTML 和 CSS，然后提供给客户端。

有效使用服务器端渲染可以通过将动态内容的繁重计算卸载到服务器进程来显着提高 Web
应用程序的性能，从而使应用程序开发人员能够最小化需要传输到浏览器的 JavaScript
和应用程序状态。

Web 应用程序通常由以下三种关键技术组成：

- JavaScript
- HTML
- CSS

以及越来越多地，Web Assembly 可能在 Web 应用程序中发挥作用。

这些技术结合在一起，允许开发人员在浏览器中使用 Web 平台构建应用程序。虽然 Deno
支持许多 Web 平台 API，但它通常仅支持在服务器端上下文中可用的 Web
API，在客户端/浏览器上下文中，主要的“显示”API 是文档对象模型（DOM）。有一些 API
可通过 JavaScript 访问，用于操作 DOM 以提供所需的结果，还有 HTML 和 CSS
用于构建和样式化 Web 应用程序的“显示”。

为了便于在服务器端操作 DOM 并动态生成 HTML 和 CSS，可以使用一些关键技术和库与
Deno 一起实现这一目标，我们将在本章中探讨这些技术。

我们将探讨相对低级别的启用库和技术，而不是用于生成网站的服务器端解决方案或框架。

## JSX

由 Facebook 的 React 团队创建，JSX 是一种流行的 DSL（特定领域语言），用于在
JavaScript 中嵌入类似 HTML 的语法。TypeScript 团队还将对 JSX 语法的支持添加到
TypeScript 中。JSX
已经成为开发人员的流行选择，因为它允许将命令式编程逻辑与看起来很像 HTML
的声明性语法混合在一起。

JSX“组件”可能看起来像这样的示例：

```jsx
export function Greeting({ name }) {
  return (
    <div>
      <h1>Hello {name}!</h1>
    </div>
  );
}
```

JSX 的主要挑战在于它既不是 JavaScript 也不是 HTML。它需要转译为纯 JavaScript
才能在浏览器中使用，然后浏览器必须处理该逻辑以操作
DOM。这可能不如让浏览器呈现静态 HTML 高效。

这就是 Deno 可以发挥作用的地方。Deno 支持 `.jsx` 和 `.tsx` 模块中的 JSX，结合
JSX 运行时，Deno 可以用于动态生成
HTML，然后发送给浏览器客户端，而无需将未经转译的源文件或 JSX
运行时库传输到浏览器。

阅读 [在 Deno 中配置 JSX](./jsx.md) 部分以获取有关如何自定义 Deno 中的 JSX
配置的信息。

## 文档对象模型（DOM）

DOM 是浏览器中提供用户界面的主要方式，它公开了一组 API，允许通过 JavaScript
进行操作，同时还允许直接使用 HTML 和 CSS。

虽然 Deno 具有许多 Web 平台 API，但它不支持与可视表示相关的大多数 DOM
API。尽管如此，仍然有一些库提供了大部分在 Web 浏览器中运行的代码所需的
API，以便在 Deno 下运行，以生成可以“预渲染”并发送到浏览器的 HTML 和
CSS。我们将在以下部分进行介绍：

- [在 Deno 中使用 LinkeDOM](./linkedom.md)
- [在 Deno 中使用 deno-dom](./deno_dom.md)
- [在 Deno 中使用 jsdom](./jsdom.md)

## CSS

层叠样式表（CSS）为 DOM 中的 HTML 提供样式。有一些工具使在服务器端上下文中使用
CSS 更容易和强大。

- [解析和字符串化 CSS](./css.md)
- [在 Deno 中使用 Twind](./twind.md)
