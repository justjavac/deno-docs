---
sidebar_position: 2
---

# 在 Deno 中进行测试

Deno 内置了一个测试运行器，您可以用来测试 JavaScript 或 TypeScript 代码。

## 快速入门

首先，让我们创建一个名为 `url_test.ts` 的文件，并使用 `Deno.test()`
函数注册一个测试用例。

---ts // url_test.ts import { assertEquals } from
"https://deno.land/std@$STD_VERSION/assert/mod.ts";

Deno.test("URL测试", () => { const url = new URL("./foo.js",
"https://deno.land/"); assertEquals(url.href, "https://deno.land/foo.js"); });

````
其次，使用 `deno test` 子命令运行测试。

```sh
$ deno test url_test.ts
running 1 test from file:///dev/url_test.js
test URL测试 ... 通过 (2毫秒)

测试结果: 通过. 1 通过; 0 失败; 0 忽略; 0 测量; 0 过滤 (9毫秒)
````

## 编写测试

要定义一个测试，您需要使用 `Deno.test` API
进行注册。此API有多种重载，以提供最大的灵活性，并轻松切换不同的形式（例如，在调试时需要快速关注单个测试时，使用
`only: true` 选项）：

```ts
import { assertEquals } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";

// 紧凑形式: 名称和函数
Deno.test("你好，世界 #1", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// 紧凑形式: 命名函数
Deno.test(function 你好世界3() {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// 较长的形式: 测试定义
Deno.test({
  name: "你好，世界 #2",
  fn: () => {
    const x = 1 + 2;
    assertEquals(x, 3);
  },
});

// 与紧凑形式类似，作为第二个参数提供附加配置。
Deno.test("你好，世界 #4", { permissions: { read: true } }, () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// 与较长形式类似，测试函数作为第二个参数。
Deno.test(
  { name: "你好，世界 #5", permissions: { read: true } },
  () => {
    const x = 1 + 2;
    assertEquals(x, 3);
  },
);

// 与较长形式类似，具有命名的测试函数作为第二个参数。
Deno.test({ permissions: { read: true } }, function 你好世界6() {
  const x = 1 + 2;
  assertEquals(x, 3);
});
```

### 异步函数

您还可以通过传递返回Promise的测试函数来测试异步代码。为此，您可以在定义函数时使用
`async` 关键字：

```ts
import { delay } from "https://deno.land/std@$STD_VERSION/async/delay.ts";

Deno.test("异步你好，世界", async () => {
  const x = 1 + 2;

  // 等待某些异步任务
  await delay(100);

  if (x !== 3) {
    throw Error("x 应该等于 3");
  }
});
```

### 测试步骤

测试步骤API提供了一种在测试内报告不同的步骤并在该测试内执行设置和拆卸代码的方式。

```ts
import { assertEquals } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts";

interface User {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
}

Deno.test("数据库", async (t) => {
  const client = new Client({
    user: "user",
    database: "test",
    hostname: "localhost",
    port: 5432,
  });
  await client.connect();

  // 提供步骤名称和函数
  await t.step("插入用户", async () => {
    const users = await client.queryObject<User>(
      "INSERT INTO users (name) VALUES ('Deno') RETURNING *",
    );
    assertEquals(users.rows.length, 1);
    assertEquals(users.rows[0].name, "Deno");
  });

  // 或提供测试定义
  await t.step({
    name: "插入图书",
    fn: async () => {
      const books = await client.queryObject<Book>(
        "INSERT INTO books (name) VALUES ('The Deno Manual') RETURNING *",
      );
      assertEquals(books.rows.length, 1);
      assertEquals(books.rows[0].title, "The Deno Manual");
    },
    ignore: false,
    // 这些默认值为父测试或步骤的值
    sanitizeOps: true,
    sanitizeResources: true,
    sanitizeExit: true,
  });

  // 支持嵌套步骤
  await t.step("更新和删除", async (t) => {
    await t.step("更新", () => {
      // 即使此测试抛出异常，外部承诺不会拒绝，
      // 下一个测试步骤将继续运行
      throw new Error("失败.");
    });

    await t.step("删除", () => {
      // ...等等...
    });
  });

  // 步骤返回一个值，指示它们是否运行或不运行
  const testRan = await t.step({
    name: "复制图书",
    fn: () => {
      // ...等等...
    },
    ignore: true, // 已忽略，因此将返回 `false`
  });

  // 如果在兄弟步骤或父测试上禁用了消毒剂，步骤可以并行运行
  const testCases = [1, 2, 3];
  await Promise.all(testCases.map((testCase) =>
    t.step({
      name: `案例 ${testCase}`,
      fn: async () => {
        // ...等等...
      },
      sanitizeOps: false,
      sanitizeResources: false,
      sanitizeExit: false,
    })
  ));

  client.end();
});
```

输出：

```
测试数据库...
  测试插入用户... 通过 (2毫秒)
  测试插入图书... 通过 (14毫秒)
  测试更新和删除...
    测试更新... 失败 (17毫秒)
      错误: 失败.
          在<省略堆栈跟踪>
    测试删除... 通过 (19毫秒)
  失败 (46毫秒)
  测试复制图书... 已忽略 (0毫秒)
  测试案例 1... 通过 (14毫秒)
  测试案例 2... 通过 (14毫秒)
  测试案例 3... 通过 (14毫秒)
失败 (111毫秒)
```

注意：

1. 必须在父测试/步骤函数解决之前**等待测试步骤**，否则将会出现运行时错误。
2. 除非在兄弟步骤或父测试上禁用了消毒剂，否则不能并行运行测试步骤。
3. 如果嵌套步骤，请确保为父步骤指定参数。
   ```ts
   Deno.test("我的测试", async (t) => {
     await t.step("步骤", async (t) => {
       //请注意此处使用的 `t` 是父步骤的，而不是外部的 `Deno.test`
       await t.step("子步骤", () => {
       });
     });
   });
   ```

#### 嵌套测试步骤

## 运行测试

要运行测试，请使用包含测试功能的文件调用
`deno test`。您还可以省略文件名，此时将运行匹配全局通配符的当前目录（递归）中的所有测试文件。如果传递一个目录，将运行该目录中匹配此通配符的所有文件。

通配符扩展为：

- 文件名为 `test.{ts, tsx, mts, js, mjs, jsx}`，
- 或以 `.test.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件，
- 或以 `_test.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件。

```shell
# 运行当前目录和所有子目录中的所有测试
deno test

# 运行 util 目录中的所有测试
deno test util/

# 仅运行 my_test.ts
deno test my_test.ts

# 并行运行测试模块
deno test --parallel
```

请注意，从 Deno v1.24
开始，一些测试选项可以通过[a configuration file](../../getting_started/configuration_file.md)进行配置。

> ⚠️ 如果您想传递额外的命令行参数给测试文件，请使用 `--` 来通知 Deno
> 剩余的参数是脚本参数。

```shell
# 传递额外的参数给测试文件
deno test my_test.ts -- -e --foo --bar
```

`deno test` 使用与 `deno run` 相同的权限模型，因此在测试过程中可能需要例如
`--allow-write` 来写入文件系统。

要查看使用 `deno test` 的所有运行时选项，您可以参考命令行帮助：

```shell
deno help test
```

## 过滤

有许多选项可以用来过滤您要运行的测试。

### 命令行过滤

可以使用命令行 `--filter` 选项来独立运行或分组运行测试。

过滤标志接受字符串或模式作为值。

假设以下测试：

```ts, ignore
Deno.test({ name: "my-test", fn: myTest });
Deno.test({ name: "test-1", fn: test1 });
Deno.test({ name: "test-2", fn: test2 });
```

此命令将运行所有这些测试，因为它们都包含单词 "test"。

```shell
deno test --filter "test" tests/
```

相反，以下命令使用模式并将运行第二和第三个测试。

```shell
deno test --filter "/test-*\d/" tests/
```

_要让 Deno 知道您要使用模式，将您的过滤器用正斜杠包装起来，就像 JavaScript
对正则表达式的语法糖一样。_

### 在配置文件中包括和排除路径

还可以通过在 Deno 配置文件中指定要包括或排除的路径来过滤测试。

例如，如果您只想测试 `src/fetch_test.ts` 和 `src/signal_test.ts`，并排除 `out/`
中的所有内容：

```json
{
  "test": {
    "include": [
      "src/fetch_test.ts",
      "src/signal_test.ts"
    ]
  }
}
```

或者更可能的情况：

```json
{
  "test": {
    "exclude": ["out/"]
  }
}
```

然后在与配置文件相同的目录树中运行 `deno test` 将考虑这些选项。

### 测试定义过滤

在测试文件本身内部，有两种过滤选项可供选择。

#### 过滤出（忽略这些测试）

有时您可能想根据某种条件（例如，只在 Windows
上运行测试）来忽略测试。为此，可以在测试定义中使用 `ignore` 布尔值。如果设置为
true，则会跳过该测试。

```ts
Deno.test({
  name: "do macOS feature",
  ignore: Deno.build.os !== "darwin",
  fn() {
    // 在这里执行 macOS 特性
  },
});
```

#### 过滤 (仅运行这些测试)

有时候你可能会发现在一个庞大的测试类中有一个问题，而你只想专注于这个测试，暂时忽略其余的。为此，你可以使用
`only` 选项来告诉测试框架只运行设置为 `true`
的测试。多个测试可以设置这个选项。虽然测试运行会报告每个测试的成功或失败，但如果任何测试被标记为
`only`，则整个测试运行将失败，因为这只是一个临时措施，会禁用几乎所有的测试。

```ts
Deno.test({
  name: "仅关注此测试",
  only: true,
  fn() {
    // 在这里测试复杂的东西
  },
});
```

## 快速失败

如果你有一个运行时间较长的测试套件，并希望在第一个失败时停止测试，你可以在运行测试套件时指定
`--fail-fast` 标志。

```shell
deno test --fail-fast
```

## 报告器

Deno 预装了三种内置报告器:

- `pretty`（默认）
- `dot`
- `junit`

你可以使用 `--reporter` 标志指定要使用的报告器。

```shell
# 使用默认的 pretty 报告器
$ deno test

# 使用简洁输出的 dot 报告器
$ deno test --reporter=dot

# 使用 JUnit 报告器
$ deno test --reporter=junit
```

你还可以将机器可读的 JUnit
报告的输出写入文件，同时在终端上享受人类可读的输出。在这种情况下，指定
`--junit-path` 标志:

```shell
$ deno test --junit-path=./report.xml
```

## 与测试库的集成

Deno 的测试运行器可以与流行的测试库一起使用，如
[Chai](https://www.chaijs.com/)、[Sinon.JS](https://sinonjs.org/) 或
[fast-check](https://fast-check.dev/)。

例如，集成示例：

- https://deno.land/std/testing/chai_example.ts
- https://deno.land/std/testing/sinon_example.ts
- https://deno.land/std/testing/fast_check_example.ts

### 示例：使用 Sinon 对函数进行间谍操作

测试间谍是用来断言函数内部行为是否符合期望的函数替身。Sinon
是一个广泛使用的测试库，提供了测试间谍功能，并且可以在 Deno 中通过从 NPM
导入来使用：

```javascript
import { spy } from "https://cdn.skypack.dev/sinon";
// 在测试中使用 spy
// Example: Using spy in a test
const myFunction = () => {
  // function logic
};

const spyFunction = spy(myFunction);

// 断言 spyFunction 被调用
// Assert that spyFunction was called
sinon.assert.called(spyFunction);
```

```js
import sinon from "npm:sinon";
```

假设我们有两个函数，`foo` 和 `bar`，并希望在执行 `foo` 时断言 `bar`
是否被调用。有几种使用 Sinon 实现这一目标的方法之一是让函数 `foo`
接受另一个函数作为参数：

```js
// my_file.js
export function bar() {/*...*/}

export function foo(fn) {
  fn();
}
```

这样，我们可以在应用代码中调用 `foo(bar)`，或者在测试代码中包装一个间谍函数在
`bar` 上并调用 `foo(spy)`：

```js, ignore
import sinon from "npm:sinon";
import { assertEquals } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import { bar, foo } from "./my_file.js";

Deno.test("在执行 foo 时调用 bar", () => {
  // 创建一个包装 'bar' 的测试间谍
  const spy = sinon.spy(bar);

  // 调用函数 'foo' 并将间谍作为参数传递
  foo(spy);

  assertEquals(spy.called, true);
  assertEquals(spy.getCalls().length, 1);
});
```

如果您不希望仅为测试目的添加额外的参数，您还可以使用 `sinon`
在对象上包装一个方法。在其他 JavaScript 环境中，`bar` 可能是通过全局对象（如
`window`）访问的，并可以通过 `sinon.spy(window, "bar")` 调用，但在 Deno
中，这种方式将不起作用，而您可以导出一个包含要测试的函数的对象。这意味着需要将
`my_file.js` 重写为以下形式：

```js
// my_file.js
function bar() {/*...*/}

export const funcs = {
  bar,
};

// 'foo' 不再接受参数，而是从对象中调用 'bar'
export function foo() {
  funcs.bar();
}
```

然后在测试文件中导入：

```js, ignore
import sinon from "npm:sinon";
import { assertEquals } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import { foo, funcs } from "./my_file.js";

Deno.test("在执行 foo 时调用 bar", () => {
  // 创建一个包装 'funcs' 对象上的 'bar' 的测试间谍
  const spy = sinon.spy(funcs, "bar");

  // 调用函数 'foo'，不带参数
  foo();

  assertEquals(spy.called, true);
  assertEquals(spy.getCalls().length, 1);
});
```
