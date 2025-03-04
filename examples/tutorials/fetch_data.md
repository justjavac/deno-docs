---
title: "获取和流式传输数据"
url: /examples/fetch_data_tutorial/
oldUrl:
  - /runtime/manual/examples/fetch_data/
  - /runtime/tutorials/fetch_data/
---

Deno 将几个熟悉的 Web API
带到了服务器端环境中。如果你曾经使用过浏览器，你可能会认出
[`fetch()`](/api/web/fetch) 方法和 [`streams`](/api/web/streams)
API，它们用于通过网络发出请求并访问数据流。Deno 实现了这些
API，允许你从网络上获取和流式传输数据。

## 获取数据

在构建 Web 应用程序时，开发人员通常需要从网络上的其他地方检索资源。我们可以使用
`fetch` API 来实现这一点。我们将探讨如何从 URL
获取不同形式的数据，以及如何在请求失败时处理错误。

创建一个名为 `fetch.js` 的新文件，并添加以下代码：

```ts title="fetch.js"
// 输出：JSON 数据
const jsonResponse = await fetch("https://api.github.com/users/denoland");
const jsonData = await jsonResponse.json();

console.log(jsonData, "\n");

// 输出：HTML 数据
const textResponse = await fetch("https://deno.land/");
const textData = await textResponse.text();

console.log(textData, "\n");

// 输出：错误信息
try {
  await fetch("https://does.not.exist/");
} catch (error) {
  console.log(error);
}
```

你可以使用 `deno run` 命令运行此代码。由于它正在通过网络获取数据，因此你需要授予
`--allow-net` 权限：

```sh
deno run --allow-net fetch.js
```

你应该会在控制台中看到 JSON 数据、HTML 文本数据以及错误信息。

## 流式传输数据

有时你可能希望通过网络发送或接收大文件。当你事先不知道文件的大小时，流式传输是一种更高效的处理数据的方式。客户端可以从流中读取，直到流结束。

Deno 提供了使用 `Streams API`
流式传输数据的方法。我们将探讨如何将文件转换为可读或可写流，以及如何使用流发送和接收文件。

创建一个名为 `stream.js` 的新文件。

我们将使用 `fetch` API 来检索文件。然后我们将使用
[`Deno.open`](/api/deno/Deno.open) 方法创建并打开一个可写文件，并使用 Streams
API 中的 [`pipeTo`](/api/web/~/ReadableStream.pipeTo)
方法将字节流发送到创建的文件中。

接下来，我们将在 `POST` 请求上使用 `readable` 属性将文件的字节流发送到服务器。

```ts title="stream.js"
// 接收文件
const fileResponse = await fetch("https://deno.land/logo.svg");

if (fileResponse.body) {
  const file = await Deno.open("./logo.svg", { write: true, create: true });

  await fileResponse.body.pipeTo(file.writable);
}

// 发送文件
const file = await Deno.open("./logo.svg", { read: true });

await fetch("https://example.com/", {
  method: "POST",
  body: file.readable,
});
```

你可以使用 `deno run`
命令运行此代码。由于它正在通过网络获取数据并写入文件，因此你需要授予
`--allow-net`、`--allow-write` 和 `--allow-read` 权限：

```sh
deno run --allow-read --allow-write --allow-net stream.js
```

你应该会看到在当前目录中创建并填充了 `logo.svg` 文件，如果你拥有
example.com，你还会看到文件被发送到服务器。

🦕
现在你知道了如何通过网络获取和流式传输数据，以及如何将数据流式传输到文件和从文件中读取！无论你是提供静态文件、处理上传、生成动态内容还是流式传输大型数据集，Deno
的文件处理和流式传输功能都是你开发者工具箱中的强大工具！
