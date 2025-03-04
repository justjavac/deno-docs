---
title: "文档测试"
oldUrl: /runtime/manual/testing/documentation/
---

Deno 支持对文档示例进行类型检查和评估。

这确保了文档中的示例是最新的且可用的。

基本思想如下：

````ts
/**
 * # 示例
 *
 * ```ts
 * const x = 42;
 * ```
 */
````

三重反引号标记代码块的开始和结束，语言由语言标识符属性确定，可以是以下任意一种：

- `js`
- `javascript`
- `mjs`
- `cjs`
- `jsx`
- `ts`
- `typescript`
- `mts`
- `cts`
- `tsx`

如果未指定语言标识符，则从提取代码块的源文档的媒体类型推断语言。

另一个支持的属性是 `ignore`，它告诉测试运行器跳过对该代码块的类型检查。

````ts
/**
 * # 未通过类型检查
 *
 * ```typescript ignore
 * const x: string = 42;
 * ```
 */
````

如果此示例位于名为 foo.ts 的文件中，运行 `deno test --doc foo.ts`
将提取此示例，然后将其作为独立模块进行类型检查和评估，该模块位于被记录模块的同一目录中。

要记录你的导出，请使用相对路径说明符导入模块：

````ts
/**
 * # 示例
 *
 * ```ts
 * import { foo } from "./foo.ts";
 * ```
 */
export function foo(): string {
  return "foo";
}
````
