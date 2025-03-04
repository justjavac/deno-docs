---
title: "简单的 API 服务器"
oldUrl:
  - /deploy/docs/simple-api/
---

Deno 非常适合创建简单、轻量级的 API 服务器。在本教程中，学习如何使用 Deno Deploy
创建和部署一个 API 服务器。

## 创建本地 API 服务器

在终端中，创建一个名为 `server.ts` 的文件。

```shell
touch server.ts
```

我们将使用 [Deno KV 数据库](/deploy/kv/manual) 实现一个简单的链接缩短服务。

```ts title="server.ts"
const kv = await Deno.openKv();

Deno.serve(async (request: Request) => {
  // 创建短链接
  if (request.method == "POST") {
    const body = await request.text();
    const { slug, url } = JSON.parse(body);
    const result = await kv.set(["links", slug], url);
    return new Response(JSON.stringify(result));
  }

  // 重定向短链接
  const slug = request.url.split("/").pop() || "";
  const url = (await kv.get(["links", slug])).value as string;
  if (url) {
    return Response.redirect(url, 301);
  } else {
    const m = !slug ? "请提供一个 slug。" : `Slug "${slug}" 未找到`;
    return new Response(m, { status: 404 });
  }
});
```

你可以使用以下命令在本地运行此服务器：

```shell
deno run -A --unstable-kv server.ts
```

该服务器将响应 HTTP `GET` 和 `POST` 请求。`POST` 处理器期望在请求体中接收到包含
`slug` 和 `url` 属性的 JSON 文档。`slug` 是短链接的组成部分，`url`
是你想要重定向到的完整 URL。

以下是使用 cURL 调用此 API 端点的示例：

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.denohub.com/runtime/manual","slug":"denodocs"}' \
  http://localhost:8000/
```

作为响应，服务器应发送包含 `set` 操作结果的 KV 数据的 JSON：

```json
{ "ok": true, "versionstamp": "00000000000000060000" }
```

向服务器发送 `GET` 请求时，将 URL slug 作为路径参数，并重定向到提供的
URL。你可以在浏览器中访问此 URL，或使用另一个 cURL 请求查看效果！

```shell
curl -v http://localhost:8000/denodocs
```

现在我们有了一个 API 服务器，让我们将其推送到 GitHub 仓库，稍后将其链接到 Deno
Deploy。

## 为你的应用创建 GitHub 仓库

登录 [GitHub](https://github.com) 并
[创建一个新仓库](https://docs.github.com/en/get-started/quickstart/create-a-repo)。你可以暂时跳过添加
README 或其他文件——一个空白仓库就足够了。

在你创建 API 服务器的文件夹中，依次运行以下命令初始化本地 git 仓库。请确保将
`your_username` 和 `your_repo_name` 替换为适当的值。

```sh
echo "# My Deno Link Shortener" >> README.md
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/your_username/your_repo_name.git
git push -u origin main
```

你现在应该拥有一个包含 `server.ts` 文件的 GitHub 仓库，如
[此示例仓库](https://github.com/kwhinnery/simple_api_server)
所示。现在你已准备好将此应用导入并在 Deno Deploy 上运行。

## 导入并部署你的项目

接下来，在 [Deno Deploy](https://dash.deno.com) 上注册一个账户并
[创建一个新项目](https://dash.deno.com/new_project)。连接你的 GitHub
账户并选择我们刚刚创建的仓库。

![Deno Deploy 项目选择](./images/simple_api_deploy.png)

配置应如下所示：

![Deno Deploy 配置](./images/simple_api_deploy_settings.png)

点击“部署项目”按钮。部署完成后，你的链接缩短服务将在 Deno Deploy 上上线！

![Deno Deploy 仪表盘](./images/simple_api_dashboard.png)

## 测试你的新链接缩短器

无需额外配置（Deno KV 在 Deploy
上直接可用），你的应用应该与在本地运行时表现一致。

你可以像之前一样使用 `POST` 处理器添加新链接。只需将 `localhost` URL 替换为 Deno
Deploy 上的生产环境 URL：

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.denohub.com/runtime/","slug":"denodocs"}' \
  https://your-deno-project-url-here.deno.dev/
```

同样，你可以在浏览器中访问缩短后的 URL，或使用 cURL 命令查看重定向效果：

```shell
curl -v https://your-deno-project-url-here.deno.dev/denodocs
```

如果你喜欢这个项目，接下来可以查看更高级的 Web 框架，如
[Fresh](https://fresh.deno.dev)，或了解更多关于
[Deno KV 的信息](/deploy/kv/manual)。恭喜你成功部署了简单的 API 服务器！
