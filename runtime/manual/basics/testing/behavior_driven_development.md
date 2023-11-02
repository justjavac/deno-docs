# 行为驱动开发

使用 [bdd.ts](https://deno.land/std/testing/bdd.ts)
模块，您可以以一种熟悉的格式编写测试，以便对测试进行分组和添加设置/拆卸钩子，这些钩子可用于其他
JavaScript 测试框架，如 Jasmine、Jest 和 Mocha。

`describe` 函数创建一个组合多个相关测试的块。`it` 函数注册一个单独的测试用例。

## 钩子

有 4
种类型的钩子可用于测试套件。一个测试套件可以有每种类型的多个钩子，它们将按照它们的注册顺序调用。`afterEach`
和 `afterAll` 钩子将无论测试用例是否通过都会被调用。`*All`
钩子将在整个组内被调用，而 `*Each` 钩子将在每个单独的测试用例中被调用。

- `beforeAll`: 在测试套件中的所有测试之前运行。
- `afterAll`: 在测试套件中的所有测试完成后运行。
- `beforeEach`: 在测试套件中的每个单独测试用例之前运行。
- `afterEach`: 在测试套件中的每个单独测试用例之后运行。

如果一个钩子在顶层注册，将注册一个全局测试套件，所有测试都将属于它。顶层注册的钩子必须在任何单独的测试用例或测试套件之前注册。

## 焦点测试

如果您想仅运行特定的测试用例，可以通过调用 `it.only` 而不是 `it`
来实现。如果您想仅运行特定的测试套件，可以通过调用 `describe.only` 而不是
`describe` 来实现。

当使用扁平测试分组样式时，有一个限制。当 `describe` 被调用而没有嵌套时，它会使用
`Deno.test` 注册测试。如果使用 `it.only` 或 `describe.only`
注册子测试用例或测试套件，它将作用于顶层测试套件而不是整个文件。要使它们成为文件中唯一运行的测试，您需要使用
`describe.only` 注册顶层测试套件。

## 忽略测试

如果您不想运行特定的单独测试用例，可以通过调用 `it.ignore` 而不是 `it`
来实现。如果您不想运行特定的测试套件，可以通过调用 `describe.ignore` 而不是
`describe` 来实现。

## 消毒选项

与 `Deno.TestDefinition` 类似，`DescribeDefinition` 和 `ItDefinition`
具有消毒选项。它们的工作方式相同。

- `sanitizeExit`: 确保测试用例不会过早导致进程退出，例如通过调用
  `Deno.exit`。默认为 true。
- `sanitizeOps`: 检查测试完成后的异步操作数量与分派的操作数量是否相同。默认为
  true。
- `sanitizeResources`: 确保测试用例不会 "泄漏" 资源 -
  即测试后的资源表与测试前的内容完全相同。默认为 true。

## 权限选项

与 `Deno.TestDefinition` 类似，`DescribeDefinition` 和 `ItDefinition` 具有
`permissions` 选项。它们指定应用于运行单独的测试用例或测试套件的权限。将其设置为
`"inherit"` 以保持调用线程的权限。将其设置为 `"none"` 以撤销所有权限。

此设置默认为 `"inherit"`。

目前有一个限制，即不能在属于其他测试套件的单独的测试用例或测试套件上使用权限选项。这是因为在内部，这些测试是使用
`t.step` 注册的，不支持权限选项。

## 与 Deno\.test 比较

编写测试的默认方式是使用 `Deno.test` 和 `t.step`。`describe` 和 `it`
函数的调用签名与 `Deno.test`
相似，使默认样式和行为驱动开发样式的测试编写之间切换变得容易。在内部，`describe`
和 `it` 注册测试时使用了 `Deno.test` 和 `t.step`。下面是一个使用 `Deno.test` 和
`t.step`
编写测试文件的示例。在接下来的部分中，有示例展示了如何使用嵌套测试分组、扁平测试分组或两种样式混合编写相同的测试。

```ts
// https://deno.land/std/testing/bdd_examples/user_test.ts
import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import {
  User,
} from "https://deno.land/std@$STD_VERSION/testing/bdd_examples/user.ts";

Deno.test("User.users initially empty", () => {
  assertEquals(User.users.size, 0);
});

Deno.test("User constructor", () => {
  try {
    const user = new User("Kyle");
    assertEquals(user.name, "Kyle");
    assertStrictEquals(User.users.get("Kyle"), user);
  } finally {
    User.users.clear();
  }
});

Deno.test("User age", async (t) => {
  const user = new User("Kyle");

  await t.step("getAge", () => {
    assertThrows(() => user.getAge(), Error, "Age unknown");
    user.age = 18;
    assertEquals(user.getAge(), 18);
  });

  await t.step("setAge", () => {
    user.setAge(18);
    assertEquals(user.getAge(), 18);
  });
});
```

### 嵌套测试分组

在 `describe`
函数调用的回调内创建的测试将属于它创建的新测试套件。钩子可以在其中创建，也可以添加到
`describe` 的选项参数中。

```ts
// https://deno.land/std/testing/b

dd_examples / user_nested_test.ts;
import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@$STD_VERSION/testing/bdd.ts";
import {
  User,
} from "https://deno.land/std@$STD_VERSION/testing/bdd_examples/user.ts";

describe("User", () => {
  it("users initially empty", () => {
    assertEquals(User.users.size, 0);
  });

  it("constructor", () => {
    try {
      const user = new User("Kyle");
      assertEquals(user.name, "Kyle");
      assertStrictEquals(User.users.get("Kyle"), user);
    } finally {
      User.users.clear();
    }
  });

  describe("age", () => {
    let user: User;

    beforeEach(() => {
      user = new User("Kyle");
    });

    afterEach(() => {
      User.users.clear();
    });

    it("getAge", function () {
      assertThrows(() => user.getAge(), Error, "Age unknown");
      user.age = 18;
      assertEquals(user.getAge(), 18);
    });

    it("setAge", function () {
      user.setAge(18);
      assertEquals(user.getAge(), 18);
    });
  });
});
```

### 扁平测试分组

`describe`
函数返回一个唯一的符号，可用于引用测试套件，无需创建回调即可将测试添加到其中，而不需要在组织测试之前添加额外的缩进。

```ts
// https://deno.land/std/testing/bdd_examples/user_flat_test.ts
import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import {
  describe,
  it,
} from "https://deno.land/std@$STD_VERSION/testing/bdd.ts";
import {
  User,
} from "https://deno.land/std@$STD_VERSION/testing/bdd_examples/user.ts";

const userTests = describe("User");

it(userTests, "users initially empty", () => {
  assertEquals(User.users.size, 0);
});

it(userTests, "constructor", () => {
  try {
    const user = new User("Kyle");
    assertEquals(user.name, "Kyle");
    assertStrictEquals(User.users.get("Kyle"), user);
  } finally {
    User.users.clear();
  }
});

const ageTests = describe({
  name: "age",
  suite: userTests,
  beforeEach(this: { user: User }) {
    this.user = new User("Kyle");
  },
  afterEach() {
    User.users.clear();
  },
});

it(ageTests, "getAge", function () {
  const { user } = this;
  assertThrows(() => user.getAge(), Error, "Age unknown");
  user.age = 18;
  assertEquals(user.getAge(), 18);
});

it(ageTests, "setAge", function () {
  const { user } = this;
  user.setAge(18);
  assertEquals(user.getAge(), 18);
});
```

### 混合测试分组

嵌套测试分组和扁平测试分组可以一起使用。这可以
在每行前面不需要额外的缩进的情况下创建深度分组。

```ts
// https://deno.land/std/testing/bdd_examples/user_mixed_test.ts
import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import {
  describe,
  it,
} from "https://deno.land/std@$STD_VERSION/testing/bdd.ts";
import {
  User,
} from "https://deno.land/std@$STD_VERSION/testing/bdd_examples/user.ts";

describe("User", () => {
  it("users initially empty", () => {
    assertEquals(User.users.size, 0);
  });

  it("constructor", () => {
    try {
      const user = new User("Kyle");
      assertEquals(user.name, "Kyle");
      assertStrictEquals(User.users.get("Kyle"), user);
    } finally {
      User.users.clear();
    }
  });

  const ageTests = describe({
    name: "age",
    beforeEach(this: { user: User }) {
      this.user = new User("Kyle");
    },
    afterEach() {
      User.users.clear();
    },
  });

  it(ageTests, "getAge", function () {
    const { user } = this;
    assertThrows(() => user.getAge(), Error, "Age unknown");
    user.age = 18;
    assertEquals(user.getAge(), 18);
  });

  it(ageTests, "setAge", function () {
    const { user } = this;
    user.setAge(18);
    assertEquals(user.getAge(), 18);
  });
});
```
