# 简单的 HTTP 服务器

在这个教程中，让我们构建一个 HTTP 服务器，它会响应所有传入的 HTTP 请求，并返回
`Hello World` 和 `200 OK` 的 HTTP 状态。我们将使用 Deno Deploy playground
来部署和编辑这个脚本。

## **步骤 1：编写 HTTP 服务器脚本

在我们开始编写实际脚本之前，让我们了解一些基础知识：Deno Deploy 允许您使用与
Deno CLI 相同的 [服务器端 HTTP API][native-http] 来监听传入的 HTTP
请求。不过，这个 API 相当底层，所以我们不会直接使用这个 API，而是使用由
[`std/http`][std-http] 提供的高级 HTTP API。

这个 API 围绕着 [`serve`](https://deno.land/std/http/server.ts) 函数展开。

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

serve((_req) => {/* .. */});
```

> 注意：我们监听的端口号并不重要，因为 Deno Deploy
> 将自动将来自外部世界的请求路由到我们监听的任何端口上。

处理程序函数接受两个参数：一个 [`Request`][request] 对象和一个
[`ConnInfo`][conninfo] 对象。`Request` 对象包含请求数据，`ConnInfo`
对象包含关于底层连接的信息，例如原始 IP 地址。您必须从处理程序函数返回一个
[`Response`][response] 对象。

让我们使用这些信息来完成我们的 Hello World 脚本：

```js
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

serve((_req) => {
  return new Response("Hello World!", {
    headers: { "content-type": "text/plain" },
  });
});
```

## **步骤 2：将脚本部署到 Deno Deploy

1. 通过访问 https://dash.deno.com/new 创建一个新的 playground 项目，并在
   **Playground** 卡片下点击 **Play** 按钮。
2. 在下一个屏幕上，将上面的代码复制到屏幕左侧的编辑器中。
3. 在顶部工具栏右侧单击 **Save & Deploy** 按钮（或按 <kbd> Ctrl </kbd>+<kbd> S
   </kbd>）。

您可以在 playground 编辑器的右侧，在预览窗格中预览结果。

您会发现，如果您更改脚本（例如 `Hello, World!`->
`Hello, Galaxy!`），然后重新部署，预览将自动更新。预览窗格顶部显示的 URL
可用于从任何地方访问部署的页面。

即使在 playground
编辑器中，脚本也会在我们整个全球网络范围内部署。这保证了快速和可靠的性能，无论您的用户身在何处。

[native-http]: https://deno.land/manual@v1.15.1/runtime/http_server_apis
[std-http]: https://deno.land/std/http
[request]: ../api/runtime-request
[conninfo]: https://doc.deno.land/https/deno.land%2Fstd%2Fhttp%2Fserver.ts#ConnInfo
[response]: ../api/runtime-response
