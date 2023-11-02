# 反向代理中间件

这个快速入门将介绍如何部署一个小型中间件，用于反向代理另一个服务器（在本例中是
example.com）。有关常见中间件功能的其他示例，请参阅
[示例库](https://www.deno.com/deploy/examples)。

## **步骤 1：** 在 Deno Deploy 上创建一个新的 Playground 项目

前往 https://dash.deno.com/new 并单击 **Playground** 卡中的 **Play** 按钮。

## **步骤 2：** 通过 Playground 部署中间件代码

在下一个页面中，将下面的代码复制并粘贴到编辑器中。这是一个将所有请求代理到
https://example.com 的 HTTP 服务器。

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/mod.ts";
async function reqHandler(req: Request) {
  const reqPath = new URL(req.url).pathname;
  return await fetch("https://example.com" + reqPath, { headers: req.headers });
}
serve(reqHandler, { port: 8000 });
```

单击 **保存并部署**。

你应该会看到类似这样的内容：

![图像](../docs-images/proxy_to_example.png)
