---
title: "模块元数据"
url: /examples/module_metadata_tutorial/
oldUrl:
  - /runtime/manual/examples/module_metadata/
  - /runtime/tutorials/module_metadata/
---

## 概念

- [import.meta](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import.meta)
  可以提供模块上下文的信息。
- 布尔值
  [import.meta.main](https://docs.denohub.com/api/web/~/ImportMeta#property_main)
  可以让你知道当前模块是否是程序的入口点。
- 字符串
  [import.meta.url](https://docs.denohub.com/api/web/~/ImportMeta#property_url)
  会给出当前模块的 URL。
- 字符串
  [import.meta.filename](https://docs.denohub.com/api/web/~/ImportMeta#property_filename)
  会给出当前模块的完全解析路径。_仅适用于本地模块_。
- 字符串
  [import.meta.dirname](https://docs.denohub.com/api/web/~/ImportMeta#property_dirname)
  会给出包含当前模块的目录的完全解析路径。_仅适用于本地模块_。
- [import.meta.resolve](https://docs.denohub.com/api/web/~/ImportMeta#property_resolve)
  允许你解析相对于当前模块的标识符。此函数会考虑启动时提供的导入映射（如果有）。
- 字符串 [Deno.mainModule](https://docs.denohub.com/api/deno/~/Deno.mainModule)
  会给出主模块入口点的 URL，即由 deno 运行时调用的模块。

## 示例

下面的示例使用两个模块来展示 `import.meta.url`、`import.meta.main` 和
`Deno.mainModule` 之间的区别。在此示例中，`module_a.ts` 是主模块入口点：

```ts title="module_b.ts"
export function outputB() {
  console.log("Module B's import.meta.url", import.meta.url);
  console.log("Module B's mainModule url", Deno.mainModule);
  console.log(
    "Is module B the main module via import.meta.main?",
    import.meta.main,
  );
}
```

```ts title="module_a.ts"
import { outputB } from "./module_b.ts";

function outputA() {
  console.log("Module A's import.meta.url", import.meta.url);
  console.log("Module A's mainModule url", Deno.mainModule);
  console.log(
    "Is module A the main module via import.meta.main?",
    import.meta.main,
  );
  console.log(
    "Resolved specifier for ./module_b.ts",
    import.meta.resolve("./module_b.ts"),
  );
}

outputA();
console.log("");
outputB();
```

如果 `module_a.ts` 位于 `/home/alice/deno`，那么
`deno run --allow-read module_a.ts` 的输出将是：

```console
Module A's import.meta.url file:///home/alice/deno/module_a.ts
Module A's mainModule url file:///home/alice/deno/module_a.ts
Is module A the main module via import.meta.main? true
Resolved specifier for ./module_b.ts file:///home/alice/deno/module_b.ts

Module B's import.meta.url file:///home/alice/deno/module_b.ts
Module B's mainModule url file:///home/alice/deno/module_a.ts
Is module B the main module via import.meta.main? false
```
