---
title: "标准库"
oldUrl: /runtime/manual/basics/standard_library/
---

Deno 提供了一个用 TypeScript
编写的标准库。它是一组可被程序重用的标准模块，使您能够专注于应用程序逻辑，而不必为常见任务“重新发明轮子”。Deno
标准库中的所有模块都经过核心团队的审核，并保证与 Deno 兼容，确保一致性和可靠性。

<a href="https://jsr.io/@std" class="docs-cta jsr-cta" aria-label="See all packages on JSR">查看
JSR 上的所有包
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg>
</a>

Deno 标准库中的许多包也与 Node.js、Cloudflare Workers 和其他 JavaScript
环境兼容。这使得您可以编写无需修改即可在多个环境中运行的代码。

标准库托管在 JSR
上，可通过以下地址访问：[https://jsr.io/@std](https://jsr.io/@std)。包已文档化、测试并包含使用示例。您可以在
JSR 上浏览标准库包的完整列表，以下是一些示例：

- [@std/path](https://jsr.io/@std/path)：路径操作工具，类似于 Node.js 的 `path`
  模块。
- [@std/jsonc](https://jsr.io/@std/jsonc)：支持注释的 JSON 序列化和反序列化。
- [@std/encoding](https://jsr.io/@std/encoding)：用于编码和解码常见格式（如
  hex、base64 和变体）的工具。

## 版本控制和稳定性

标准库的每个包都是独立版本化的。包遵循[语义版本控制规则](https://jsr.io/@std/semver)。您可以使用[版本锁定或版本范围](/runtime/fundamentals/modules/#package-versions)来防止主要版本更新影响您的代码。

## 导入标准库模块

要从 Deno 标准库安装包，您可以使用 `deno add` 子命令将包添加到您的 `deno.json`
导入映射中。

```sh
deno add jsr:@std/fs jsr:@std/path
```

`deno.json` 的 `imports` 字段将更新为包含这些导入：

```json
{
  "imports": {
    "@std/fs": "jsr:@std/fs@^1.0.2",
    "@std/path": "jsr:@std/path@^1.0.3"
  }
}
```

然后您可以在源代码中导入这些包：

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```

或者，您可以直接使用 `jsr:` 说明符导入模块：

```js
import { copy } from "jsr:@std/fs@^1.0.2";
import { join } from "jsr:@std/path@^1.0.3";

await copy("foo.txt", join("dist", "foo.txt"));
```

## Node.js 兼容性

Deno 标准库设计为与 Node.js、Cloudflare Workers 和其他 JavaScript
环境兼容。标准库用 TypeScript 编写并编译为 JavaScript，因此可以在任何 JavaScript
环境中使用。

```sh
npx jsr add @std/fs @std/path
```

运行此命令将把这些包添加到您的 `package.json` 中：

```json
{
  "dependencies": {
    "@std/fs": "npm:@jsr/std__fs@^1.0.2",
    "@std/path": "npm:@jsr/std__path@^1.0.3"
  }
}
```

然后您可以像使用任何其他 Node.js 包一样在源代码中导入它们。TypeScript
会自动找到这些包的类型定义。

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```
