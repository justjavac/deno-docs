# 模块元数据

## 概念

- [import.meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)
  可以提供有关模块上下文的信息。
- 布尔值 [import.meta.main](https://deno.land/api?s=ImportMeta#prop_main)
  将告诉您当前模块是否是程序入口点。
- 字符串 [import.meta.url](https://deno.land/api?s=ImportMeta#prop_url) 将
  提供当前模块的 URL。
- [import.meta.resolve](https://deno.land/api?s=ImportMeta#prop_resolve)
  允许您解析相对于当前模块的规范。此函数
  考虑了导入映射（如果在启动时提供了映射）。
- 字符串 [Deno.mainModule](https://deno.land/api?s=Deno.mainModule) 将
  提供主模块入口点的 URL，即由 Deno 运行时调用的模块。

## 示例

下面的示例使用两个模块来展示 `import.meta.url`，`import.meta.main` 和
`Deno.mainModule` 之间的差异。在此示例中， `module_a.ts` 是主模块入口点：

```ts title="module_b.ts"
export function outputB() {
  console.log("模块B的import.meta.url", import.meta.url);
  console.log("模块B的mainModule URL", Deno.mainModule);
  console.log(
    "通过import.meta.main确定模块B是否为主模块？",
    import.meta.main,
  );
}
```

```ts title="module_a.ts"
import { outputB } from "./module_b.ts";

function outputA() {
  console.log("模块A的import.meta.url", import.meta.url);
  console.log("模块A的mainModule URL", Deno.mainModule);
  console.log(
    "通过import.meta.main确定模块A是否为主模块？",
    import.meta.main,
  );
  console.log(
    "解析./module_b.ts的规范",
    import.meta.resolve("./module_b.ts"),
  );
}

outputA();
console.log("");
outputB();
```

如果 `module_a.ts` 位于 `/home/alice/deno`，则
`deno run --allow-read module_a.ts` 的输出是：

```
模块A的import.meta.url 文件:///home/alice/deno/module_a.ts
模块A的mainModule URL 文件:///home/alice/deno/module_a.ts
通过import.meta.main确定模块A是否为主模块？ true
解析./module_b.ts的规范 文件:///home/alice/deno/module_b.ts

模块B的import.meta.url 文件:///home/alice/deno/module_b.ts
模块B的mainModule URL 文件:///home/alice/deno/module_a.ts
通过import.meta.main确定模块B是否为主模块？ false
```
