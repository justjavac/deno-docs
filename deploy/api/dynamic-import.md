---
title: "动态导入"
---

Deno Deploy 支持 [动态导入]，但有一些限制。本页概述了这些限制。

### 说明符必须是静态确定的字符串字面量

在通常的动态导入中，说明符不需要在构建时确定。因此，以下所有形式都是有效的：

```ts title="Deno CLI 中的有效动态导入"
// 1. 静态确定的字符串字面量
await import("jsr:@std/assert");

// 2. 静态确定，但通过变量
const specifier = "jsr:@std/assert";
await import(specifier);

// 3. 静态确定，但使用模板字面量
const stdModuleName = "path";
await import(`jsr:@std/${stdModuleName}`);

// 4. 动态确定
const rand = Math.random();
const mod = rand < 0.5 ? "npm:cowsay" : "npm:node-emoji";
await import(mod);
```

然而，在 Deno Deploy
中，说明符必须是不带字符串插值的字符串字面量。因此，在上述三个示例中，只有第一个在
Deno Deploy 中有效。

```ts title="Deno Deploy 中仅静态字符串字面量有效"
// 1. ✅ 在 Deno Deploy 中正常工作
await import("jsr:@std/assert");

// 2. ❌ 在 Deno Deploy 中无效
// 因为传递给 `import` 的是一个变量
const specifier = "jsr:@std/streams";
await import(specifier);

// 3. ❌ 在 Deno Deploy 中无效
// 因为这里有一个插值
const stdModuleName = "path";
await import(`jsr:@std/${stdModuleName}`);

// 4. ❌ 在 Deno Deploy 中无效
// 因为它是动态的
const rand = Math.random();
const mod = rand < 0.5 ? "npm:cowsay" : "npm:node-emoji";
await import(mod);
```

### 一个例外 - dynamic 说明符对同一项目中的文件有效

如果目标文件（模块）包含在同一项目中，则支持动态确定的说明符。

```ts title="同一项目中的动态说明符有效"
// ✅ 在 Deno Deploy 中正常工作
await import("./my_module1.ts");

// ✅ 在 Deno Deploy 中正常工作
const rand = Math.random();
const modPath = rand < 0.5 ? "dir1/moduleA.ts" : "dir2/dir3/moduleB.ts";
await import(`./${modPath}`);
```

请注意，以 `./`
开头的模板字面量告诉模块解析器目标模块在同一项目中。相反，如果说明符不以 `./`
开头，则可能的目标模块将不会包含在生成的 [eszip]
中，导致动态导入在运行时失败，即使最终评估的说明符以 `./` 开头。

```ts
// ❌ 无效，因为分析器无法静态确定说明符是否以 `./` 开头。
// 将此与前一个示例进行比较。唯一的区别是是否将 `./` 放在模板字面量中或变量中。
const rand = Math.random();
const modPath = rand < 0.5 ? "./dir1/moduleA.ts" : "./dir2/dir3/moduleB.ts";
await import(modPath);
```

我们将考虑是否可以在未来放宽此限制。

:::tip 什么是 eszip？

当你在 Deno Deploy
上进行新部署时，系统会分析你的代码，通过递归遍历构建模块图，并将所有依赖项打包到一个文件中。我们称之为
[eszip](https://github.com/denoland/eszip)。由于它的创建是完全静态完成的，因此在
Deno Deploy 上动态导入的能力有限。

:::

### 数据 URL

[数据 URL] 可以用作传递给动态导入的说明符。

```ts title="静态数据 URL"
// ✅ 在 Deno Deploy 中正常工作
const { val } = await import(
  "data:text/javascript,export const val = 42;"
);
console.log(val); // -> 42
```

对于数据 URL，支持完全动态的数据。

```ts title="动态数据 URL"
function generateDynamicDataUrl() {
  const moduleStr = `export const val = ${Math.random()};`;
  return `data:text/javascript,${moduleStr}`;
}

// ✅ 在 Deno Deploy 中正常工作
const { val } = await import(generateDynamicDataUrl());
console.log(val); // -> 打印随机值
```

将此技术应用于从网络获取的 JavaScript 代码，你甚至可以模拟真正的动态导入：

```js title="external.js"
export const name = "external.js";
```

```ts title="从获取的源生成动态数据 URL"
import { assert } from "jsr:@std/assert/assert";
const res = await fetch(
  "https://gist.githubusercontent.com/magurotuna/1cacb136f9fd6b786eb8bbad92c8e6d6/raw/56a96fd0d246fd3feabbeecea6ea1155bdf5f50d/external.js",
);
assert(res.ok);
const src = await res.text();
const dataUrl = `data:application/javascript,${src}`;

// ✅ 在 Deno Deploy 中正常工作
const { name } = await import(dataUrl);
console.log(`Hello from ${name}`); // -> "Hello from external.js"
```

但是，请注意，传递给 `import` 的数据 URL 必须是 JavaScript；如果传递的是
TypeScript，则会在运行时抛出 [TypeError]。

[动态导入]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[eszip]: https://github.com/denoland/eszip
[数据 URL]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
[TypeError]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
