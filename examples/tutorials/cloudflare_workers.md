---
title: "将 Deno 部署到 Cloudflare Workers"
url: /examples/cloudflare_workers_tutorial/
oldUrl:
- /runtime/manual/advanced/deploying_deno/cloudflare_workers/
- /runtime/tutorials/cloudflare_workers/
---

Cloudflare Workers 允许你在 Cloudflare 的边缘网络上运行 JavaScript。

这是一个简短的指南，介绍如何将 Deno 函数部署到 Cloudflare Workers。

注意：你只能部署
[Module Workers](https://developers.cloudflare.com/workers/learning/migrating-to-module-workers/)，而不是
Web 服务器或应用程序。

## 设置 `denoflare`

为了将 Deno 部署到 Cloudflare，我们将使用这个社区创建的 CLI
[`denoflare`](https://denoflare.dev/)。

[安装它](https://denoflare.dev/cli/#installation)：

```shell
deno install --unstable --allow-read --allow-net --allow-env --allow-run --name denoflare --force \
https://raw.githubusercontent.com/skymethod/denoflare/v0.5.11/cli/cli.ts
```

## 创建你的函数

在一个新目录中，让我们创建一个 `main.ts` 文件，它将包含我们的 Module Worker
函数：

```ts
export default {
  fetch(request: Request): Response {
    return new Response("Hello, world!");
  },
};
```

至少，Module Worker 函数必须 `export default` 一个暴露 `fetch`
函数的对象，该函数返回一个 `Response` 对象。

你可以通过运行以下命令在本地测试：

```shell
denoflare serve main.ts
```

如果你在浏览器中访问 `localhost:8080`，你会看到响应显示：

```console
Hello, world!
```

## 配置 `.denoflare`

下一步是创建一个 `.denoflare` 配置文件。在其中，让我们添加：

```json
{
  "$schema": "https://raw.githubusercontent.com/skymethod/denoflare/v0.5.11/common/config.schema.json",
  "scripts": {
    "main": {
      "path": "/absolute/path/to/main.ts",
      "localPort": 8000
    }
  },
  "profiles": {
    "myprofile": {
      "accountId": "abcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "apiToken": "abcxxxxxxxxx_-yyyyyyyyyyyy-11-dddddddd"
    }
  }
}
```

你可以通过访问 [Cloudflare 仪表板](https://dash.cloudflare.com/)，点击
"Workers"，然后在右侧找到 "Account ID" 来获取你的 `accountId`。

你可以从
[Cloudflare API Tokens 设置](https://dash.cloudflare.com/profile/api-tokens)
生成一个 `apiToken`。当你创建 API 令牌时，请确保使用模板 "Edit Cloudflare
Workers"。

在你将两者添加到 `.denoflare` 配置后，让我们尝试将其推送到 Cloudflare：

```console
denoflare push main
```

接下来，你可以在你的 Cloudflare 账户中查看你的新函数：

![Cloudflare Workers 上的新函数](./images/how-to/cloudflare-workers/main-on-cloudflare.png)

搞定！
