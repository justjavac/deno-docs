---
title: "Deno 风格指南"
oldUrl:
- /runtime/manual/contributing/style_guide/
- /runtime/manual/references/contributing/style_guide/
---

:::note

请注意，这是 Deno 运行时和 Deno 标准库中**内部运行时代码**的风格指南。这并不是为
Deno 用户提供的通用风格指南。

:::

### 版权声明

仓库中的大多数模块应包含以下版权声明：

```ts
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
```

如果代码源自其他地方，请确保文件包含正确的版权声明。我们只允许 MIT、BSD 和
Apache 许可的代码。

### 文件名中使用下划线而非连字符

示例：使用 `file_server.ts` 而不是 `file-server.ts`。

### 为新功能添加测试

每个模块应包含或附带其公共功能的测试。

### TODO 注释

TODO 注释通常应包含问题编号或作者的 GitHub 用户名（括号内）。示例：

```ts
// TODO(ry): 添加测试。
// TODO(#123): 支持 Windows。
// FIXME(#349): 有时会崩溃。
```

### 不鼓励使用元编程，包括 Proxy

即使意味着编写更多代码，也要保持明确。

在某些情况下，使用这些技术可能是有意义的，但在绝大多数情况下并不适用。

### 包容性代码

请遵循
https://chromium.googlesource.com/chromium/src/+/HEAD/styleguide/inclusive_code.md
中概述的包容性代码指南。

### Rust

遵循 Rust 的约定并与现有代码保持一致。

### TypeScript

代码库中的 TypeScript 部分是标准库 `std`。

#### 使用 TypeScript 而非 JavaScript

#### 不要使用文件名 `index.ts`/`index.js`

Deno 不会以特殊方式处理 "index.js" 或
"index.ts"。使用这些文件名会暗示在模块说明符中可以省略它们，但实际上不能。这会造成混淆。

如果代码目录需要一个默认入口点，请使用文件名 `mod.ts`。文件名 `mod.ts` 遵循 Rust
的约定，比 `index.ts` 更短，并且不会带来任何关于其工作方式的先入为主的观念。

#### 导出函数：最多 2 个参数，其余放入 options 对象

在设计函数接口时，请遵循以下规则。

1. 作为公共 API 一部分的函数接受 0-2 个必需参数，加上（如有必要）一个 options
   对象（因此最多 3 个）。

2. 可选参数通常应放入 options 对象。

   如果只有一个可选参数，并且未来不太可能添加更多可选参数，那么不在 options
   对象中的可选参数可能是可以接受的。

3. 'options' 参数是唯一一个常规 'Object' 类型的参数。

   其他参数可以是对象，但它们必须与 'plain' Object
   运行时区分开来，通过以下方式之一：

   - 具有区分性的原型（例如 `Array`、`Map`、`Date`、`class MyThing`）。
   - 具有众所周知的符号属性（例如带有 `Symbol.iterator` 的可迭代对象）。

   这允许 API 以向后兼容的方式发展，即使 options 对象的位置发生变化。

```ts
// 错误：可选参数不在 options 对象中。（#2）
export function resolve(
  hostname: string,
  family?: "ipv4" | "ipv6",
  timeout?: number,
): IPAddress[] {}
```

```ts
// 正确。
export interface ResolveOptions {
  family?: "ipv4" | "ipv6";
  timeout?: number;
}
export function resolve(
  hostname: string,
  options: ResolveOptions = {},
): IPAddress[] {}
```

```ts
export interface Environment {
  [key: string]: string;
}

// 错误：`env` 可能是一个常规 Object，因此无法与 options 对象区分开来。（#3）
export function runShellWithEnv(cmdline: string, env: Environment): string {}

// 正确。
export interface RunShellOptions {
  env: Environment;
}
export function runShellWithEnv(
  cmdline: string,
  options: RunShellOptions,
): string {}
```

```ts
// 错误：超过 3 个参数（#1），多个可选参数（#2）。
export function renameSync(
  oldname: string,
  newname: string,
  replaceExisting?: boolean,
  followLinks?: boolean,
) {}
```

```ts
// 正确。
interface RenameOptions {
  replaceExisting?: boolean;
  followLinks?: boolean;
}
export function renameSync(
  oldname: string,
  newname: string,
  options: RenameOptions = {},
) {}
```

```ts
// 错误：参数过多。（#1）
export function pwrite(
  fd: number,
  buffer: ArrayBuffer,
  offset: number,
  length: number,
  position: number,
) {}
```

```ts
// 更好。
export interface PWrite {
  fd: number;
  buffer: ArrayBuffer;
  offset: number;
  length: number;
  position: number;
}
export function pwrite(options: PWrite) {}
```

注意：当其中一个参数是函数时，可以灵活调整顺序。参见示例如
[Deno.serve](https://docs.denohub.com/api/deno/~/Deno.serve),
[Deno.test](https://docs.denohub.com/api/deno/~/Deno.test),
[Deno.addSignalListener](https://docs.denohub.com/api/deno/~/Deno.addSignalListener)。
另见 [此推文](https://twitter.com/jaffathecake/status/1646798390355697664)。

#### 导出所有用作导出成员参数的接口

每当使用包含在导出成员的参数或返回类型中的接口时，应导出所使用的接口。以下是一个示例：

```ts
// my_file.ts
export interface Person {
  name: string;
  age: number;
}

export function createPerson(name: string, age: number): Person {
  return { name, age };
}

// mod.ts
export { createPerson } from "./my_file.ts";
export type { Person } from "./my_file.ts";
```

#### 最小化依赖；不要引入循环导入

尽管 `std`
没有外部依赖，但我们仍需小心保持内部依赖的简单和可管理。特别是，注意不要引入循环导入。

#### 如果文件名以下划线开头：`_foo.ts`，不要链接到它

在某些情况下，可能需要一个内部模块，但其 API
并不稳定或不应被链接。在这种情况下，请在其前面加上下划线。按照惯例，只有其所在目录中的文件应导入它。

#### 使用 JSDoc 记录导出的符号

我们力求完整的文档。每个导出的符号理想情况下都应有一行文档。

如果可能，使用单行 JSDoc。示例：

```ts
/** foo 执行 bar。 */
export function foo() {
  // ...
}
```

重要的是文档易于人类阅读，但也需要提供额外的样式信息以确保生成的文档更丰富。因此，JSDoc
通常应遵循 markdown 标记来丰富文本。

虽然 markdown 支持 HTML 标签，但在 JSDoc 块中禁止使用。

代码字符串文字应用反引号 (\`) 括起来，而不是引号。例如：

```ts
/** 从 `deno` 模块导入某些内容。 */
```

除非函数参数的含义不明显，否则不要记录它们（尽管如果它们的含义不明显，则应重新考虑
API）。因此，通常不应使用 `@param`。如果使用 `@param`，则不应包含 `type`，因为
TypeScript 已经是强类型的。

```ts
/**
 * 带有不明显参数的函数。
 * @param foo 对不明显参数的描述。
 */
```

应尽可能减少垂直间距。因此，单行注释应写成：

```ts
/** 这是一个好的单行 JSDoc。 */
```

而不是：

```ts
/**
 * 这是一个不好的单行 JSDoc。
 */
```

代码示例应使用 markdown 格式，如下所示：

````ts
/** 一个简单的注释和一个示例：
 * ```ts
 * import { foo } from "deno";
 * foo("bar");
 * ```
 */
````

代码示例不应包含额外的注释，并且不能缩进。它已经在注释中。如果需要进一步注释，则这不是一个好的示例。

#### 使用指令解决 linting 问题

目前，构建过程使用 `dlint` 来验证代码中的 linting 问题。如果任务需要不符合
linter 的代码，请使用 `deno-lint-ignore <code>` 指令来抑制警告。

```typescript
// deno-lint-ignore no-explicit-any
let x: any;
```

这确保持续集成过程不会因 linting 问题而失败，但应谨慎使用。

#### 每个模块应附带一个测试模块

每个具有公共功能的模块 `foo.ts` 应附带一个测试模块 `foo_test.ts`。`std`
模块的测试应放在 `std/tests`
中，因为它们处于不同的上下文中；否则，它应只是被测试模块的兄弟文件。

#### 单元测试应明确

为了更好地理解测试，函数应正确命名，如测试命令中提示的那样。例如：

```console
foo() 返回 bar 对象 ... 通过
```

测试示例：

```ts
import { assertEquals } from "@std/assert";
import { foo } from "./mod.ts";

Deno.test("foo() 返回 bar 对象", function () {
  assertEquals(foo(), { bar: "bar" });
});
```

注意：有关更多信息，请参见
[跟踪问题](https://github.com/denoland/deno_std/issues/3754)。

#### 顶级函数不应使用箭头语法

顶级函数应使用 `function` 关键字。箭头语法应仅限于闭包。

错误：

```ts
export const foo = (): string => {
  return "bar";
};
```

正确：

```ts
export function foo(): string {
  return "bar";
}
```

#### 错误消息

从 JavaScript / TypeScript
引发的面向用户的错误消息应清晰、简洁且一致。错误消息应使用句子大小写，但不应以句号结尾。错误消息应避免语法错误和拼写错误，并使用美式英语。

:::note

请注意，错误消息风格指南仍在进行中，并非所有错误消息都已更新以符合当前风格。

:::

应遵循的错误消息风格：

1. 消息应以大写字母开头：

```sh
错误：无法解析输入
正确：无法解析输入
```

2. 消息不应以句号结尾：

```sh
错误：无法解析输入。
正确：无法解析输入
```

3. 消息应对字符串值使用引号：

```sh
错误：无法解析输入 hello, world
正确：无法解析输入 "hello, world"
```

4. 消息应说明导致错误的操作：

```sh
错误：无效输入 x
正确：无法解析输入 x
```

5. 应使用主动语态：

```sh
错误：输入 x 无法解析
正确：无法解析输入 x
```

6. 消息不应使用缩写：

```sh
错误：无法解析输入 x
正确：无法解析输入 x
```

7. 消息在提供额外信息时应使用冒号。永远不要使用句号。其他标点符号可根据需要使用：

```sh
错误：无法解析输入 x。值为空
正确：无法解析输入 x：值为空
```

8. 额外信息应描述当前状态，如果可能，还应以肯定语态描述期望状态：

```sh
错误：无法计算 x 的平方根：值不能为负
正确：无法计算 x 的平方根：当前值为 ${x}
更好：无法计算 x 的平方根，因为 x 必须 >= 0：当前值为 ${x}
```

### std

#### 不要依赖外部代码。

`https://jsr.io/@std` 旨在成为所有 Deno
程序可以依赖的基础功能。我们希望向用户保证此代码不包含未经审查的第三方代码。

#### 记录并维护浏览器兼容性。

如果模块与浏览器兼容，请在模块顶部的 JSDoc 中包含以下内容：

```ts
// 此模块与浏览器兼容。
```

通过不使用全局 `Deno`
命名空间或对其进行功能测试来维护此类模块的浏览器兼容性。确保任何新依赖项也与浏览器兼容。

#### 优先使用 # 而非 private 关键字

在标准模块代码库中，我们更喜欢私有字段 (`#`) 语法，而不是 TypeScript 的
`private` 关键字。私有字段使属性和方法在运行时也是私有的。另一方面，TypeScript
的 `private` 关键字仅在编译时保证其私有性，字段在运行时是公开可访问的。

正确：

```ts
class MyClass {
  #foo = 1;
  #bar() {}
}
```

错误：

```ts
class MyClass {
  private foo = 1;
  private bar() {}
}
```

#### 命名约定

函数、方法、字段和局部变量使用 `camelCase`。类、类型、接口和枚举使用
`PascalCase`。静态顶级项使用 `UPPER_SNAKE_CASE`，例如
`string`、`number`、`bigint`、`boolean`、`RegExp`、静态项数组、静态键值记录等。

正确：

```ts
function generateKey() {}

let currentValue = 0;

class KeyObject {}

type SharedKey = {};

enum KeyType {
  PublicKey,
  PrivateKey,
}

const KEY_VERSION = "1.0.0";

const KEY_MAX_LENGTH = 4294967295;

const KEY_PATTERN = /^[0-9a-f]+$/;
```

错误：

```ts
function generate_key() {}

let current_value = 0;

function GenerateKey() {}

class keyObject {}

type sharedKey = {};

enum keyType {
  publicKey,
  privateKey,
}

const key_version = "1.0.0";

const key_maxLength = 4294967295;

const KeyPattern = /^[0-9a-f]+$/;
```

当名称使用 `camelCase` 或 `PascalCase`
时，即使部分名称是缩写，也应始终遵循它们的规则。

注意：Web API 使用大写缩写（`JSON`、`URL`、`URL.createObjectURL()` 等）。Deno
标准库不遵循此约定。

正确：

```ts
class HttpObject {
}
```

错误：

```ts
class HTTPObject {
}
```

正确：

```ts
function convertUrl(url: URL) {
  return url.href;
}
```

错误：

```ts
function convertURL(url: URL) {
  return url.href;
}
```
