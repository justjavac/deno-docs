# Deno Style Guide

> ⚠️ 注意，这是 Deno 运行时代码和 Deno 标准库中的 **内部运行时代码**
> 的样式指南。这不是 Deno 用户的通用样式指南。

## 版权头部

仓库中的大多数模块应具有以下版权头部：

```ts
// 版权所有 2018-2023 年 Deno 作者。保留所有权利。MIT 许可证。
```

如果代码来源于其他地方，请确保文件具有正确的版权头部。我们只允许 MIT、BSD 和
Apache 许可的代码。

## 文件名中使用下划线，而不是破折号。

示例：使用 `file_server.ts`，而不是 `file-server.ts`。

## 为新功能添加测试。

每个模块应包含或附带其公共功能的测试。

## TODO 注释

TODO 注释通常应包括问题或作者的 GitHub 用户名（括号中）。示例：

```ts
// TODO(ry): 添加测试。
// TODO(#123): 支持 Windows。
// FIXME(#349): 有时会发生紧急情况。
```

## 不鼓励元编程。包括使用 Proxy。

要明确，即使这意味着需要更多的代码。

在某些情况下，使用这种技术可能有道理，但在绝大多数情况下，不应使用。

## 包容性代码

请遵循在
https://chromium.googlesource.com/chromium/src/+/master/stylemanual/inclusive_code.md
中概述的包容性代码准则。

## Rust

遵循 Rust 约定并与现有代码保持一致。

## TypeScript

代码库的 TypeScript 部分是标准库 `std`。

### 使用 TypeScript 而不是 JavaScript。

### 不要使用文件名 `index.ts`/`index.js`。

Deno 不会特殊处理 "index.js" 或
"index.ts"。通过使用这些文件名，它暗示可以在模块说明符中省略它们，但实际上不能。这很令人困惑。

如果代码目录需要一个默认入口点，请使用文件名 `mod.ts`。文件名 `mod.ts` 遵循 Rust
的约定，比 `index.ts` 更短，而且没有关于它可能如何工作的先入之见。

### 导出函数：最多 2 个参数，其余放入选项对象中。

在设计函数接口时，应遵循以下规则。

1. 公共 API 的函数接受 0-2 个必需参数，加上（如果需要）一个选项对象（最多 3
   个总共）。

2. 可选参数通常应放入选项对象中。

   如果将来可能会添加更多可选参数，可以接受一个不在选项对象中的可选参数，但这可能是可接受的。

3. '选项'参数是唯一一个是普通'Object'的参数。

   其他参数可以是对象，但必须能够与“普通”对象运行时区分开来，具有以下之一：

   - 一个有区分性的原型（例如 `Array`，`Map`，`Date`，`class MyThing`）。
   - 一个具有 `Symbol.iterator` 的可迭代物体的已知符号属性。

   这使得 API 可以以向后兼容的方式发展，即使选项对象的位置发生变化。

```ts, ignore
// 错误：可选参数不包含在选项对象中。(#2)
export function resolve(
  hostname: string,
  family?: "ipv4" | "ipv6",
  timeout?: number,
): IPAddress[] {}
```

```ts, ignore
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

```ts, ignore
export interface Environment {
  [key: string]: string;
}

// 错误：'env'可能是普通Object，因此无法与选项对象区分开来。(#3)
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
// 错误：参数过多。(#1)，多个可选参数 (#2)。
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
// 错误：参数太多。(#1)
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

注意：当其中一个参数是函数时，可以灵活调整顺序。请参阅
[Deno.serve](https://deno.land/api?s=Deno.serve)、[Deno.test](https://deno.land/api?s=Deno.test)、[Deno.addSignalListener](https://deno.land/api?s=Deno.addSignalListener)
等示例。另请参阅
[此帖子](https://twitter.com/jaffathecake/status/1646798390355697664)。

### 导出用作导出成员参数的所有接口

每当您使用包含在导出成员参数或返回类型中的接口时，都应导出使用的接口。以下是一个示例：

```ts, ignore
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

### 最小化依赖关系；不要进行循环导入。

尽管 `std`
没有外部依赖关系，但我们仍然必须小心保持内部依赖关系简单和可管理。特别要小心不要引入循环导入。

### 如果文件名以下划线开头：`_foo.ts`，不要链接到它。

可能存在需要内部模块但其 API
不稳定或不应链接到的情况。在这种情况下，请使用下划线作为前缀。根据约定，只有其自己目录中的文件应该导入它。

### 为导出符号使用 JSDoc。

我们追求完整的文档。理想情况下，每个导出的符号都应该有一行文档。

如果可能的话，使用单行 JSDoc。示例：

```ts
/** foo 执行 bar。 */
export function foo() {
  // ...
}
```

重要的是文档易于阅读，但还需要提供额外的样式信息，以确保生成的文档更加丰富。因此，JSDoc
通常应遵循 markdown 标记以丰富文本。

虽然 markdown 支持 HTML 标记，但在 JSDoc 块中禁止使用 HTML 标记。

代码字符串文字应使用反引号（`）括起来，而不是引号。例如：

```ts
/** 从 `deno` 模块导入某物。 */
```

不要记录函数参数，除非它们的意图不明显（尽管如果它们的意图不明显，应该考虑
API）。因此，通常不应使用 `@param`。如果使用了 `@param`，不应包括 `type`，因为
TypeScript 已经具有强类型。

```ts
/**
 * 具有不明显参数的函数。
 * @param foo 不明显参数的描述。
 */
```

应尽量最小化垂直间距。因此，单行注释应按以下方式编写：

```ts
/** 这是良好的单行 JSDoc。 */
```

而不是：

```ts
/**
 * 这是不好的单行 JSDoc。
 */
```

代码示例应使用 markdown 格式，如下所示：

````ts
/** 简单的注释和示例：
 * ``` ts
 * import { foo } from "deno";
 * foo("bar");
 * ```
 */
````

代码示例不应包含附加注释，也不得缩进。它已经在注释中。如果需要更多注释，那就不是一个好的示例。

### 使用指令解决代码检查问题

目前，构建过程使用 `dlint`
来验证代码中的代码检查问题。如果任务需要非符合规则的代码，请使用
`deno-lint-ignore <code>` 指令来抑制警告。

```typescript
// deno-lint-ignore no-explicit-any
let x: any;
```

这可以确保持续集成过程不会因代码检查问题而失败，但应谨慎使用。

### 每个模块应配有测试模块。

具有公共功能的每个模块 `foo.ts` 都应配有一个测试模块 `foo_test.ts`。`std`
模块的测试应放在 `std/tests`
中，因为它们具有不同的上下文；否则，它应该成为被测试模块的兄弟模块。

### 单元测试应明确。

为了更好地理解测试，函数应正确命名，如在测试命令中提示的那样。例如：

```
test myTestFunction ... ok
```

测试示例：

```ts, ignore
import { assertEquals } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import { foo } from "./mod.ts";

Deno.test("myTestFunction", function () {
  assertEquals(foo(), { bar: "bar" });
});
```

### 顶层函数不应使用箭头语法。

顶层函数应使用 `function` 关键字。箭头语法应仅限于闭包。

不好的示例：

```ts
export const foo = (): string => {
  return "bar";
};
```

好的示例：

```ts
export function foo(): string {
  return "bar";
}
```

### `std`

#### 不依赖于外部代码。

`https://deno.land/std/` 旨在成为所有 Deno
程序都可以依赖的基本功能。我们希望向用户保证此代码不包括可能未经审查的第三方代码。

#### 文档和维护浏览器兼容性。

如果模块在浏览器中兼容，请在模块顶部的 JSDoc 中包含以下内容：

```ts
// 此模块在浏览器中兼容。
```

通过不使用全局 `Deno`
命名空间或对其进行特性测试来维护此类模块的浏览器兼容性。确保任何新的依赖项也与浏览器兼容。

#### 首选 `#` 而不是 `private`

在标准模块代码库中，我们更喜欢使用私有字段（`#`）语法而不是 TypeScript 的
`private` 关键字。私有字段使属性和方法在运行时保持私有。另一方面，TypeScript 的
`private` 关键字仅在编译时保证其私有，并且在运行时是公开可访问的。

好的示例：

```ts
class MyClass {
  #foo = 1;
  #bar() {}
}
```

不好的示例：

```ts
class MyClass {
  private foo = 1;
  private bar() {}
}
```

#### 命名约定

对于函数、方法、字段和局部变量，请使用
`camelCase`。对于类、类型、接口和枚举，请使用 `PascalCase`。对于静态顶层项，如
`string`、`number`、`bigint`、`boolean`、`RegExp`、静态项数组、静态键和值记录等，请使用
`UPPER_SNAKE_CASE`。

好的示例：

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

不好的示例：

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
时，请始终遵循它们的规则，即使它们的部分是首字母缩写词。

注：Web API 使用大写首字母缩写词（`JSON`、`URL`、`URL.createObjectURL()`
等）。Deno 标准库不遵循此约定。
