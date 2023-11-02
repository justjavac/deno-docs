# 使用 LinkeDOM 与 Deno

[LinkeDOM](https://github.com/WebReflection/linkedom) 是一种类似于 DOM
的命名空间，可用于像 Deno 这样不实现 DOM 的环境。

LinkeDOM 专注于速度和实现对服务器端渲染有用的功能。它可能允许您执行无效的 DOM
操作。[deno-dom](./deno_dom.md) 和 [jsdom](./jsdom.md)
专注于正确性。虽然目前在某些情况下 deno-dom 比 LinkeDOM 慢，但两者都比 jsdom
快得多，因此如果您需要正确性或与服务器端渲染无关的功能，请考虑使用 deno-dom。

虽然 LinkeDOM 在 Deno CLI 下运行，但它不进行类型检查。虽然在像 VSCode
这样的编辑器中使用提供的类型效果很好，但尝试在运行时像 Deno
默认情况下所做的那样进行严格类型检查将失败。如果您使用 `tsc`
进行代码类型检查也是一样的。维护者已经表示他们对修复这个问题不感兴趣。这意味着对于
Deno，您需要使用 `--no-check=remote` 以避免诊断停止执行您的程序。

LinkedDOM 可在 Deno Deploy 下运行，以及 deno_dom，但 jsdom 不行。

## 基本示例

此示例将采用测试字符串并将其解析为 HTML，然后基于其生成 DOM 结构。然后查询该 DOM
结构，选择遇到的第一个标题并打印出该标题的文本内容：

```ts
import { DOMParser } from "https://esm.sh/linkedom";
import { assert } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";

const document = new DOMParser().parseFromString(
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
  "text/html",
);

assert(document);
const h1 = document.querySelector("h1");
assert(h1);

console.log(h1.textContent);
```

## 替代 API

对于 `parseHTML()` 可更适合某些服务器端渲染工作负载。这类似于 jsdom 的 `JSDOM()`
函数，因为它为您提供了一个可以用来访问文档范围之外的 API 的 "沙盒"，例如
`window` 范围。例如：

```ts, ignore
import { parseHTML } from "https://esm.sh/linkedom";

const { document, customElements, HTMLElement } = parseHTML(`<!DOCTYPE html>
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
  </html>`);

customElements.define(
  "custom-element",
  class extends HTMLElement {
    connectedCallback() {
      console.log("it works 🥳");
    }
  },
);

document.body.appendChild(document.createElement("custom-element"));

document.toString(); // 文档的字符串，准备发送给客户端
```
