# 处理操作系统信号

> ⚠️ 截止到 Deno v1.23，Windows 仅支持监听 SIGINT 和 SIGBREAK。

## 概念

- [Deno.addSignalListener()](https://deno.land/api?s=Deno.addSignalListener)
  可以用于捕获和监控操作系统信号。
- [Deno.removeSignalListener()](https://deno.land/api?s=Deno.removeSignalListener)
  可以用于停止监听信号。

## 设置操作系统信号监听器

处理操作系统信号的 API 设计参考了已经熟悉的
[`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
和
[`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
API。

> ⚠️
> 请注意，监听操作系统信号不会阻止事件循环完成，即使没有挂起的异步操作，进程仍然会退出。

您可以使用 `Deno.addSignalListener()` 函数来处理操作系统信号：

```ts
/**
 * add_signal_listener.ts
 */
console.log("按 Ctrl-C 触发 SIGINT 信号");

Deno.addSignalListener("SIGINT", () => {
  console.log("被中断！");
  Deno.exit();
});

// 添加一个超时以防止进程立即退出。
setTimeout(() => {}, 5000);
```

使用以下命令运行：

```shell
deno run add_signal_listener.ts
```

您可以使用 `Deno.removeSignalListener()` 函数来取消先前添加的信号处理程序。

```ts
/**
 * signal_listeners.ts
 */
console.log("按 Ctrl-C 触发 SIGINT 信号");

const sigIntHandler = () => {
  console.log("被中断！");
  Deno.exit();
};
Deno.addSignalListener("SIGINT", sigIntHandler);

// 添加一个超时以防止进程立即退出。
setTimeout(() => {}, 5000);

// 在 1 秒后停止监听信号。
setTimeout(() => {
  Deno.removeSignalListener("SIGINT", sigIntHandler);
}, 1000);
```

使用以下命令运行：

```shell
deno run signal_listeners.ts
```

## 异步迭代器示例

如果您更喜欢使用异步迭代器处理信号，您可以使用 `deno_std` 中可用的
[`signal()`](https://deno.land/std/signal/mod.ts) API：

```ts
/**
 * async_iterator_signal.ts
 */
import { signal } from "https://deno.land/std/signal/mod.ts";

const sig = signal("SIGUSR1", "SIGINT");

// 添加一个超时以防止进程立即退出。
setTimeout(() => {}, 5000);

for await (const _ of sig) {
  console.log("接收到中断或 usr1 信号");
}
```

使用以下命令运行：

```shell
deno run async_iterator_signal.ts
```
