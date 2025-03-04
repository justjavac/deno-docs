---
title: "调试你的代码"
oldUrl:
- /runtime/manual/getting_started/debugging_your_code/
- /runtime/manual/basics/debugging_your_code/
---

Deno 支持 Chrome、Edge 和 Node.js 使用的
[V8 Inspector Protocol](https://v8.dev/docs/inspector)。这使得可以使用 Chrome
DevTools 或其他支持该协议的客户端（例如 VSCode）来调试 Deno 程序。

要激活调试功能，请使用以下标志之一运行 Deno：

- `--inspect`
- `--inspect-wait`
- `--inspect-brk`

## --inspect

使用 `--inspect` 标志将启动一个检查器服务器，允许支持 V8 Inspector Protocol
的工具（例如 Chrome DevTools）进行客户端连接。

在基于 Chromium 的浏览器中访问 `chrome://inspect` 以将 Deno
连接到检查器服务器。这允许你检查代码、添加断点并逐步执行代码。

```sh
deno run --inspect your_script.ts
```

:::note

如果你使用 `--inspect`
标志，代码将立即开始执行。如果你的程序较短，可能在程序执行完毕之前没有足够的时间连接调试器。

在这种情况下，可以尝试使用 `--inspect-wait` 或 `--inspect-brk`
标志，或者在代码末尾添加一个超时。

:::

## --inspect-wait

`--inspect-wait` 标志将在执行代码之前等待调试器连接。

```sh
deno run --inspect-wait your_script.ts
```

## --inspect-brk

`--inspect-brk`
标志将在执行代码之前等待调试器连接，并在连接后立即在程序中设置断点，允许你在恢复执行之前添加其他断点或评估表达式。

**这是最常用的 inspect 标志**。JetBrains 和 VSCode IDE 默认使用此标志。

```sh
deno run --inspect-brk your_script.ts
```

## 使用 Chrome DevTools 的示例

让我们尝试使用 Chrome DevTools 调试一个程序。为此，我们将使用
[@std/http/file-server](https://jsr.io/@std/http#file-server)，一个静态文件服务器。

使用 `--inspect-brk` 标志在第一行中断执行：

```sh
$ deno run --inspect-brk -RN jsr:@std/http/file-server
Debugger listening on ws://127.0.0.1:9229/ws/1e82c406-85a9-44ab-86b6-7341583480b1
...
```

在基于 Chromium 的浏览器（如 Google Chrome 或 Microsoft Edge）中，打开
`chrome://inspect` 并点击目标旁边的 `Inspect`：

![chrome://inspect](./images/debugger1.png)

打开 DevTools 后，可能需要几秒钟来加载所有模块。

![DevTools opened](./images/debugger2.jpg)

你可能会注意到 DevTools 在 `_constants.ts` 的第一行暂停执行，而不是
`file_server.ts`。这是由 JavaScript 中 ES
模块的评估方式引起的预期行为（`_constants.ts` 是 `file_server.ts`
最左、最底层的依赖项，因此首先被评估）。

此时，所有源代码都已在 DevTools 中可用，因此让我们打开 `file_server.ts`
并在那里添加一个断点；转到 "Sources" 面板并展开树：

![Open file_server.ts](./images/debugger3.jpg)

_仔细观察，你会发现每个文件都有两个条目；一个是常规的，一个是斜体的。前者是编译后的源文件（因此对于
`.ts` 文件，它将是生成的 JavaScript 源代码），而后者是文件的源映射。_

接下来，在 `listenAndServe` 方法中添加一个断点：

![Break in file_server.ts](./images/debugger4.jpg)

一旦我们添加了断点，DevTools
会自动打开源映射文件，这允许我们逐步执行包含类型的实际源代码。

现在我们已经设置了断点，可以恢复脚本的执行，以便检查传入的请求。点击 "Resume
script execution" 按钮来执行此操作。你可能甚至需要点击两次！

一旦我们的脚本运行，尝试发送一个请求并在 DevTools 中检查它：

```sh
curl http://0.0.0.0:4507/
```

![Break in request handling](./images/debugger5.jpg)

此时，我们可以检查请求的内容并逐步调试代码。

## VSCode

Deno 可以使用 VSCode 进行调试。最好借助官方的 `vscode_deno`
扩展来完成。相关文档可以在 [这里](/runtime/reference/vscode#using-the-debugger)
找到。

## JetBrains IDE

_**注意**：确保你已经安装并启用了
[这个 Deno 插件](https://plugins.jetbrains.com/plugin/14382-deno)。更多信息请参阅
[这篇博客文章](https://blog.jetbrains.com/webstorm/2020/06/deno-support-in-jetbrains-ides/)。_

你可以通过右键点击要调试的文件并选择 `Debug 'Deno: <file name>'` 选项来使用
JetBrains IDE 调试 Deno。

![Debug file](./images/jb-ide-debug.png)

这将创建一个没有设置权限标志的运行/调试配置。如果你想配置它们，请打开你的运行/调试配置并将所需的标志添加到
`Command` 字段。

## --log-level=debug

如果你在连接到检查器时遇到问题，可以使用 `--log-level=debug`
标志来获取更多信息。这将显示模块解析、网络请求和其他权限检查的信息。

```sh
deno run --inspect-brk --log-level=debug your_script.ts
```

## --strace-ops

Deno ops 是 JavaScript 和 Rust 之间的
[RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) 机制。它们为
JavaScript 提供了文件 I/O、网络和计时器等功能。`--strace-ops` 标志将打印出 Deno
在运行程序时执行的所有 ops 及其时间。

```sh
deno run --strace-ops your_script.ts
```

每个 op 都应该有一个 `Dispatch` 和一个 `Complete`
事件。这两个事件之间的时间是执行 op
所花费的时间。此标志可用于性能分析、调试挂起的程序或了解 Deno 的内部工作原理。
