---
title: "处理操作系统信号"
url: /examples/os_signals_tutorial/
oldUrl:
  - /runtime/manual/examples/os_signals/
  - /runtime/tutorials/os_signals/
---

> ⚠️ 截至 Deno v1.23，Windows 仅支持监听 SIGINT 和 SIGBREAK 信号。

## 概念

- [Deno.addSignalListener()](https://docs.denohub.com/api/deno/~/Deno.addSignalListener)
  可用于捕获和监控操作系统信号。
- [Deno.removeSignalListener()](https://docs.denohub.com/api/deno/~/Deno.removeSignalListener)
  可用于停止监听信号。

## 设置操作系统信号监听器

处理操作系统信号的 API 模仿了已经熟悉的
[`addEventListener`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)
和
[`removeEventListener`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener)
API。

> ⚠️
> 请注意，监听操作系统信号不会阻止事件循环结束，即如果没有更多的挂起异步操作，进程将退出。

你可以使用 `Deno.addSignalListener()` 函数来处理操作系统信号：

```ts title="add_signal_listener.ts"
console.log("按下 Ctrl-C 以触发 SIGINT 信号");

Deno.addSignalListener("SIGINT", () => {
  console.log("已中断！");
  Deno.exit();
});

// 添加一个超时以防止进程立即退出。
setTimeout(() => {}, 5000);
```

运行：

```shell
deno run add_signal_listener.ts
```

你可以使用 `Deno.removeSignalListener()` 函数来取消之前注册的信号处理程序。

```ts title="signal_listeners.ts"
console.log("按下 Ctrl-C 以触发 SIGINT 信号");

const sigIntHandler = () => {
  console.log("已中断！");
  Deno.exit();
};
Deno.addSignalListener("SIGINT", sigIntHandler);

// 添加一个超时以防止进程立即退出。
setTimeout(() => {}, 5000);

// 1 秒后停止监听信号。
setTimeout(() => {
  Deno.removeSignalListener("SIGINT", sigIntHandler);
}, 1000);
```

运行：

```shell
deno run signal_listeners.ts
```
