---
tags: []
---

确保代码完全由 ASCII 字符编写。

Deno 依赖的 JavaScript 引擎 V8 提供了一种方法，使得字符串可以在 V8
的堆外填充。特别是，如果它们仅由单字节字符组成，V8 可以通过
[`v8::String::ExternalOneByteStringResource`] 更高效地处理它们。为了在 Deno
内部利用这一 V8 特性，此规则检查代码中的所有字符是否均为 ASCII。

[`v8::String::ExternalOneByteStringResource`]: https://v8.github.io/api/head/classv8_1_1String_1_1ExternalOneByteStringResource.html

也就是说，你也可以将此 lint 规则用于 Deno 内部 JavaScript
代码之外的其他用途。如果你出于某些原因希望确保代码库仅由 ASCII
字符组成（例如，希望禁止非 ASCII 标识符），那么此规则将非常有用。

**无效示例：**

```typescript
const π = Math.PI;

// 字符串字面量也会被检查
const ninja = "🥷";

function こんにちは(名前: string) {
  console.log(`こんにちは、${名前}さん`);
}

// “注释”也会被检查
// ^        ^
// |        U+201D
// U+201C
```

**有效示例：**

```typescript
const pi = Math.PI;

const ninja = "ninja";

function hello(name: string) {
  console.log(`Hello, ${name}`);
}

// "注释"也会被检查
```
