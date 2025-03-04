---
title: "简单的 HTTP 服务器"
oldUrl:
  - /deploy/docs/tutorial-http-server/
---

在本教程中，让我们构建一个 HTTP 服务器，它会对所有传入的 HTTP 请求响应
`Hello, world!` 和 `200 OK` 的 HTTP 状态码。我们将使用 Deno Deploy 的 playground
来部署和编辑这个脚本。

## 第一步：编写 HTTP 服务器脚本

在 Deno 中，可以使用
[`Deno.serve`](https://docs.denohub.com/api/deno/~/Deno.serve)
用一行代码编写一个简单的 HTTP 服务器：

```js title="一行代码的 HTTP 服务器"
Deno.serve(() => new Response("Hello, world!"));
```

虽然这种类型的服务器对于入门很有用，但 `Deno.serve`
也支持更高级的用法（[API 参考文档](https://docs.denohub.com/api/deno/~/Deno.serve)）。下面是一个更复杂的服务器示例，它利用了其他
API 功能。

```ts title="更复杂的 Hello World 服务器"
Deno.serve({
  onListen: ({ port }) => {
    console.log("Deno 服务器正在监听 *:", port);
  },
}, (req: Request, conn: Deno.ServeHandlerInfo) => {
  // 获取有关传入请求的信息
  const method = req.method;
  const ip = conn.remoteAddr.hostname;
  console.log(`${ip} 刚刚发起了一个 HTTP ${method} 请求。`);

  // 返回一个符合 Web 标准的 Response 对象
  return new Response("Hello, world!");
});
```

## 第二步：将脚本部署到 Deno Deploy

1. 访问 [你的 Deno 仪表板](https://dash.deno.com/account/overview)，点击 **New
   Playground** 按钮，创建一个新的 playground 项目。
2. 在下一个屏幕上，将上面的代码（无论是简短的还是较长的示例）复制到屏幕左侧的编辑器中。
3. 点击顶部工具栏右侧的 **Save & Deploy** 按钮（或按
   <kbd>Ctrl</kbd>+<kbd>S</kbd>）。

你可以在 playground 编辑器右侧的预览窗格中预览结果。

你会发现，如果你更改脚本（例如将 `Hello, World!` 改为
`Hello, Galaxy!`）然后重新部署，预览将自动更新。预览窗格顶部显示的 URL
可用于从任何地方访问已部署的页面。

即使在 playground
编辑器中，脚本也会在全球范围内部署到我们的整个全球网络中。这保证了无论你的用户位于何处，都能获得快速可靠的性能。
