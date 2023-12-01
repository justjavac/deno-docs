# 反向代理中间件

这个快速入门将介绍如何部署一个小型中间件，它将反向代理另一个服务器（在本例中是example.com）。有关常见中间件功能的其他示例，请参阅[示例库](../tutorials/index.md)。

## **步骤 1：** 在 Deno Deploy 上创建一个新的 Playground 项目

前往https://dash.deno.com/projects，并点击 “New Playground” 按钮。

## **步骤 2：** 通过 Playground 部署中间件代码

在下一个页面中，将下面的代码复制并粘贴到编辑器中。这是一个将所有请求代理到
https://example.com 的 HTTP 服务器。

```ts
async function reqHandler(req: Request) {
  const reqPath = new URL(req.url).pathname;
  return await fetch("https://example.com" + reqPath, { headers: req.headers });
}

Deno.serve(reqHandler);
```

单击 **保存并部署**。

你应该会看到类似这样的内容：

![图像](../docs-images/proxy_to_example.png)
