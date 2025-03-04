---
title: Subhosting 资源
oldUrl:
  - /deploy/api/rest/
---

要使用 Deno Deploy 构建
Subhosting，了解系统中的一些关键资源会有所帮助。这些资源也在
[REST API](../api/index.md) 中有所体现。

![Subhosting 资源概览](./images/subhosting-org-structure.svg)

## 组织

[**组织**](https://apidocs.deno.com/#get-/organizations/-organizationId-) 是与
Subhosting 实现相关的所有数据的容器。您的组织将有一个名称和一个
ID。每个组织都有一个分析端点，可用于获取整个组织的指标（例如请求数和使用的带宽）。

可以邀请其他 Deploy 用户协作组织，并且
[访问令牌](https://dash.deno.com/account#access-tokens)
可以让具有组织访问权限的开发人员通过 API 修改组织内的资源。可以在
[Deploy 仪表板](https://dash.deno.com/orgs/new) 中创建新组织。

## 项目

[**项目**](https://apidocs.deno.com/#get-/organizations/-organizationId-/projects)
充当部署的组织容器。一个项目包含其部署以及这些部署的分析和使用信息。

项目是免费的，可以根据需要设置。

为了跟踪单个用户的使用情况以进行计费，有一个 API
端点可以报告每个项目的分析（带宽使用情况、请求数等），粒度为一刻钟。

> 所有部署（无论是在同一项目内还是不同项目之间）默认不共享任何内容。项目是组织部署的一种方式，不会产生任何费用。但是，分析是按项目报告的，如果您有多个租户，我们建议为每个租户设置一个项目。特别是如果您希望向用户收取使用费用。

## 部署

[**部署**](https://apidocs.deno.com/#get-/projects/-projectId-/deployments)：部署是一组配置、可运行代码和支持的静态文件，可以在
Deno Deploy 的隔离环境中运行。部署有一个可以启动服务器的入口文件，可以有一个
[Deno KV](/deploy/kv/manual) 数据库与之关联，并且可以设置为在自定义域上运行。

部署是一个不可变的对象，由以下内容组成：

- 要运行的源代码
- 静态资源
- 环境变量
- 数据库绑定
- 其他设置

我们提供了用于查询或流式传输构建日志以及查询或流式传输执行日志的端点。

如果您需要阻止或取消阻止部署，可以通过删除需要阻止的部署或取消分配其域来实现。这将使部署无法访问。

Subhosting
系统的构建方式使得一个部署的行为或负载不会影响其他部署。这也适用于同一组织内的不同部署。容量会根据需求自动扩展。如果您想限制特定部署或应用程序的资源，可以使用分析
API
为您提供详细指标（请求数、带宽等），粒度达到项目级别。您可以使用此信息来决定是否关闭部署并使其无法访问。

> 注意：**部署是不可变的**，但是，您可以创建一个新部署，然后将其域重新映射到新部署。重新部署端点可以从现有部署创建一个具有不同设置的新部署。

## 自定义域

[**自定义域**](https://apidocs.deno.com/#get-/organizations/-organizationId-/domains)
可以动态映射到部署，为它们提供唯一的 URL（例如 `mycompany.com`）。

在使用域之前，您需要
[验证所有权并配置或上传 TLS 证书](https://github.com/denoland/deploy-api/blob/main/samples.ipynb)。

如果您使用的是
[Builder 层级](https://deno.com/deploy/pricing?subhosting)，则可以使用通配符域。一旦您注册了通配符域，您可以通过两种方式使用它：

- 将所有 `*.mycompany.com` 的请求发送到特定部署
- （即将推出）将不同的子域（例如 `foo.mycompany.com` 和
  `bar.mycompany.com`）分配给单独的部署。

### 暂存与生产环境

Deno Deploy 终端用户平台会在开发人员打开 GitHub
拉取请求时自动创建预览部署，并且对“主”分支的提交会自动转换为生产部署。尽管
Subhosting 默认不提供 GitHub
集成，但它拥有您定义自己的预览和生产部署语义所需的所有原语。

## 连接 KV 数据库

(KV) 数据库存储键值对。您可以在创建部署时使数据库可供部署访问。KV
数据库可以同时被多个部署使用。

要在 Subhosting 中使用 KV：

- [使用 API 创建数据库](https://docs.denohub.com/deploy/kv/manual)
- 使用 Subhosting API 创建部署时，指定您创建的数据库。

> 注意：Deno Cron 和 Queues 目前不适用于 Subhosting。

## OpenAPI 规范和工具

Deploy API 的 [OpenAPI 规范](https://www.openapis.org/) 可以在这里找到：

```console
https://api.deno.com/v1/openapi.json
```

此规范文档可以与 [大量 OpenAPI 兼容工具](https://openapi.tools/)
一起使用。除了此处维护的 REST API 文档外，您还可以找到自动生成的 API
文档（包括基于浏览器的测试工具）[这里](https://apidocs.deno.com/)。
