---
title: "Web Platform APIs"
oldUrl:
  - /runtime/manual/runtime/navigator_api/
  - /runtime/manual/runtime/web_platform_apis/
  - /runtime/manual/runtime/location_api/
  - /runtime/manual/runtime/web_storage_api/
  - /runtime/manual/runtime/workers/
---

Deno 通过使用标准的 Web Platform APIs（如 `fetch`、WebSockets 等）而非专有 API
来简化 Web 和云开发。这意味着，如果你曾经为浏览器开发过应用，你可能已经对 Deno
很熟悉了；而如果你正在学习 Deno，你也在提升自己对 Web 的了解。

<a href="/api/web/" class="docs-cta runtime-cta">探索支持的 Web APIs</a>

下面我们将重点介绍一些 Deno 支持的标准 Web API。

要检查某个 Web Platform API 是否在 Deno 中可用，你可以点击
[MDN 上的接口](https://developer.mozilla.org/zh-CN/docs/Web/API#interfaces)
并参考
[其浏览器兼容性表格](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController#browser_compatibility)。

## fetch

[`fetch`](/api/web/~/fetch) API 可用于发起 HTTP 请求。它是按照
[WHATWG `fetch` 规范](https://fetch.spec.whatwg.org/) 实现的。

### 规范差异

- Deno 用户代理没有 cookie jar。因此，响应中的 `set-cookie`
  头不会被处理，也不会从可见的响应头中过滤掉。
- Deno 不遵循同源策略，因为 Deno 用户代理目前没有“源”的概念，也没有 cookie
  jar。这意味着 Deno 不需要防止跨源泄露认证数据。因此，Deno 没有实现 WHATWG
  `fetch` 规范的以下部分：
  - 第 `3.1. 'Origin' 头` 部分。
  - 第 `3.2. CORS 协议` 部分。
  - 第 `3.5. CORB` 部分。
  - 第 `3.6. 'Cross-Origin-Resource-Policy' 头` 部分。
  - `Atomic HTTP 重定向处理`。
  - `opaqueredirect` 响应类型。
- 使用 `redirect` 模式为 `manual` 的 `fetch` 将返回一个 `basic` 响应，而不是
  `opaqueredirect` 响应。
- 规范对于 [如何处理 `file:` URL](https://fetch.spec.whatwg.org/#scheme-fetch)
  的描述较为模糊。Firefox 是唯一支持获取 `file:` URL
  的主流浏览器，但默认情况下它也不起作用。从 Deno 1.16 开始，Deno
  支持获取本地文件。详情请见下一节。
- `request` 和 `response` 头的守卫已实现，但与浏览器不同，Deno
  对允许的头名称没有任何限制。
- `RequestInit` 中的
  `referrer`、`referrerPolicy`、`mode`、`credentials`、`cache`、`integrity`、`keepalive`
  和 `window` 属性及其相关行为未实现。`Request` 对象中也没有相关字段。
- 请求体上传流已支持（在 HTTP/1.1 和 HTTP/2 上）。与当前的 fetch
  提案不同，该实现支持双工流。
- 在 `headers` 迭代器中迭代时，`set-cookie` 头不会被拼接。此行为正在
  [规范制定中](https://github.com/whatwg/fetch/pull/1346)。

### 获取本地文件

Deno 支持获取 `file:`
URL。这使得编写在服务器和本地使用相同代码路径的代码更加容易，同时也使得编写适用于
Deno CLI 和 Deno Deploy 的代码更加容易。

Deno 仅支持绝对文件 URL，这意味着 `fetch("./some.json")`
将不起作用。需要注意的是，如果指定了 [`--location`](#location)，相对 URL 会使用
`--location` 作为基础，但不能将 `file:` URL 作为 `--location` 传递。

为了能够获取相对于当前模块的资源，无论模块是本地还是远程的，你都应该使用
`import.meta.url` 作为基础。例如：

```js
const response = await fetch(new URL("./config.json", import.meta.url));
const config = await response.json();
```

关于获取本地文件的注意事项：

- 读取资源需要权限，因此需要适当的 `--allow-read` 权限才能读取本地文件。
- 本地获取仅支持 `GET` 方法，使用其他方法会拒绝 Promise。
- 不存在的文件会简单地拒绝 Promise 并返回一个模糊的
  `TypeError`。这是为了避免潜在的指纹攻击。
- 响应上没有设置任何头。因此，需要由消费者来确定内容类型或内容长度等信息。
- 响应体从 Rust 端流式传输，因此大文件可以分块获取，并且可以取消。

## CustomEvent 和 EventTarget

[DOM Event API](/api/web/~/Event) 可用于分发和监听应用程序中发生的事件。它是按照
[WHATWG DOM 规范](https://dom.spec.whatwg.org/#events) 实现的。

### 规范差异

- 事件不会冒泡，因为 Deno 没有 DOM 层次结构，因此没有树供事件冒泡/捕获。
- `timeStamp` 属性始终设置为 `0`。

## 类型定义

已实现的 Web API 的 TypeScript 定义可以在
[`lib.deno.shared_globals.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.shared_globals.d.ts)
和
[`lib.deno.window.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.window.d.ts)
文件中找到。

特定于 worker 的定义可以在
[`lib.deno.worker.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.worker.d.ts)
文件中找到。

## Location

Deno 支持 Web 中的 [`location`](/api/web/~/Location) 全局变量。

### Location 标志

在 Deno 进程中，没有“网页”的 URL 可以用作 location。我们允许用户通过在 CLI
上使用 `--location` 标志来模拟文档位置。它可以是一个 `http` 或 `https` URL。

```ts
// deno run --location https://example.com/path main.ts

console.log(location.href);
// "https://example.com/path"
```

你必须传递 `--location <href>` 才能使其工作。如果不传递，任何对 `location`
全局变量的访问都会抛出错误。

```ts
// deno run main.ts

console.log(location.href);
// 错误：未捕获的 ReferenceError：访问 "location"，请使用 --location <href> 重新运行。
```

在浏览器中，设置 `location` 或其任何字段通常会导致导航。这在 Deno
中不适用，因此在这种情况下会抛出错误。

```ts
// deno run --location https://example.com/path main.ts

location.pathname = "./foo";
// 错误：未捕获的 NotSupportedError：无法设置 "location.pathname"。
```

### 扩展用法

在 Web 上，资源解析（不包括模块）通常使用 `location.href`
的值作为基础来解析任何相对 URL。这会影响 Deno 采用的一些 Web API。

#### Fetch API

```ts
// deno run --location https://api.github.com/ --allow-net main.ts

const response = await fetch("./orgs/denoland");
// 获取 "https://api.github.com/orgs/denoland"。
```

如果未传递 `--location` 标志，上述 `fetch()` 调用将抛出错误，因为没有类似 Web
的位置作为基础。

#### Worker 模块

```ts
// deno run --location https://example.com/index.html --allow-net main.ts

const worker = new Worker("./workers/hello.ts", { type: "module" });
// 获取位于 "https://example.com/workers/hello.ts" 的 worker 模块。
```

:::note

对于上述用例，最好传递完整的 URL，而不是依赖 `--location`。如果需要，你可以使用
`URL` 构造函数手动解析相对 URL。

:::

`--location`
标志适用于那些有特定目的需要模拟文档位置，并且知道这仅在应用程序级别有效的人。然而，你也可以用它来消除依赖项中随意访问
`location` 全局变量导致的错误。

## Web Storage

[Web Storage API](/api/web/storage) 提供了一个用于存储字符串键和值的
API。持久化数据的工作方式与浏览器类似，并且有 10MB 的存储限制。全局
`sessionStorage` 对象仅在当前执行上下文中持久化数据，而 `localStorage`
在多次执行之间持久化数据。

在浏览器中，`localStorage`
按源（实际上是协议加主机名加端口）唯一地持久化数据。从 Deno 1.16 开始，Deno
有一套规则来确定唯一的存储位置：

- 使用 `--location` 标志时，位置的源用于唯一地存储数据。这意味着
  `http://example.com/a.ts`、`http://example.com/b.ts` 和
  `http://example.com:80/` 都会共享相同的存储，但 `https://example.com/`
  会不同。
- 如果没有指定位置，但指定了 `--config`
  配置文件，则使用该配置文件的绝对路径。这意味着
  `deno run --config deno.jsonc a.ts` 和 `deno run --config deno.jsonc b.ts`
  会共享相同的存储，但 `deno run --config tsconfig.json a.ts` 会不同。
- 如果没有指定配置或位置，Deno 使用主模块的绝对路径来确定共享的存储。Deno REPL
  会生成一个基于启动 `deno`
  的当前工作目录的“合成”主模块。这意味着从同一路径多次调用 REPL 将共享持久化的
  `localStorage` 数据。

要设置、获取和删除 `localStorage` 中的项目，你可以使用以下代码：

```ts
// 在 localStorage 中设置一个项目
localStorage.setItem("myDemo", "Deno App");

// 从 localStorage 中读取一个项目
const cat = localStorage.getItem("myDemo");

// 从 localStorage 中删除一个项目
localStorage.removeItem("myDemo");

// 删除 localStorage 中的所有项目
localStorage.clear();
```

## Web Workers

Deno 支持 [`Web Worker API`](/api/web/workers)。

Worker 可用于在多线程上运行代码。每个 `Worker`
实例都在一个单独的线程上运行，该线程专用于该 worker。

目前 Deno 仅支持 `module` 类型的 worker；因此在创建新 worker 时，必须传递
`type: "module"` 选项。

在主 worker 中使用相对模块说明符仅在 CLI 上传递 `--location <href>`
时支持。这不推荐用于可移植性。你可以使用 `URL` 构造函数和 `import.meta.url`
轻松创建附近脚本的说明符。然而，专用 worker 默认具有位置和此功能。

```ts
// 好
new Worker(import.meta.resolve("./worker.js"), { type: "module" });

// 不好
new Worker(import.meta.resolve("./worker.js"));
new Worker(import.meta.resolve("./worker.js"), { type: "classic" });
new Worker("./worker.js", { type: "module" });
```

与常规模块一样，你可以在 worker 模块中使用顶级 `await`。然而，你应该注意在第一个
`await` 之前注册消息处理程序，否则可能会丢失消息。这不是 Deno 的
bug，这只是功能之间的不幸交互，所有支持模块 worker 的浏览器中也会发生这种情况。

```ts
import { delay } from "jsr:@std/async@1/delay";

// 第一个 await：等待一秒钟，然后继续运行模块。
await delay(1000);

// 消息处理程序仅在该 1 秒延迟后设置，因此在该秒内到达 worker 的一些消息可能在未注册处理程序时被触发。
self.onmessage = (evt) => {
  console.log(evt.data);
};
```

### 实例化权限

创建新的 `Worker` 实例类似于动态导入；因此 Deno 需要适当的权限来执行此操作。

对于使用本地模块的 worker，需要 `--allow-read` 权限：

```ts title="main.ts"
new Worker(import.meta.resolve("./worker.ts"), { type: "module" });
```

```ts title="worker.ts"
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
错误：未捕获的 PermissionDenied：读取 "./worker.ts" 的权限，请使用 --allow-read 标志重新运行

$ deno run --allow-read main.ts
hello world
```

对于使用远程模块的 worker，需要 `--allow-net` 权限：

```ts title="main.ts"
new Worker("https://example.com/worker.ts", { type: "module" });
```

```ts title="worker.ts"
// 此文件托管在 https://example.com/worker.ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
错误：未捕获的 PermissionDenied：访问 "https://example.com/worker.ts" 的网络权限，请使用 --allow-net 标志重新运行

$ deno run --allow-net main.ts
hello world
```

### 在 worker 中使用 Deno

```js title="main.js"
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});

worker.postMessage({ filename: "./log.txt" });
```

```js title="worker.js"
self.onmessage = async (e) => {
  const { filename } = e.data;
  const text = await Deno.readTextFile(filename);
  console.log(text);
  self.close();
};
```

```text title="log.txt"
hello world
```

```shell
$ deno run --allow-read main.js
hello world
```

### 指定 worker 权限

:::caution

这是 Deno 的不稳定功能。了解更多关于
[不稳定功能](/runtime/fundamentals/stability_and_releases/#unstable-apis)
的信息。

:::

worker 可用的权限类似于 CLI 权限标志，这意味着在那里启用的每个权限都可以在
Worker API 的级别上禁用。你可以在这里找到每个权限选项的更详细描述
[这里](/runtime/fundamentals/security/)。

默认情况下，worker 会从其创建线程继承权限，但为了允许用户限制此 worker
的访问权限，我们在 worker API 中提供了 `deno.permissions` 选项。

对于支持细粒度访问的权限，你可以传递一个 worker
将有权访问的所需资源列表，而对于只有开/关选项的权限，你可以分别传递 true/false：

```ts
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      net: [
        "deno.land",
      ],
      read: [
        new URL("./file_1.txt", import.meta.url),
        new URL("./file_2.txt", import.meta.url),
      ],
      write: false,
    },
  },
});
```

细粒度访问权限接收绝对和相对路径作为参数，但请注意，相对路径将相对于实例化
worker 的文件解析，而不是 worker 文件当前所在的路径：

```ts
const worker = new Worker(
  new URL("./worker/worker.js", import.meta.url).href,
  {
    type: "module",
    deno: {
      permissions: {
        read: [
          "/home/user/Documents/deno/worker/file_1.txt",
          "./worker/file_2.txt",
        ],
      },
    },
  },
);
```

`deno.permissions` 及其子项都支持 `"inherit"` 选项，这意味着它将继承其父权限：

```ts
// 此 worker 将继承其父权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: "inherit",
  },
});
```

```ts
// 此 worker 将仅继承其父的网络权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      env: false,
      hrtime: false,
      net: "inherit",
      ffi: false,
      read: false,
      run: false,
      write: false,
    },
  },
});
```

未指定 `deno.permissions` 选项或其子项将导致 worker 默认继承：

```ts
// 此 worker 将继承其父权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});
```

```ts
// 此 worker 将继承其父的所有权限，但网络权限除外
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      net: false,
    },
  },
});
```

你可以通过将 `"none"` 传递给 `deno.permissions` 选项来完全禁用 worker 的权限：

```ts
// 此 worker 将没有任何权限启用
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: "none",
  },
});
```

## 其他 API 与规范的差异

### Cache API

仅实现了以下 API：

- [CacheStorage::open()](https://developer.mozilla.org/zh-CN/docs/Web/API/CacheStorage/open)
- [CacheStorage::has()](https://developer.mozilla.org/zh-CN/docs/Web/API/CacheStorage/has)
- [CacheStorage::delete()](https://developer.mozilla.org/zh-CN/docs/Web/API/CacheStorage/delete)
- [Cache::match()](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache/match)
- [Cache::put()](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache/put)
- [Cache::delete()](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache/delete)

与浏览器相比，有几点不同：

1. 你不能向 API 传递相对路径。请求可以是 Request 或 URL 的实例，也可以是 URL
   字符串。
2. `match()` 和 `delete()` 尚不支持查询选项。
