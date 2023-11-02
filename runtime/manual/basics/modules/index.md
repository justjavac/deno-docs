# Deno 中的 ECMAScript 模块

## 概念

- [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
  允许你在本地文件系统或远程地方引入和使用模块。
- Imports 是 URL 或文件系统路径。
- [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
  允许你指定哪些模块部分对导入模块的用户可访问。

## 概述

Deno 默认标准化了 JavaScript 和 TypeScript 中模块的导入，使用了 ECMAScript 6
`import/export` 标准。

它采用类似浏览器的模块解析，意味着文件名必须被完整指定。你不能省略文件扩展名，也没有特殊处理
`index.js`。

```js, ignore
import { add, multiply } from "./arithmetic.ts";
```

依赖项也直接导入，没有包管理开销。本地模块和远程模块的导入方式完全相同。正如下面的示例所示，相同的功能可以通过本地或远程模块以相同的方式实现。

## 本地导入

在这个示例中，`add` 和 `multiply` 函数从本地的 `arithmetic.ts` 模块导入。

**命令：** `deno run local.ts`

```ts, ignore
/**
 * local.ts
 */
import { add, multiply } from "./arithmetic.ts";

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

## 远程导入

在上面的本地导入示例中，从本地存储的算术模块导入了 `add` 和 `multiply`
方法。相同的功能也可以通过从远程模块导入 `add` 和 `multiply` 方法来实现。

在这种情况下，引用了 Ramda 模块，包括版本号。还要注意，JavaScript 模块直接导入到
TypeScript 模块中，Deno 可以轻松处理这一点。

**命令：** `deno run ./remote.ts`

```ts
/**
 * remote.ts
 */
import {
  add,
  multiply,
} from "https://x.nest.land/ramda@0.27.0/source/index.js";

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

## 导出

在上面的本地导入示例中，`add` 和 `multiply`
函数是从本地存储的算术模块导入的。为了实现这一点，必须导出存储在算术模块中的函数。

只需在函数签名的开头添加关键字 `export`，如下所示。

```ts
/**
 * arithmetic.ts
 */
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
```

所有需要在外部模块中访问的函数、类、常量和变量都必须被导出。可以通过在它们前面加上
`export` 关键字或在文件底部的导出语句中包含它们来实现。
