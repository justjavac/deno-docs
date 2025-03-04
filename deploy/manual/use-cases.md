---
title: "Deno Deploy 使用案例"
---

目前 Deno 的一些流行使用案例包括：

- [中间件](#中间件)
- [API 服务器](#api-服务器)
- [完整网站](#完整网站)

## 中间件

中间件是指在请求到达应用服务器之前和之后执行的一些代码片段。如果你想在请求的早期快速执行一些
JavaScript 或其他代码，你将会编写中间件。通过在边缘部署你的中间件代码，Deno
Deploy 确保你的应用获得最佳性能。

一些例子包括：

- 设置 cookie
- 根据地理位置提供不同版本的网站
- 路径重写
- 重定向请求
- 在服务器返回 HTML 到用户之前动态修改 HTML

Deno Deploy 是你目前可能用于托管中间件的其他平台的一个很好的替代品，例如：

- Cloudflare Workers
- AWS Lambda@Edge
- 传统的负载均衡器如 nginx
- 自定义规则

## API 服务器

Deno 也非常适合用于 API
服务器。通过在“边缘”部署这些服务器，更接近使用它们的客户端，Deno Deploy
能够提供比传统托管平台（如 Heroku）甚至现代集中式托管服务（如
DigitalOcean）更低的延迟、更好的性能和更低的带宽成本。

## 完整网站

我们预见到一个未来，你实际上可以在边缘函数上编写整个网站。一些已经在这样做的网站例子包括：

- [博客](https://github.com/ry/tinyclouds)
- [聊天](https://github.com/denoland/showcase_chat)
- [calendly 克隆](https://github.com/denoland/meet-me)
