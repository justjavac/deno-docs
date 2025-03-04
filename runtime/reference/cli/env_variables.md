---
title: "配置 Deno 行为"
---

有几个环境变量可以影响 Deno 的行为：

### DENO_AUTH_TOKENS

授权令牌列表，可用于允许 Deno
访问远程私有代码。有关更多详细信息，请参阅[私有模块和仓库](/runtime/reference/private_repositories)部分。

### DENO_TLS_CA_STORE

建立 TLS 连接时将使用的证书存储列表。可用的存储为 `mozilla` 和
`system`。您可以指定一个、两个或不指定。证书链将按照您指定的顺序尝试解析。默认值为
`mozilla`。`mozilla` 存储将使用由
[`webpki-roots`](https://crates.io/crates/webpki-roots) 提供的捆绑 Mozilla
证书。`system`
存储将使用您平台的[本地证书存储](https://crates.io/crates/rustls-native-certs)。确切的
Mozilla 证书集将取决于您使用的 Deno
版本。如果您未指定任何证书存储，则不会信任任何 TLS 连接，除非同时指定
`DENO_CERT` 或 `--cert` 或为每个 TLS 连接指定特定证书。

### DENO_CERT

从 PEM 编码的文件加载证书颁发机构。这将“覆盖” `--cert`
选项。有关更多信息，请参阅[代理](#proxies)部分。

### DENO_DIR

这将设置 CLI
缓存信息的存储目录。这包括缓存远程模块、缓存转译模块、语言服务器缓存信息和本地存储的持久化数据。默认情况下，这将使用操作系统的默认缓存位置，然后在
`deno` 路径下。

### DENO_INSTALL_ROOT

使用 `deno install` 时，安装脚本的存储位置。默认值为 `$HOME/.deno/bin`。

### DENO_NO_PACKAGE_JSON

设置为禁用自动解析 package.json 文件。

### DENO_NO_PROMPT

设置为禁用访问时的权限提示（替代在调用时传递 `--no-prompt`）。

### DENO_NO_UPDATE_CHECK

设置为禁用检查是否有更新的 Deno 版本。

### DENO_WEBGPU_TRACE

用于 WebGPU 跟踪的目录。

### HTTP_PROXY

用于 HTTP 请求的代理地址。有关更多信息，请参阅[代理](#proxies)部分。

### HTTPS_PROXY

用于 HTTPS 请求的代理地址。有关更多信息，请参阅[代理](#proxies)部分。

### NO_COLOR

如果设置，这将阻止 Deno CLI 在写入 stdout 和 stderr 时发送 ANSI 颜色代码。有关此
_事实_ 标准的更多信息，请参阅网站
[https://no-color.org](https://no-color.org/)。此标志的值可以在运行时通过检查
`Deno.noColor` 的值来访问，而无需读取环境变量的权限。

### NO_PROXY

指示应绕过其他环境变量中设置的代理的主机。有关更多信息，请参阅[代理](#proxies)部分。

### NPM_CONFIG_REGISTRY

通过 [npm 说明符](/runtime/fundamentals/node/#using-npm-packages)
加载模块时要使用的 npm 注册表。

## 代理

Deno
能够通过代理服务器处理网络请求，这对于安全、缓存或访问防火墙后的资源等各种原因非常有用。运行时支持模块下载和
Web 标准 `fetch` API 的代理。

Deno 从环境变量中读取代理配置：`HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY`。

在 Windows 上，如果未找到环境变量，Deno 会回退到从注册表中读取代理。
