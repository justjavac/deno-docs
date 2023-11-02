# 简单的 API 服务器

Deno 非常适用于创建简单、轻量级的 API 服务器。在本教程中，学习如何使用 Deno
Deploy 创建和部署一个 API 服务器。

## 创建本地 API 服务器

在您的终端中，创建一个名为 `server.ts` 的文件。我们将使用
[Deno KV 数据库](/kv/manual) 实现一个简单的链接缩短服务。

```ts title="server.ts"
const kv = await Deno.openKv();

Deno.serve(async (request: Request) => {
  // 创建短链接
  if (request.method === "POST") {
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
    const m = !slug ? "请提供一个slug。" : `Slug "${slug}"未找到`;
    return new Response(m, { status: 404 });
  }
});
```

您可以使用以下命令在您的计算机上运行此服务器：

```shell
deno run -A --unstable server.ts
```

该服务器将响应 HTTP 的 `GET` 和 `POST` 请求。`POST`
处理程序期望在请求体中接收一个 JSON 文档，其中包含 `slug` 和 `url` 属性。`slug`
是短网址组件，`url` 是您要重定向到的完整网址。

以下是使用 cURL 与此 API 端点的示例：

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.deno.com/runtime/manual","slug":"denodocs"}' \
  http://localhost:8000/
```

作为响应，服务器应该发送包含 `set` 操作结果的 KV 数据的 JSON：

```json
{ "ok": true, "versionstamp": "00000000000000060000" }
```

对我们的服务器的 `GET` 请求将以路径参数形式获取 URL slug，并重定向到提供的
URL。您可以在浏览器中访问此 URL，或者进行另一个 cURL 请求以查看其效果！

```shell
curl -v http://localhost:8000/denodocs
```

现在，我们有了一个 API 服务器，让我们将其推送到将来链接到 Deno Deploy 的 GitHub
存储库。

## 为您的应用程序创建 GitHub 存储库

登录到 [GitHub](https://github.com) 并创建一个
[新存储库](https://docs.github.com/en/get-started/quickstart/create-a-repo)。您可以暂时跳过添加
README 或任何其他文件 - 一个空白存储库对我们的目的足够了。

在创建 API 服务器的文件夹中，按顺序使用以下命令初始化本地 git 存储库。确保将
`your_username` 和 `your_repo_name` 替换为适当的值。

```sh
echo "# My Deno Link Shortener " >> README.md
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/your_username/your_repo_name.git
git push -u origin main
```

现在，您应该有一个 GitHub 存储库，其中包含您的 `server.ts` 文件，就像
[this example repository](https://github.com/kwhinnery/simple_api_server)
中一样。现在，您可以导入并在 Deno Deploy 上运行此应用程序。

## 导入和部署您的应用项目

接下来，注册 [Deno Deploy](https://dash.deno.com) 上的帐户并
[创建一个新项目](https://dash.deno.com/new)。选择导入现有的 GitHub 存储库 -
就是我们刚刚创建的那个。配置应该类似于这样：

![Deno Deploy 配置](./images/simple_api_deploy.png)

单击 "创建并部署" 按钮 - 几分钟后，您的链接缩短服务将在 Deno Deploy 上运行！

![Deno Deploy 仪表板](./images/simple_api_dashboard.png)

不需要任何额外的配置（Deno KV 在 Deploy
上可以正常工作），您的应用程序应该与在本地计算机上运行的一样。

您可以像以前一样使用 `POST` 处理程序添加新的链接。只需将 `localhost` 的 URL
替换为 Deno Deploy 上的生产 URL：

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.deno.com/runtime/manual","slug":"denodocs"}' \
  https://expensive-rook-95.deno.dev/
```

类似地，您可以在浏览器中访问您的缩短的 URL，或者使用 cURL 命令查看返回的重定向：

```shell
curl -v https://expensive-rook-95.deno.dev/denodocs
```

这只是一个非常简单的示例 - 从这里，我们建议您查看像
[Fresh](https://fresh.deno.dev) 这样的更高级的 Web 框架，或者在这里了解更多关于
[Deno KV](/kv/manual) 的信息。很棒，您成功部署了简单的 API 服务器！
