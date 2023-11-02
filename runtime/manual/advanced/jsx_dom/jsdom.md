# 在 Deno 中使用 jsdom

[jsdom](https://github.com/jsdom/jsdom) 是许多 Web 标准的纯 JavaScript
实现，特别是 WHATWG DOM 和 HTML
标准。它的主要目标是全面和符合标准，不专门考虑性能。

如果你对服务器端渲染感兴趣，那么[deno-dom](./deno_dom.md) 和
[LinkeDOM](./linkedom.md)
都是更好的选择。如果你试图在一个“虚拟”浏览器中运行代码，需要符合标准，那么 jsdom
可能适合你。

虽然 jsdom 在 Deno CLI 下工作，但它不进行类型检查。这意味着你必须在命令行上使用
`--no-check=remote` 选项，以避免诊断停止程序的执行。

在编辑器中具有良好的类型和智能自动完成需要一些额外的步骤，因为 jsdom
类型的提供方式被声明为全局类型定义，以及利用内置 DOM 库中的内置类型。

这意味着，如果你希望在使用 Deno
语言服务器的同时在编辑器中获得强类型和智能自动完成，你需要执行一些额外的步骤。

### 定义 `import_map.json`

你需要将裸导入符号 `"jsdom"` 映射到 jsdom 的导入版本。这允许 Deno
正确应用类型到导入，就像它们被指定的那样。

```json
{
  "jsdom": "https://esm.sh/jsdom"
}
```

### 设置配置文件

你将希望在工作区的根目录中设置一个 `deno.jsonc` 配置文件，其中包括 TypeScript
库信息以及上面定义的导入映射：

```jsonc
{
  "compilerOptions": {
    "lib": [
      "deno.ns",
      "dom",
      "dom.iterable",
      "dom.asynciterable"
    ]
  },
  "importMap": "./import_map.json"
}
```

> 注意：上面我们使用了一个不固定版本的
> jsdom。你应该考虑将版本固定在你想要使用的版本上。

## 基本示例

这个示例将获取一个测试字符串，并将其解析为 HTML，然后生成一个基于它的 DOM
结构。然后查询该 DOM 结构，选择出它遇到的第一个标题，并打印出该标题的文本内容：

```ts, ignore
import { JSDOM } from "jsdom";
import { assert } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";

const { window: { document } } = new JSDOM(
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Hello from Deno</title>
  </head>
  <body>
    <h1>Hello from Deno</h1>
    <form>
      <input name="user">
      <button>
        Submit
      </button>
    </form>
  </body>
</html>`,
  {
    url: "https://example.com/",
    referrer: "https://example.org/",
    contentType: "text/html",
    storageQuota: 10000000,
  },
);

const h1 = document.querySelector("h1");
assert(h1);

console.log(h1.textContent);
```
