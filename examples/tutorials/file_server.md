---
title: "编写文件服务器"
url: /examples/file_server_tutorial/
oldUrl:
  - /runtime/manual/examples/file_server/
  - /runtime/tutorials/file_server/
---

文件服务器监听传入的 HTTP 请求，并从本地文件系统中提供文件。本教程演示了如何使用
Deno 内置的 [文件系统 API](/api/deno/file-system) 创建一个简单的文件服务器。

## 编写一个简单的文件服务器

首先，创建一个名为 `file-server.ts` 的新文件。

我们将使用 Deno 内置的 [HTTP 服务器](/api/deno/~/Deno.serve)
来监听传入的请求。在你的新 `file-server.ts` 文件中，添加以下代码：

```ts title="file-server.ts"
Deno.serve(
  { hostname: "localhost", port: 8080 },
  (request) => {
    const url = new URL(request.url);
    const filepath = decodeURIComponent(url.pathname);
  },
);
```

> 如果你不熟悉 `URL` 对象，可以在
> [URL API](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)
> 文档中了解更多信息。[decodeURIComponent 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
> 用于解码 URL 编码的路径，以防字符被百分号编码。

### 打开文件并流式传输其内容

当收到请求时，我们将尝试使用 [`Deno.open`](/api/deno/~/Deno.open) 打开请求 URL
中指定的文件。

如果请求的文件存在，我们将使用
[ReadableStream API](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)
将其转换为可读的数据流，并将其内容流式传输到响应中。我们不知道请求的文件可能有多大，因此流式传输可以防止在提供大文件或同时处理多个请求时出现内存问题。

如果文件不存在，我们将返回一个 "404 Not Found" 响应。

在请求处理程序的主体中，在两个变量下方，添加以下代码：

```ts
try {
  const file = await Deno.open("." + filepath, { read: true });
  return new Response(file.readable);
} catch {
  return new Response("404 Not Found", { status: 404 });
}
```

### 运行文件服务器

使用 `deno run` 命令运行你的新文件服务器，允许读取访问和网络访问：

```shell
deno run --allow-read=. --allow-net file-server.ts
```

## 使用 Deno 标准库提供的文件服务器

从头开始编写文件服务器是理解 Deno 的 HTTP
服务器工作原理的好练习。然而，从头开始编写生产就绪的文件服务器可能复杂且容易出错。最好使用经过测试且可靠的解决方案。

Deno 标准库为你提供了一个
[文件服务器](https://jsr.io/@std/http/doc/file-server/~)，这样你就不必自己编写。

要使用它，首先将远程脚本安装到本地文件系统：

```shell
# Deno 1.x
deno install --allow-net --allow-read jsr:@std/http/file-server
# Deno 2.x
deno install --global --allow-net --allow-read jsr:@std/http/file-server
```

> 这将把脚本安装到 Deno 安装根目录，例如 `/home/user/.deno/bin/file-server`。

你现在可以使用简化的脚本名称运行脚本：

```shell
$ file-server .
Listening on:
- Local: http://0.0.0.0:8000
```

要查看文件服务器可用的完整选项列表，请运行 `file-server --help`。

如果你在浏览器中访问
[http://0.0.0.0:8000/](http://0.0.0.0:8000/)，你将看到本地目录的内容。

### 在 Deno 项目中使用 @std/http 文件服务器

要在 [Deno 项目](/runtime/getting_started/first_project)
中使用文件服务器，你可以将其添加到 `deno.json` 文件中：

```sh
deno add jsr:@std/http
```

然后在你的项目中导入它：

```ts title="file-server.ts"
import { serveDir } from "@std/http/file-server";

Deno.serve((req) => {
  const pathname = new URL(req.url).pathname;
  if (pathname.startsWith("/static")) {
    return serveDir(req, {
      fsRoot: "path/to/static/files/dir",
    });
  }
  return new Response();
});
```

这段代码将使用 `Deno.serve` 设置一个 HTTP
服务器。当请求进来时，它会检查请求的路径是否以 “/static”
开头。如果是，它将从指定目录中提供文件。否则，它将返回一个空响应。

🦕 现在你知道了如何编写自己的简单文件服务器，以及如何使用 Deno
标准库提供的文件服务器工具。你已经准备好处理各种任务——无论是提供静态文件、处理上传、转换数据还是管理访问控制——你都可以使用
Deno 来提供文件。
