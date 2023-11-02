# 代理

Deno 支持模块下载和 Web 标准 `fetch` API 的代理。

代理配置从环境变量中读取：`HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY`。

在 Windows 情况下，如果未找到环境变量，Deno 会回退到从注册表中读取代理。
