---
title: "定价与限制"
---

请参阅 [我们的定价页面](https://deno.com/deploy/pricing)
以了解所有计划中可用功能的概述。如果您有超出这些限制的用例，[请联系我们](mailto:deploy@deno.com)。

在 Deno Deploy 的初始公开测试期间，不提供正常运行时间保证。服务的访问将受
[我们的可接受使用政策](/deploy/manual/acceptable-use-policy)
控制。任何我们认为违反此政策的用户，其账户可能会被终止。

## 部署的最大大小

在上传资源到部署时，部署中所有文件（源文件和静态文件）的总大小 **不应超过
1GB**。

## 内存分配

应用程序的最大内存分配为 512MB

## TLS 代理

对于到端口 443（用于 HTTPS 的端口）的出站连接，需要 TLS 终止。使用
[Deno.connect](https://docs.denohub.com/api/deno/~/Deno.connect)
连接到这些端口是被禁止的。如果您需要建立到端口 443 的 TLS 连接，请使用
[Deno.connectTls](https://docs.denohub.com/api/deno/~/Deno.connectTls)
代替。`fetch` 不受此限制的影响。

此限制的存在是因为在没有终止 TLS 的情况下连接到端口 443 通常用于 TLS-over-TLS
代理，而根据 [我们的可接受使用政策](/deploy/manual/acceptable-use-policy)，这在
Deno Deploy 上是禁止的。
