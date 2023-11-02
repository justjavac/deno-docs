# 使用 deno-dom 与 Deno

[deno-dom](https://deno.land/x/deno_dom) 是 Deno 中的 DOM 和 HTML
解析器的实现。它是使用 Rust（通过 Wasm）和 TypeScript
实现的。还有一个“本地”实现，利用了 FFI 接口。

deno-dom 的目标是规范合规性，类似于 jsdom，不同于
LinkeDOM。目前，对于诸如解析数据结构之类的操作，deno-dom 比 LinkeDOM
慢，但在某些操作上更快。无论是 deno-dom 还是 LinkeDOM，都比 jsdom 快得多。

截止到 deno_dom v0.1.22-alpha，支持在 Deno Deploy
上运行。因此，如果您想要严格的标准对齐，请考虑使用 deno-dom 而不是 LinkeDOM。

## 基本示例

这个示例将接受一个测试字符串，将其解析为 HTML 并生成基于它的 DOM
结构。然后，它将查询该 DOM
结构，选择出它遇到的第一个标题，并打印出该标题的文本内容：

```ts
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
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

> 注意：示例使用了 `deno_land/x`
> 的未固定版本，这可能不是您想要的，因为版本可能会更改并引起意外的结果。您应该使用可用的
> [deno-dom](https://deno.land/x/deno_dom) 的最新版本。

## 更快的启动

仅导入 `deno-dom-wasm.ts` 文件会通过顶级等待引导 Wasm
代码。问题是，顶级等待会阻止模块加载过程。特别是对于大型 Wasm
项目，更加高效的方式是在模块加载完成后初始化 Wasm。

_deno-dom_ 对此有解决方案，它们提供了一个库的替代版本，不会自动初始化
Wasm，而需要您在代码中执行：

```ts
import {
  DOMParser,
  initParser,
} from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";

(async () => {
  // 在需要时初始化，但不是在顶级
  await initParser();

  const doc = new DOMParser().parseFromString(
    `<h1>Lorem ipsum dolor...</h1>`,
    "text/html",
  );
})();
```

此外，使用 `deno-dom-native.ts`（需要 `--allow-ffi` 标志）将绕过 Wasm
启动的开销，也不需要 `init()` 启动时间。这只适用于 Deno CLI，不适用于 Deploy。
