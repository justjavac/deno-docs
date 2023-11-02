# 程序生命周期

Deno 支持浏览器兼容的生命周期事件：

- [`load`](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event#:~:text=The%20load%20event%20is%20fired,for%20resources%20to%20finish%20loading.):
  在整个页面加载完成时触发，包括所有依赖资源，如样式表和图像。
- [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#:~:text=The%20beforeunload%20event%20is%20fired,want%20to%20leave%20the%20page.):
  在事件循环没有更多工作要做并即将退出时触发。调度更多异步工作（如定时器或网络请求）将导致程序继续运行。
- [`unload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event):
  当文档或子资源正在卸载时触发。
- [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event):
  当拒绝没有拒绝处理程序的承诺时触发，即没有 `.catch()` 处理程序或 `.then()`
  的第二个参数。

您可以使用这些事件来在程序中提供设置和清理代码。

`load` 事件的侦听器可以是异步的，将等待执行，无法取消。`beforeunload`
事件的侦听器需要是同步的，可以取消以保持程序运行。`unload`
事件的侦听器需要是同步的，无法取消。

## 示例

**main.ts**

```ts, ignore
import "./imported.ts";

const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (main)`);
};

globalThis.addEventListener("load", handler);

globalThis.addEventListener("beforeunload", handler);

globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (main)`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`got ${e.type} event in onbeforeunload function (main)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (main)`);
};

console.log("log from main script");
```

**imported.ts**

```ts, ignore
const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (imported)`);
};

globalThis.addEventListener("load", handler);
globalThis.addEventListener("beforeunload", handler);
globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (imported)`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`got ${e.type} event in onbeforeunload function (imported)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (imported)`);
};

console.log("log from imported script");
```

这个示例的一些注意事项：

- `addEventListener` 和 `onload`/`onunload` 带有 `globalThis`
  前缀，但您也可以使用 `self` 或不带前缀的方式。
  [不建议使用 `window` 作为前缀](https://lint.deno.land/#no-window-prefix)。
- 您可以使用 `addEventListener` 和/或 `onload`/`onunload`
  来定义事件处理程序。它们之间有一个重要的区别，让我们运行示例：

```shell
$ deno run main.ts
log from imported script
log from main script
got load event in event handler (imported)
got load event in event handler (main)
got load event in onload function (main)
got onbeforeunload event in event handler (imported)
got onbeforeunload event in event handler (main)
got onbeforeunload event in onbeforeunload function (main)
got unload event in event handler (imported)
got unload event in event handler (main)
got unload event in onunload function (main)
```

使用 `addEventListener` 添加的所有侦听器都会运行，但在 `main.ts` 中定义的
`onload`、`onbeforeunload` 和 `onunload` 事件处理程序会覆盖在 `imported.ts`
中定义的处理程序。

换句话说，您可以使用 `addEventListener` 注册多个 `"load"` 或 `"unload"`
事件处理程序，但只有最后定义的 `onload`、`onbeforeunload`、`onunload`
事件处理程序将被执行。因此，出于这个原因，最好在可能的情况下使用
`addEventListener`。

## `beforeunload` 示例

```js
// beforeunload.js
let count = 0;

console.log(count);

globalThis.addEventListener("beforeunload", (e) => {
  console.log("About to exit...");
  if count < 4 {
    e.preventDefault();
    console.log("Scheduling more work...");
    setTimeout(() => {
      console.log(count);
    }, 100);
  }

  count++;
});

globalThis.addEventListener("unload", (e) => {
  console.log("Exiting");
});

count++;
console.log(count);

setTimeout(() => {
  count++;
  console.log(count);
}, 100);
```

运行这个程序将打印：

```sh
$ deno run beforeunload.js
0
1
2
About to exit...
Scheduling more work...
3
About to exit...
Scheduling more work...
4
About to exit...
Exiting
```

这使我们能够在 Node 兼容性层中填充 `process.on("beforeExit")`。

## `unhandledrejection` 事件示例：

此版本添加了对 unhandledrejection
事件的支持。当拒绝没有拒绝处理程序的承诺时，即没有 .catch() 处理程序或 .then()
的第二个参数时，将触发此事件。

```js
// unhandledrejection.js
globalThis.addEventListener("unhandledrejection", (e) => {
  console.log("unhandled rejection at:", e.promise, "reason:", e.reason);
  e.preventDefault();
});

function Foo() {
  this.bar = Promise.reject(new Error("bar not available"));
}

new Foo();
Promise.reject();
```

运行这个程序将打印：

```sh
$ deno run unhandledrejection.js
un

handled rejection at: Promise {
  <rejected> Error: bar not available
    at new Foo (file:///dev/unhandled_rejection.js:7:29)
    at file:///dev/unhandled_rejection.js:10:1
} reason: Error: bar not available
    at new Foo (file:///dev/unhandled_rejection.js:7:29)
    at file:///dev/unhandled_rejection.js:10:1
unhandled rejection at: Promise { <rejected> undefined } reason: undefined
```

此 API 将允许我们在将来的版本中在 Node 兼容性层中填充
`process.on("unhandledRejection")`。
