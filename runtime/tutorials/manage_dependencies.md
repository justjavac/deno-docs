# 管理依赖

## 概念

- Deno 使用 URL 来进行依赖管理。
- 一个常见的约定是将所有这些依赖的 URL 放入一个本地的 `deps.ts` 文件中。
  功能然后从 `deps.ts` 导出供本地模块使用。
- 持续遵循这一约定，只有开发时依赖可以保存在 `dev_deps.ts` 文件中。
- 另请参阅 [模块](../manual/basics/modules/index.md)

## 概述

在 Deno 中，没有包管理器的概念，外部模块会
直接导入到本地模块中。这引发了如何管理 没有包管理器的远程依赖的问题。在具有许多
依赖项的大型项目中，如果它们都单独导入到各个模块中， 更新模块将变得繁琐和耗时。

在 Deno 中解决这个问题的标准做法是创建一个 `deps.ts`
文件。这个文件中引用了所有必需的远程依赖，以及
必需的方法和类都被重新导出。然后，依赖的本地模块 引用
`deps.ts`，而不是远程依赖。如果现在，例如
一个远程依赖在多个文件中使用，升级到新版本的
这个远程依赖就变得简单得多，因为可以在 `deps.ts` 中完成。

将所有依赖项集中在 `deps.ts` 中，管理这些依赖项变得更容易。
开发依赖项也可以在单独的 `dev_deps.ts` 文件中进行管理，允许
开发依赖和生产依赖之间进行清晰分离。

## 示例

```ts
/**
 * deps.ts
 *
 * 此模块重新导出了来自依赖的远程 Ramda 模块的所需方法。
 */
export {
  add,
  multiply,
} from "https://x.nest.land/ramda@0.27.0/source/index.js";
```

在这个示例中，与 [本地和远程导入示例](../manual/basics/modules/index.md)
中的情况相同， 但在这种情况下，Ramda 模块不是直接引用，而是通过本地的 `deps.ts`
模块引用。

**命令：** `deno run example.ts`

```ts, ignore
/**
 * example.ts
 */

import { add, multiply } from "./deps.ts";

function totalCost(outbound: number, inbound: number, tax: number): number {
  return multiply(add(outbound, inbound), tax);
}

console.log(totalCost(19, 31, 1.2));
console.log(totalCost(45, 27, 1.15));

/**
 * 输出
 *
 * 60
 * 82.8
 */
```
