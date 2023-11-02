# Workers

Deno 支持
[`Web Worker API`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)。

工作线程可用于在多个线程上运行代码。每个 `Worker`
实例都在一个单独的线程上运行，专门为该工作线程提供服务。

目前，Deno 仅支持 `module` 类型的工作线程；因此，在创建新工作线程时，必须传递
`type: "module"` 选项。

在主工作线程中使用相对模块规范符仅受支持于通过 CLI 传递
`--location <href>`。这不建议用于可移植性。相反，您可以使用 `URL` 构造函数和
`import.meta.url`
轻松创建附近脚本的规范符。但是，专用工作线程默认具有位置和此功能。

```ts
// Good
new Worker(new URL("./worker.js", import.meta.url).href, { type: "module" });

// Bad
new Worker(new URL("./worker.js", import.meta.url).href);
new Worker(new URL("./worker.js", import.meta.url).href, { type: "classic" });
new Worker("./worker.js", { type: "module" });
```

与常规模块一样，您可以在工作线程模块中使用顶层 `await`。但是，务必在第一个
`await` 之前始终注册消息处理程序，否则消息可能会丢失。这不是 Deno
中的错误，这只是功能交互的不幸，它也会在支持模块工作线程的所有浏览器中发生。

```ts, ignore
import { delay } from "https://deno.land/std@$STD_VERSION/async/delay.ts";

// 第一个 await：等待一秒，然后继续运行模块。
await delay(1000);

// 消息处理程序仅在 1 秒延迟之后设置，因此在那一秒内到达工作线程的某些消息可能在没有注册处理程序时被触发。
self.onmessage = (evt) => {
  console.log(evt.data);
};
```

## 实例化权限

创建新的 `Worker` 实例类似于动态导入；因此，Deno 需要适当的权限来执行此操作。

对于使用本地模块的工作线程，需要 `--allow-read` 权限：

**main.ts**

```ts
new Worker(new URL("./worker.ts", import.meta.url).href, { type: "module" });
```

**worker.ts**

```ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: read access to "./worker.ts", run again with the --allow-read flag

$ deno run --allow-read main.ts
hello world
```

对于使用远程模块的工作线程，需要 `--allow-net` 权限：

**main.ts**

```ts
new Worker("https://example.com/worker.ts", { type: "module" });
```

**worker.ts**（位于 https://example.com/worker.ts）

```ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: net access to "https://example.com/worker.ts", run again with the --allow-net flag

$ deno run --allow-net main.ts
hello world
```

## 在工作线程中使用 Deno

> 从 v1.22 开始，`Deno`
> 命名空间默认在工作线程范围内可用。要在较早版本中启用命名空间，请在创建新工作线程时传递
> `deno: { namespace: true }`。

**main.js**

```js
const worker = new Worker(new URL("./worker.js", import.meta.url).href, {
  type: "module",
});

worker.postMessage({ filename: "./log.txt" });
```

**worker.js**

```js, ignore
self.onmessage = async (e) => {
  const { filename } = e.data;
  const text = await Deno.readTextFile(filename);
  console.log(text);
  self.close();
};
```

**log.txt**

```
hello world
```

```shell
$ deno run --allow-read main.js
hello world
```

> 从 v1.23 开始，`Deno.exit()` 不再以提供的退出代码退出进程。而是是
> `self.close()` 的别名，仅导致工作线程关闭。这更符合 Web
> 平台，因为在浏览器中，工作线程无法关闭页面。

## 指定工作线程权限

> 这是 Deno 的不稳定功能。了解更多关于 [不稳定特性](./stability.md)。

工作线程的权限与 CLI 权限标志类似，这意味着在 Worker API
级别可以禁用每个启用的权限。您可以在 [这里](../basics/permissions.md)
找到每个权限选项的更详细描述。

默认情况下，工作线程将继承它所创建的线程的权限，但为了允许用户限制该工作线程的访问权限，我们在工作线程
API 中提供了 `deno.permissions` 选项。

- 对于支持粒度访问的权限，您可以传递工作线程将具有访问权限的所需资源列表，对于只有开/关选项的权限，您可以传递
  true/false 分别。

  ```ts
  const worker = new Worker(new URL("./worker.js", import.meta.url).href, {
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

- 粒度访问权限接受绝对路由和相对路由作为参数，但要注意，相对路由将相对于实例化工作线程的文件进行解析，而不是工作线程文件当前的路径。

  ```ts
  const worker = new Worker(
    new URL("./worker/
  ```

worker.js", import.meta.url).href, { type: "module", deno: { permissions: {
read: [ "/home/user/Documents/deno/worker/file_1.txt", "./worker/file_2.txt", ],
}, }, }, );

````
- `deno.permissions` 及其子级都支持选项 `"inherit"`，这意味着它将借用其父权限。

```ts
// 此工作线程将继承其父权限
const worker = new Worker(new URL("./worker.js", import.meta.url).href, {
  type: "module",
  deno: {
    permissions: "inherit",
  },
});
````

```ts
// 此工作线程将仅继承其父的 net 权限
const worker = new Worker(new URL("./worker.js", import.meta.url).href, {
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

- 如果不指定 `deno.permissions`
  选项或其子级中的某个选项，工作线程将默认继承权限。

  ```ts
  // 此工作线程将继承其父权限
  const worker = new Worker(new URL("./worker.js", import.meta.url).href, {
    type: "module",
  });
  ```

  ```ts
  // 此工作线程将继承其父的所有权限，除了 net 权限
  const worker = new Worker(new URL("./worker.js", import.meta.url).href, {
    type: "module",
    deno: {
      permissions: {
        net: false,
      },
    },
  });
  ```

- 您可以通过将 `"none"` 传递给 `deno.permissions` 选项来完全禁用工作线程的权限。

  ```ts
  // 此工作线程将不具备任何权限
  const worker = new Worker(new URL("./worker.js", import.meta.url).href, {
    type: "module",
    deno: {
      permissions: "none",
    },
  });
  ```
