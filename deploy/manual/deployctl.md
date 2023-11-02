# 在命令行上使用 deployctl

`deployctl` 是一个命令行工具（CLI），允许您与 Deno Deploy 平台进行交互。

## 安装 `deployctl`

您可以使用以下命令安装 `deployctl`：

    deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts

您还需要设置 `DENO_DEPLOY_TOKEN` 环境变量为您的个人访问令牌。您可以在
https://dash.deno.com/account#access-tokens 生成您的个人访问令牌。

## 使用

要部署本地脚本：

    deployctl deploy --project=helloworld main.ts

要部署远程脚本：

    deployctl deploy --project=helloworld https://deno.com/examples/hello.js

要部署远程脚本而不包括静态文件：

    deployctl deploy --project=helloworld --no-static https://deno.com/examples/hello.js

要在部署时忽略 node_modules 目录：

    deployctl deploy --project=helloworld --exclude=node_modules main.tsx

有关更多详细信息，请查看帮助消息（`deployctl -h`）。

## `deno` CLI 和本地开发

对于本地开发，您可以使用 `deno` CLI。要安装 `deno`，请按照
[Deno 手册](https://deno.land/manual/getting_started/installation)
中的说明操作。

安装后，您可以在本地运行您的脚本：

```shell
$ deno run --allow-net=:8000 https://deno.com/examples/hello.js
在 http://localhost:8000 上监听
```

要监视文件更改，请添加 `--watch` 标志：

```shell
$ deno run --allow-net=:8000 --watch ./main.js
在 http://localhost:8000 上监听
```

有关 Deno CLI 的更多信息，以及如何配置您的开发环境和 IDE，请访问 Deno
手册的[入门][manual-gs]部分。

[manual-gs]: https://docs.denohub.com/runtime/manual
