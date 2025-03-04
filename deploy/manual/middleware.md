---
title: "反向代理中间件"
---

本快速入门将介绍如何部署一小段中间件，该中间件反向代理另一台服务器（在本例中为
example.com）。有关常见中间件功能的更多示例，请参阅
[示例库](../tutorials/index.md)。

## **步骤 1:** 在 Deno Deploy 上创建一个新的 playground 项目

导航到 https://dash.deno.com/projects 并点击“New Playground”按钮。

## **步骤 2:** 通过 playground 部署中间件代码

在下一页中，将以下代码复制并粘贴到编辑器中。这是一个 HTTP
服务器，它将所有请求代理到 https://example.com。

```ts
async function reqHandler(req: Request) {
  const reqPath = new URL(req.url).pathname;
  return await fetch("https://example.com" + reqPath, { headers: req.headers });
}

Deno.serve(reqHandler);
```

点击 **保存并部署**。

您应该会看到类似以下内容：

![图片](../docs-images/proxy_to_example.png)
