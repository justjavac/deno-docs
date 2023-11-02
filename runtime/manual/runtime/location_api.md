# Location API

Deno 支持来自 Web 的
[`location`](https://developer.mozilla.org/en-US/docs/Web/API/Window/location)
全局对象。请继续阅读。

## Location 标志

在 Deno 进程中，我们无法使用“网页”的 URL 作为 Location。相反，我们允许用户通过在
CLI 中指定 `--location` 标志来模拟文档 Location。它可以是 `http` 或 `https`
URL。

```ts
// deno run --location https://example.com/path main.ts

console.log(location.href);
// "https://example.com/path"
```

要使其工作，您必须传递 `--location <href>`。如果不传递，访问 `location`
全局对象将引发错误。

```ts
// deno run main.ts

console.log(location.href);
// error: Uncaught ReferenceError: Access to "location", run again with --location <href>.
```

在浏览器中，设置 `location` 或其字段通常会导致导航。在 Deno
中，这不适用，因此在这种情况下会引发错误。

```ts
// deno run --location https://example.com/path main.ts

location.pathname = "./foo";
// error: Uncaught NotSupportedError: Cannot set "location.pathname".
```

## 扩展用法

在网络上，资源解析（不包括模块）通常使用 `location.href` 的值作为任何相对 URL
的基础。这会影响 Deno 采用的某些网络 API。

### Fetch API

```ts
// deno run --location https://api.github.com/ --allow-net main.ts

const response = await fetch("./orgs/denoland");
// 获取 "https://api.github.com/orgs/denoland"。
```

上面的 `fetch()` 调用如果没有传递 `--location`
标志，将会引发错误，因为没有与网络相对应的位置用于基础。

### Worker 模块

```ts
// deno run --location https://example.com/index.html --allow-net main.ts

const worker = new Worker("./workers/hello.ts", { type: "module" });
// 获取 "https://example.com/workers/hello.ts" 处的 Worker 模块。
```

## 仅在必要时使用

对于上述用例，最好传递完整的 URL，而不是依赖于
`--location`。如果需要，您可以手动使用 `URL` 构造函数来构建相对 URL。

`--location`
标志适用于那些对模拟文档位置有特定目的并且了解这只能在应用程序级别工作的人。但是，您还可以使用它来消除依赖项无谓访问
`location` 全局对象时产生的错误。
