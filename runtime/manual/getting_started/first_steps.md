# 初步了解

这个页面包含一些示例，以教你了解 Deno 的基础知识。

本文假定你具备一些 JavaScript 的先前知识，特别是涉及到 `async`/`await`
的知识。如果你对 JavaScript 没有任何了解，可能需要先阅读一个关于 JavaScript
基础的指南，然后再尝试学习 Deno。

## 你好，世界

Deno 是一个用于 JavaScript/TypeScript
的运行时，它试图在尽可能多的地方与Web兼容并使用现代特性。

Web 兼容性意味着在 Deno 中的 `Hello World`
程序与你在浏览器中运行的程序是相同的。

在本地创建一个名为 `first_steps.ts` 的文件，然后复制并粘贴下面的代码行：

```ts
console.log("欢迎来到 Deno！");
```

## 运行 Deno 程序

现在，从终端运行该程序：

```shell
deno run first_steps.ts
```

Deno 还可以执行来自 URL 的脚本。Deno [托管一个库](https://examples.deno.land/)
包含示例代码，其中之一是一个 `Hello World`
程序。要运行托管的代码，执行以下命令：

```shell
deno run https://examples.deno.land/hello-world.ts
```

## 发起 HTTP 请求

许多程序使用HTTP请求来从 Web
服务器获取数据。让我们编写一个小程序，它获取文件并将其内容打印到终端上。就像在浏览器中一样，你可以使用
Web 标准的 [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
API 来进行 HTTP 调用。

在你上面创建的 `first_steps.ts` 文件中，粘贴以下代码：

```ts
const res = await fetch("https://deno.com");
const body = await res.text();
console.log(body);
```

让我们一起看一下这个应用程序做了什么：

1. 我们请求 `https://deno.com`，等待响应，并将其存储在 `res` 常量中。
2. 我们将响应体解析为文本，并存储在 `body` 常量中。
3. 我们将 `body` 常量的内容写入控制台。

尝试一下：

```shell
deno run first_steps.ts
```

或者，尝试运行托管在 `https://deno.land/std@0.198.0/examples/curl.ts` 的脚本：

```shell
deno run https://deno.land/std@0.198.0/examples/curl.ts https://deno.com
```

该程序将显示一个类似以下的提示：

```shell
┌ ⚠️  Deno requests net access to "deno.com".
├ Requested by `fetch()` API.
├ Run again with --allow-net to bypass this prompt.
└ Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all net permissions) >
```

你可能还记得在介绍中提到 Deno
默认情况下是安全的运行时。这意味着你需要明确地授予程序执行某些“特权”操作的权限，例如访问网络。

你可以在提示中回答 'y'，或者再次尝试使用正确的权限标志：

```shell
deno run --allow-net=deno.com first_steps.ts
```

或者，使用 curl 脚本：

```shell
deno run --allow-net=deno.com https://deno.land/std@0.198.0/examples/curl.ts https://deno.com
```

## 读取文件

Deno 还提供了一些不来自 Web 的 API。所有这些都包含在全局对象 `Deno` 中。你可以在
[`/api`](https://deno.land/api) 找到这些内置 API 的文档。

例如，文件系统 API 没有 Web 标准形式，因此 Deno 提供了自己的 API。

在这个程序中，每个命令行参数被假定为一个文件名，文件被打开并打印到标准输出。

```ts
const filenames = Deno.args;
for (const filename of filenames) {
  const file = await Deno.open(filename);
  await file.readable.pipeTo(Deno.stdout.writable, { preventClose: true });
}
```

这里的 `ReadableStream.pipeTo(writable)` 方法实际上只进行了必要的内核 → 用户空间
→
内核拷贝。也就是说，从文件中读取数据的内存与写入到标准输出的内存是相同的。这说明了
Deno 中 I/O 流的一般设计目标。

同样，在这里，我们需要授予 `--allow-read` 的权限来运行程序。

尝试运行程序：

```shell
# macOS / Linux
deno run --allow-read https://deno.land/std@0.198.0/examples/cat.ts /etc/hosts

# Windows
deno run --allow-read https://deno.land/std@0.198.0/examples/cat.ts "C:\Windows\System32\Drivers\etc\hosts"
```

## 在 HTTP 服务器中将所有内容组合在一起

Deno 最常见的用途之一是构建 HTTP 服务器。

创建一个名为 `http_server.ts` 的新文件，然后复制并粘贴下面的代码：

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

const handler = async (_request: Request): Promise<Response> => {
  const resp = await fetch("https://api.github.com/users/denoland", {
    // 这里的初始化对象包含一个包含指示我们接受什么类型响应的标头对象。
    // 我们不指定方法字段，因为默认情况下fetch执行GET请求。
    headers: {
      accept: "application/json",
    },
  });

  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "content-type": "application/json",
    },
  });
};

serve(handler);
```

让我们看一下这个程序

做了什么。

1. 从 `std/http`（标准库）中导入 HTTP 服务器。
2. HTTP
   服务器需要一个处理程序函数。该函数对每个进来的请求都会被调用。它必须返回一个
   `Response` 。处理程序函数可以是异步的（可能返回一个 `Promise`）。
3. 使用 `fetch` 来获取 URL。
4. 将 GitHub 的响应作为处理程序的响应返回。
5. 最后，要启动服务器并监听默认端口，调用 `serve` 时传入处理程序。

现在运行服务器。请注意，你需要授予网络权限。

```shell
deno run --allow-net http_server.ts
```

在服务器监听端口 `8000` 上，向该端点发起GET请求。

```shell
curl http://localhost:8000
```

你将会看到来自 Deno GitHub 页面的 JSON 响应。

## 更多示例

你可以在[教程](/runtime/tutorials)部分和
[Deno 示例](https://examples.deno.land/)找到更多示例。
