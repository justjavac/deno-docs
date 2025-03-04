---
title: "Deno 中的浏览器 API"
url: /examples/browser_apis_in_deno/
videoUrl: https://www.youtube.com/watch?v=oxVwTT-rZRo&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=6
layout: video.tsx
---

## 视频描述

Deno 希望为开发者提供尽可能接近浏览器的编程环境。Deno 使用 Web 标准
API，因此如果你熟悉 Web 开发，那么你对 Deno
也会感到熟悉。如果不熟悉，当你学习如何使用 Deno 时，你也在学习如何为 Web 构建。

如果你查看文档，它会让你很好地了解有哪些功能可用，因此我们拥有像
Canvas、国际化、消息传递、存储、流、时间、WebSockets 等我们喜欢在 Web
上使用的所有功能，我们都会发现它们内置在 Deno 中。

## 脚本和代码

让我们先看看 `fetch`。它的工作方式可能如你所想。

我们将获取 JSON placeholder API 的响应。然后我们将该响应转换为 JSON
作为一个新变量，并使用 `console.log`
打印它。现在，如果我们在终端中查看，我们会说
`deno allow network`，以便我们可以选择立即运行该 fetch。

```javascript title="main.ts"
const response = await fetch("https://snowtooth-hotel-api.fly.dev");
const data = await response.json();
console.log(data);
```

我们在这里完成了。所有数据都如预期返回。

```shell
deno add jsr:@std/streams
```

让我向你展示我的意思。我们将保留那个
fetch。我们将说如果响应体值存在，我们将创建一个名为 `transformedStream`
的新变量，并将其设置为 `response.body`。谢谢。在这里，我们将使用一个名为
`pipeThrough` 的函数。

`pipeThrough` 是 JavaScript
中的一个方法，它允许我们获取可读流的输出并将其传递以修改流的数据。我们要做的第一件事是将字节流解码为文本流。因此，我们将说
`new TextDecoderStream()`。然后我们将链接另一个 `pipeThrough` 函数。

这次我们将把文本流拆分为行。因此，我们将从数据中返回不同的行。现在，`TextLineStream`
实际上来自我们需要包含的一个库。

```javascript
import { TextLineStream } from "@std/streams";
import { toTransformStream } from "@std/streams/to-transform-stream";

const response = await fetch("https://example.com/data.txt");

// 确保响应体存在
if (response.body) {
  // 创建一个逐行处理响应体的流读取器
  const transformedStream = response.body
    // 将字节流解码为文本流
    .pipeThrough(new TextDecoderStream())
    // 将文本流拆分为行
    .pipeThrough(new TextLineStream())
    // 获取一个读取器以读取行
    //.getReader();
    .pipeThrough(toTransformStream(async function* (src) {
      for await (const chunk of src) {
        if (chunk.trim().length === 0) {
          continue;
        }
        console.log(chunk);
        yield chunk;
      }
    }));
  // 创建一个读取器以消费转换后的流
  const reader = transformedStream.getReader();
  // 读取并记录流中的每一行文本
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log(value); // 记录每个解析的 JSON 对象
  }
}
```

## 设置配置

因此，我们将说 `deno add jsr@std/streams`。这将在这里创建我们的 `deno.json`
配置文件。会有另一个视频更深入地探讨这一点，但现在只需知道这包括我们项目中的任何导入。因此，转换流正在形成，但还有几个步骤。

## 使用转换流

下一步是我们再次使用 `pipeThrough`。这次我们将使用另一个函数
`toTransformStream`，它将来自标准流，特别是函数
`toTransformStream`。这次我们将在这里传递一个异步生成器。我们知道它是一个生成器，因为我们使用了那个星号，并且这个函数的主体是一个循环，在这里我们将说
`const chunk`，即我们正在处理的一小块数据，`chunk of source`，这是传递到那里的值。

我们将说 `console.log(chunk)`，并且我们还将在这里 `yield` 该
`chunk`。好的，那么这个 `console.log` 为我们做了什么？让我们继续运行
`deno --allow-net main.ts`。这向我们展示了这是我们 HTML 文档的顶行。

因此，我们实际上需要一种方法来遍历它，我们将通过创建一个读取器来消费这个转换后的流来实现这一点。因此，让我们在这里删除我们的
`console.log`。在这里，我们将创建一个名为 `reader` 的值，它将被设置为
`transformedStream.getReader()`。现在从这里开始，我们可以在这里创建一个小
`while` 循环。因此，当该值为真时。

我们希望从 `await reader.read()` 中解构
`{value, done}`。因此，我们可以再次调用该读取器上的 `.read()`
方法。然后我们将说如果 `done` 为真，那么我们希望跳出循环。否则，我们希望
`console.log(value)`。

很好。所以现在我们将看到我们的 HTML 在这里逐行打印在我们的控制台中。

好的，这就是使用我们的 `TextLineStream` 的一个快速示例。我们可以将其与 `fetch`
结合使用。如果你想了解更多关于这个 API 的信息，你可以在这里查看文档。Deno
为我们提供了一个真正类似浏览器的环境，用于使用像 `fetch`、Web Workers
等更多功能。

Deno 使得以熟悉和友好的方式使用这些 Web 标准 API 变得非常顺畅。
