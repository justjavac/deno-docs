# 断言

为了帮助开发人员编写测试，Deno 标准库附带了一个内置的
[断言模块](https://deno.land/std/assert/mod.ts)，可以从
`https://deno.land/std/assert/mod.ts` 导入。

```js
import { assert } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";

Deno.test("你好，测试", () => {
  assert("你好");
});
```

> ⚠️ 一些流行的断言库，比如 [Chai](https://www.chaijs.com/)，也可以在 Deno
> 中使用，例如用法请参见 https://deno.land/std/testing/chai_example.ts。

断言模块提供了 14 个断言：

- `assert(expr: unknown, msg = ""): asserts expr`
- `assertEquals(actual: unknown, expected: unknown, msg?: string): void`
- `assertExists(actual: unknown, msg?: string): void`
- `assertNotEquals(actual: unknown, expected: unknown, msg?: string): void`
- `assertStrictEquals(actual: unknown, expected: unknown, msg?: string): void`
- `assertAlmostEquals(actual: number, expected: number, epsilon = 1e-7, msg?: string): void`
- `assertInstanceOf(actual: unknown, expectedType: unknown, msg?: string): void`
- `assertStringIncludes(actual: string, expected: string, msg?: string): void`
- `assertArrayIncludes(actual: unknown[], expected: unknown[], msg?: string): void`
- `assertMatch(actual: string, expected: RegExp, msg?: string): void`
- `assertNotMatch(actual: string, expected: RegExp, msg?: string): void`
- `assertObjectMatch( actual: Record<PropertyKey, unknown>, expected: Record<PropertyKey, unknown>): void`
- `assertThrows(fn: () => void, ErrorClass?: Constructor, msgIncludes?: string | undefined, msg?: string | undefined): Error`
- `assertRejects(fn: () => Promise<unknown>, ErrorClass?: Constructor, msgIncludes?: string | undefined, msg?: string | undefined): Promise<void>`

除了上述断言，还有 [快照模块](https://deno.land/std/testing/snapshot.ts)
还公开了一个 `assertSnapshot` 函数。该模块的文档可以在
[这里](./snapshot_testing.md) 找到。

## 断言

`assert` 方法是一个简单的 "真值" 断言，可用于断言任何可以推断为真的值。

```js
Deno.test("测试 Assert", () => {
  assert(1);
  assert("你好");
  assert(true);
});
```

## 存在

`assertExists` 可以用于检查值是否不为 `null` 或 `undefined`。

```js
assertExists("Deno");
Deno.test("测试 Assert Exists", () => {
  assertExists("Deno");
  assertExists(false);
  assertExists(0);
});
```

## 相等性

有三种相等性断言可用，`assertEquals()`、 `assertNotEquals()` 和
`assertStrictEquals()`。

`assertEquals()` 和 `assertNotEquals()`
方法提供了通用的相等性检查，能够断言基本类型和对象之间的相等性。

```js
Deno.test("测试 Assert Equals", () => {
  assertEquals(1, 1);
  assertEquals("你好", "你好");
  assertEquals(true, true);
  assertEquals(undefined, undefined);
  assertEquals(null, null);
  assertEquals(new Date(), new Date());
  assertEquals(new RegExp("abc"), new RegExp("abc"));

  class Foo {}
  const foo1 = new Foo();
  const foo2 = new Foo();

  assertEquals(foo1, foo2);
});

Deno.test("测试 Assert Not Equals", () => {
  assertNotEquals(1, 2);
  assertNotEquals("你好", "世界");
  assertNotEquals(true, false);
  assertNotEquals(undefined, "");
  assertNotEquals(new Date(), Date.now());
  assertNotEquals(new RegExp("abc"), new RegExp("def"));
});
```

相比之下，`assertStrictEquals()` 提供了一个更简单、更严格的相等性检查，基于
`===` 运算符。因此，它不会断言两个相同对象的实例，因为它们不会引用相同的对象。

```js
Deno.test("测试 Assert Strict Equals", () => {
  assertStrictEquals(1, 1);
  assertStrictEquals("你好", "你好");
  assertStrictEquals(true, true);
  assertStrictEquals(undefined, undefined);
});
```

`assertStrictEquals()` 断言最适合用于希望进行精确检查的两种基本类型。

### 数字的相等性

在测试数字之间的相等性时，重要的是要记住，有些数字不能准确地表示为 IEEE-754
双精度浮点表示。

这在处理十进制数时尤为真，其中 `assertStrictEquals()`
在某些情况下可以工作，但在其他情况下不行：

```ts
import {
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@$STD_VERSION/assert/mod.ts";

Deno.test("测试带有浮点数的 Assert Strict Equals", () => {
  assertStrictEquals(0.25 + 0.25, 0.25);
  assertThrows(() => assertStrictEquals(0.1 + 0.2, 0.3));
  //0.1 + 0.2 将被存储为 0.30000000000000004，而不是 0.3
});
```

相反，`assertAlmostEquals()`
提供了一种测试给定数字是否足够接近被视为相等的方法。默认容差设置为
`1e-7`，但也可以通过传递第三个可选参数来更改它。

```ts
import {
  assertAlmostEquals,
  assertThrows,
} from "https://deno.land/std@$STD_VERSION/assert/mod.ts";

Deno.test("测试 Assert Almost Equals", () => {
  assertAlmostEquals(0.1 + 0.2, 0.3);
  assertAlmostEquals(0.1 + 0.2, 0.3, 1e-16);
  assertThrows(() => assertAlmostEquals(0.1 + 0.2, 0.3, 1e-17));
});
```

### 实例类型

要检查对象是否是特定构造函数的实例，您可以使用
`assertInstanceOf()`。这有一个附加的好处，它让 TypeScript
知道传入的变量具有特定类型：

```ts
import { assertInstanceOf } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";

Deno.test("测试断言实例类型", () => {
  const variable = new Date() as unknown;

  assertInstanceOf(variable, Date);

  // 现在不会引发类型错误，因为类型已经被断言。
  variable.getDay();
});
```

## 包含

有两种方法可用于断言一个值是否包含一个值，`assertStringIncludes()` 和
`assertArrayIncludes()`。

`assertStringIncludes()`
断言对字符串执行简单的包含检查，以查看它是否包含期望的字符串。

```js
Deno.test("测试断言字符串包含", () => {
  assertStringIncludes("Hello World", "Hello");
});
```

`assertArrayIncludes()`
断言略微复杂一些，可以在数组中找到一个值以及一个数组中的值。

```js
Deno.test("测试断言数组包含", () => {
  assertArrayIncludes([1, 2, 3], [1]);
  assertArrayIncludes([1, 2, 3], [1, 2]);
  assertArrayIncludes(Array.from("Hello World"), Array.from("Hello"));
});
```

## 正则表达式

您可以通过 `assertMatch()` 和 `assertNotMatch()` 断言来断言正则表达式。

```js
Deno.test("测试断言匹配", () => {
  assertMatch("abcdefghi", new RegExp("def"));

  const basicUrl = new RegExp("^https?://[a-z.]+.com$");
  assertMatch("https://www.google.com", basicUrl);
  assertMatch("http://facebook.com", basicUrl);
});

Deno.test("测试断言不匹配", () => {
  assertNotMatch("abcdefghi", new RegExp("jkl"));

  const basicUrl = new RegExp("^https?://[a-z.]+.com$");
  assertNotMatch("https://deno.land/", basicUrl);
});
```

## 对象

使用 `assertObjectMatch` 来检查 JavaScript 对象是否与对象的属性子集匹配。

```js
// 简单子集
assertObjectMatch(
  { foo: true, bar: false },
  {
    foo: true,
  },
);
```

## 异常

在 Deno 中，有两种方法来断言是否引发了错误，`assertThrows()` 和
`assertRejects()`。这两个断言允许您检查是否已抛出错误，抛出的错误类型以及消息内容。

这两个断言之间的区别在于 `assertThrows()` 接受一个标准函数，而 `assertRejects()`
接受一个返回
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
的函数。

`assertThrows()`
断言将检查是否已抛出错误，并可选择检查抛出的错误是否是正确类型，并断言错误消息是否符合预期。

```js
Deno.test("测试断言引发错误", () => {
  assertThrows(
    () => {
      throw new Error("Panic!");
    },
    Error,
    "Panic!",
  );
});
```

`assertRejects()` 断言略微复杂，主要是因为它涉及到 Promise。但基本上它会捕获
Promise
中抛出的错误或拒绝。您还可以选择检查错误类型和错误消息。这类似于使用异步函数的
`assertThrows()`。

```js
Deno.test("测试断言异步引发错误", () => {
  await assertRejects(
    () => {
      return new Promise(() => {
        throw new Error("Panic! Threw Error");
      });
    },
    Error,
    "Panic! Threw Error",
  );

  await assertRejects(
    () => {
      return Promise.reject(new Error("Panic! Reject Error"));
    },
    Error,
    "Panic! Reject Error",
  );
});
```

## 自定义消息

Deno 的每个内置断言都允许您覆盖标准的 CLI
错误消息，如果您愿意的话。例如，此示例将输出 "Values Don't Match!" 而不是标准的
CLI 错误消息。

```js
Deno.test("测试断言相等失败自定义消息", () => {
  assertEquals(1, 2, "Values Don't Match!");
});
```

## 自定义测试

尽管 Deno 提供了强大的
[assertions 模块](https://deno.land/std/assert/mod.ts)，但总有一些特定于项目的东西可以添加。创建
`自定义断言函数` 可以提高可读性并减少代码量。

```ts
import { AssertionError } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";

function assertPowerOf(actual: number, expected: number, msg?: string): void {
  let received = actual;
  while (received % expected === 0) received = received / expected;
  if (received !== 1) {
    if (!msg) {
      msg = `actual: "${actual}" expected to be a power of : "${expected}"`;
    }
    throw new AssertionError(msg);
  }
}
```

在您的代码中使用此匹配器如下：

```js
Deno.test("测试断言幂次方", () => {
  assertPowerOf(8, 2);
  assertPowerOf(11, 4);
});
```
