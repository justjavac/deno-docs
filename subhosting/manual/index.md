---
title: 关于 Subhosting
oldUrl:
  - /subhosting/
  - /deploy/manual/subhosting/
---

Deno Subhosting
是一个强大的平台，旨在允许软件即服务（SaaS）提供商安全地运行其客户编写的代码。Subhosting
API 允许您以编程方式大规模部署不受信任的代码。

## 主要特性

- **易于使用：** 开发者可以使用通用的 JavaScript 或 TypeScript
  编写代码，而无需具备特定的 Deno 知识。
- **符合标准：** Deno 支持标准的 JavaScript 和 TypeScript，并集成了广泛使用的
  Web API，如 `fetch` 和 `web cache`。
- **Deno 特有的高级功能：** 提供诸如
  `KV`（键值存储）等高级功能，这些功能超出了典型浏览器的能力范围。
- **快速部署：** Deno
  的云产品旨在支持极短的部署时间，从简单应用程序的不到一秒，到具有众多依赖项的复杂网站的大约十秒。
- **改进的开发者体验：** Subhosting
  将为您管理在公共云中运行不受信任代码所需的大量安全基础设施设置工作。

## Deno 云产品概述 - Deno Deploy 和 Deno Subhosting

Deno 提供两种不同的云产品，Deno Deploy 和 Deno
Subhosting，每种产品都旨在支持特定的用例，同时利用相同的基础设施。

### Deno Deploy

Deno Deploy
针对专注于开发和迭代有限数量的第一方项目的个人开发者和小团队进行了优化。此解决方案非常适合托管网站或应用程序，部署过程通常通过
GitHub 集成进行管理。

- 目标受众：个人开发者和小型开发团队。
- 部署集成：主要通过 GitHub 进行持续集成和交付。
- 用例：托管网站和应用程序。

### Deno Subhosting

相比之下，Deno Subhosting 旨在安全地管理更大数量的项目和部署。它支持通过 API
部署不受信任的代码或函数，适用于涉及多个最终用户贡献代码的场景。

- 目标受众：需要安全托管客户生成的不受信任代码的 SaaS 平台。
- 部署机制：通过为可扩展性和安全性设计的强大 API。
- 用例：最终用户贡献代码的大规模项目托管。

实施 Subhosting 的步骤大致如下：

1. [创建一个组织](./quick_start.md) 并获取 REST API 的访问令牌
1. [创建一个项目](./planning_your_implementation.md)，然后为该项目创建第一个部署

使用这些技术，您可以将用户代码打包为“部署”，并在 Deno 提供的 URL 或您自己配置的
[自定义 URL](../api/#custom-domains) 上执行该代码。

## REST API 参考和 OpenAPI 规范

有关用于实现 Subhosting 的 REST API 的完整参考，您可以
[在此查看文档](https://apidocs.deno.com)。Deno Deploy REST API 还提供了
[OpenAPI 规范](https://api.deno.com/v1/openapi.json)，该规范可与
[许多 OpenAPI 兼容工具](https://openapi.tools/) 一起使用。

我们还提供
[JavaScript](https://www.npmjs.com/package/subhosting)、[Python](https://pypi.org/project/subhosting/0.0.1a0/)
和 [Go](https://github.com/denoland/subhosting-go) 的 SDK。
