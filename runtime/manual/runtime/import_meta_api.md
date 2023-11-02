# `import.meta` API

Deno 支持一系列方法，用于
[`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta)
API：

- `import.meta.url`：返回当前模块的 URL。
- `import.meta.main`：返回当前模块是否是程序的入口点。
- `import.meta.resolve`：相对于当前模块解析规范。

## `import.meta.resolve` 示例

```ts
const worker = new Worker(import.meta.resolve("./worker.ts"));
```

`import.meta.resolve` API 考虑了当前应用的导入映射，这使您能够解析“裸”规范。

有了这样的导入映射加载...

```json
{
  "imports": {
    "fresh": "https://deno.land/x/fresh@1.0.1/dev.ts"
  }
}
```

...现在您可以解析：

```js
// resolve.js
console.log(import.meta.resolve("fresh"));
```

```sh
$ deno run resolve.js
https://deno.land/x/fresh@1.0.1/dev.ts
```
