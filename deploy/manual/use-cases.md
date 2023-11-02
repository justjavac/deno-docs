# Deno Deploy 使用案例

目前，Deno 的一些流行用途包括：

- [中间件](#中间件)
- [API 服务器](#api-服务器)
- [完整网站](#完整网站)

## 中间件

中间件是指在请求到达应用服务器之前和之后执行的代码片段。如果您想在请求的早期非常快速地执行一些
JavaScript 或其他代码，您将编写中间件。通过在边缘部署中间件代码，Deno Deploy
确保为您的应用提供最佳性能。

一些示例包括：

- 设置 cookie
- 根据地理位置提供站点的不同版本
- 路径重写
- 重定向请求
- 在返回给用户之前从服务器返回时动态更改 HTML。

Deno Deploy 是您可能正在使用的其他平台的良好替代选择，例如：

- Cloudflare Workers
- AWS Lambda@Edge
- 传统的负载均衡器，如 nginx
- 自定义规则

## API 服务器

Deno 也非常适合用作 API
服务器。通过在更接近使用它们的客户端的“边缘”部署这些服务器，Deno Deploy
能够提供比传统托管平台（如 Heroku）甚至现代的集中式托管服务（如
DigitalOcean）更低的延迟、更好的性能和更低的带宽成本。

## 完整网站

我们预见未来您实际上可以在边缘函数上编写整个网站。已经在这样做的一些网站示例包括：

- [博客](https://github.com/ry/tinyclouds)
- [聊天](https://github.com/denoland/showcase_chat)
- [calendly 克隆](https://github.com/denoland/meet-me)
