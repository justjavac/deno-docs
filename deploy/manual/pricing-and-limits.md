# 定价和限制

请查看 [我们的定价页面](https://www.deno.com/deploy/pricing)
以获取所有计划中可用功能的概述。如果您的使用情况超出了这些限制，请
[联系我们](mailto:deploy@deno.com)。

在 Deno Deploy
的初始公共测试版期间，我们不提供任何正常运行时间的保证。服务的访问将受到
[我们的合理使用政策](https://www.deno.com/deploy/fair-use-policy)
的控制。我们认为任何违反此政策的用户都有可能被终止其帐户。

## TLS 代理

在免费计划中，必须要求对于外部连接到端口 443（用于 HTTPS 的端口）进行 TLS
终止。使用 [Deno.connect](https://deno.land/api?s=Deno.connect)
来连接这些端口是被禁止的。如果您需要建立到端口 443 的 TLS 连接，请使用
[Deno.connectTls](https://deno.land/api?s=Deno.connectTls)。`fetch`
不受此限制影响。

这一限制是因为在 TLS-over-TLS 代理中频繁使用连接到端口 443 而不终止 TLS，而在
Deno Deploy 的免费计划中，根据我们的合理使用政策是被禁止的。

这一限制仅影响免费计划客户。专业计划客户可以使用 `Deno.connect` 和
`Deno.connectTls` 连接到端口 443。
