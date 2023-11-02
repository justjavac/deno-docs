# 调试代码

Deno 支持由 Chrome、Edge 和 Node.js 使用的
[V8 Inspector Protocol](https://v8.dev/docs/inspector)，这使得可以使用 Chrome
DevTools 或支持该协议的其他客户端（例如 VSCode）调试 Deno 程序。

要激活调试功能，请使用 `--inspect`，`--inspect-wait` 或 `--inspect-brk` 标志运行
Deno。

`--inspect` 标志允许在任何时候附加调试器，`--inspect-wait`
将等待调试器附加并开始执行代码，而 `--inspect-brk`
将等待调试器附加并将在代码的第一行暂停执行。

> ⚠️ 如果使用 `--inspect`
> 标志，代码将立即开始执行。如果您的程序很短，您可能没有足够的时间在程序执行完成之前连接调试器。在这种情况下，请尝试使用
> `--inspect-wait` 或 `--inspect-brk` 标志，或在代码的结尾添加超时。

## Chrome Devtools

让我们尝试使用 Chrome Devtools 调试程序。为此，我们将使用 `std` 中的
[file_server.ts](https://deno.land/std/http/file_server.ts)，一个静态文件服务器。

使用 `--inspect-brk` 标志在第一行中断执行：

```shell
$ deno run --inspect-brk --allow-read --allow-net https://deno.land/std@$STD_VERSION/http/file_server.ts
Debugger listening on ws://127.0.0.1:9229/ws/1e82c406-85a9-44ab-86b6-7341583480b1
Download https://deno.land/std@$STD_VERSION/http/file_server.ts
Compile https://deno.land/std@$STD_VERSION/http/file_server.ts
...
```

在 Chromium 派生的浏览器（如 Google Chrome 或 Microsoft Edge）中，打开
`chrome://inspect` 并单击目标旁边的“检查”：

![chrome://inspect](../images/debugger1.jpg)

打开 DevTools 后可能需要几秒钟来加载所有模块。

![DevTools opened](../images/debugger2.jpg)

您可能会注意到 DevTools 将执行暂停在 `_constants.ts` 的第一行，而不是
`file_server.ts`。这是由 JavaScript 中 ES 模块的评估方式引起的（`_constants.ts`
是 `file_server.ts` 的最左侧、最下方的依赖项，因此它首先被评估）。

此时，DevTools 中包含所有源代码，因此让我们打开 `file_server.ts`
并在那里添加断点；转到“Sources”窗格并展开树：

![Open file_server.ts](../images/debugger3.jpg)

仔细看，您会发现每个文件都有重复的条目；一个常规的，一个是斜体的。前者是编译后的源文件（因此对于
`.ts` 文件，它将是生成的 JavaScript 源文件），而后者是该文件的源映射。

接下来，在 `listenAndServe` 方法中添加断点：

![Break in file_server.ts](../images/debugger4.jpg)

一旦我们添加了断点，DevTools
会自动打开源映射文件，这允许我们逐步浏览包含类型的实际源代码。

现在我们已经设置了断点，我们可以恢复脚本的执行，以便我们可以检查传入的请求。点击“继续执行脚本”按钮来执行此操作。您可能需要点击两次！

一旦我们的脚本正在运行，请尝试发送一个请求并在 Devtools 中检查它：

```
$ curl http://0.0.0.0:4507/
```

![Break in request handling](../images/debugger5.jpg)

在这一点上，我们可以检查请求的内容并逐步调试代码。

## VSCode

可以使用 VSCode 调试 Deno。最好使用官方的 `vscode_deno`
扩展来完成这项工作。有关此扩展的文档，请参阅
[此处](../references/vscode_deno#using-the-debugger)。

## JetBrains IDEs

**注意**：确保您已安装并启用了
[此 Deno 插件](https://plugins.jetbrains.com/plugin/14382-deno)。有关更多信息，请参阅
[此博客文章](https://blog.jetbrains.com/webstorm/2020/06/deno-support-in-jetbrains-ides/)。

您可以通过右键单击要调试的文件并选择“调试'Deno: <文件名>'”选项来使用 JetBrains
IDE 调试 Deno。

![Debug file](../images/jb-ide-debug.png)

这将创建一个没有权限标志的运行/调试配置。如果要配置它们，请打开运行/调试配置并将所需的标志添加到“命令”字段。

## 其他

任何实现 DevTools 协议的客户端都应该能够连接到 Deno 进程。
