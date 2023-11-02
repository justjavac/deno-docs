# 快照测试

Deno 标准库带有一个
[snapshot 模块](https://deno.land/std/testing/snapshot.ts)，它允许开发人员编写测试来断言一个值与参考快照的表示形式相匹配。这个参考快照是原始值的序列化表示，并与测试文件一起存储。

快照测试在许多情况下都很有用，因为它可以使用非常少的代码来捕获各种各样的错误。在难以准确表达应该断言什么的情况下特别有帮助，而不需要大量的代码，或者测试所做的断言预计会经常更改的情况下。因此，它特别适用于前端和命令行界面的开发。

## 基本用法

`assertSnapshot` 函数将创建一个值的快照并将其与参考快照进行比较，参考快照存储在
`__snapshots__` 目录中，与测试文件一起。

```ts title="example_test.ts"
import {
  assertSnapshot,
} from "https://deno.land/std@$STD_VERSION/testing/snapshot.ts";

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a);
});
```

```js title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`isSnapshotMatch 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

在测试中调用 `assertSnapshot` 会引发
`AssertionError`，如果测试期间创建的快照与快照文件中的不匹配，则测试会失败。

## 创建和更新快照

当将新的快照断言添加到测试套件中，或者故意进行更改导致快照失败时，可以通过在更新模式下运行快照测试来更新快照。可以通过在运行测试时将
`--update` 或 `-u`
标志作为参数传递来在更新模式下运行测试。传递此标志时，不匹配的任何快照都将被更新。

```sh
deno test --allow-all -- --update
```

此外，仅在存在此标志时才会创建新的快照。

## 权限

运行快照测试时，必须启用 `--allow-read` 权限，否则任何对 `assertSnapshot`
的调用都将由于权限不足而失败。另外，当更新快照时，还必须启用 `--allow-write`
权限，因为这是为了更新快照文件而必需的。

`assertSnapshot` 函数只会尝试读取和写入快照文件。因此，`--allow-read` 和
`--allow-write` 的允许列表可以限制为仅包括现有的快照文件，如果需要的话。

## 版本控制

快照测试在将快照文件的更改与其他代码更改一起提交时效果最佳。这允许将参考快照的更改与导致它们的代码更改一起审查，并确保当其他人拉取您的更改时，他们的测试不需要在本地更新快照就能通过。

## 高级用法

### 选项

`assertSnapshot`
函数还可以使用一个选项对象进行调用，它提供更大的灵活性并启用一些非标准用例。

```ts
import {
  assertSnapshot,
} from "https://deno.land/std@$STD_VERSION/testing/snapshot.ts";

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a, {
    // 选项
  });
});
```

**`serializer`**

`serializer` 选项允许您提供自定义序列化函数。`assertSnapshot`
将调用它并传递要断言的值。它应该返回一个字符串。序列化函数是确定性的，即它将始终产生相同的输出，给定相同的输入。

序列化函数的结果将在更新模式下写入快照文件中，在断言模式下将与快照文件中存储的快照进行比较。

```ts title="example_test.ts"
import {
  assertSnapshot,
  serialize,
} from "https://deno.land/std@$STD_VERSION/testing/snapshot.ts";
import { stripColor } from "https://deno.land/std@$STD_VERSION/fmt/colors.ts";

/**
 * 序列化`actual`并移除ANSI转义代码。
 */
function customSerializer(actual: string) {
  return serialize(stripColor(actual));
}

Deno.test("Custom Serializer", async function (t): Promise<void> {
  const output = "\x1b[34mHello World!\x1b[39m";
  await assertSnapshot(t, output, {
    serializer: customSerializer,
  });
});
```

```js title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Custom Serializer 1`] = `"Hello World!"`;
```

自定义序列化程序在各种情况下都很有用。一个可能的用例是丢弃与非确定性值或因其他原因不希望写入磁盘的值无关的信息，例如时间戳或文件路径。

请注意，默认的序列化程序是从快照模块导出的，以便可以轻松扩展其功能。

**`dir` 和 `path`**

`dir` 和 `path`
选项允许您控制将快照文件保存到何处并从何处读取。它们可以是绝对路径或相对路径。如果是相对路径，它们将相对于测试文件解析。

例如，如果您的测试文件位于 `/path/to/test.ts`，并且 `dir` 选项设置为
`snapshots`，那么快照文件将写入`/path/to/snapshots

/test.ts.snap`。

如上例所示，`dir` 选项允许您指定快照目录，同时仍使用快照文件名称的默认格式。

相比之下，`path` 选项允许您指定快照文件的目录和文件名。

例如，如果您的测试文件位于 `/path/to/test.ts`，并且 `path` 选项设置为
`snapshots/test.snapshot`，那么快照文件将写入
`/path/to/snapshots/test.snapshot`。

如果同时指定 `dir` 和 `path`，则 `dir` 选项将被忽略，并且 `path`
选项将按照正常方式处理。

**`mode`**

`mode` 选项可以是 `assert` 或 `update`。当设置时，`--update` 和 `-u`
标志将被忽略。

如果 `mode` 选项设置为 `assert`，那么 `assertSnapshot`
将始终表现得好像未传递更新标志，即如果快照与快照文件中保存的不匹配，则将引发
`AssertionError`。

如果 `mode` 选项设置为 `update`，那么 `assertSnapshot`
将始终表现得好像已传递更新标志，即如果快照与快照文件中保存的不匹配，那么将在所有测试运行后更新快照。

**`name`**

`name` 选项指定快照的名称。默认情况下，将使用测试步骤的名称。但是，如果指定了
`name` 选项，那么将使用 `name` 选项。

```ts title="example_test.ts"
import {
  assertSnapshot,
} from "https://deno.land/std@$STD_VERSION/testing/snapshot.ts";

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a, {
    name: "Test Name",
  });
});
```

```js title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Test Name 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

当使用相同的 `name` 值多次运行 `assertSnapshot` 时，后缀将像往常一样递增，例如
`Test Name 1`，`Test Name 2`，`Test Name 3` 等。

**`msg`**

允许设置自定义错误消息以使用。这将覆盖默认的错误消息，其中包括失败快照的差异。

### 默认选项

您可以配置 `assertSnapshot` 的默认选项。

```ts title="example_test.ts"
import {
  createAssertSnapshot,
} from "https://deno.land/std@$STD_VERSION/testing/snapshot.ts";

const assertSnapshot = createAssertSnapshot({
  // 选项
});
```

在这种情况下配置默认选项，生成的 `assertSnapshot`
函数将与从快照模块默认导出的函数相同。如果传递了可选的选项对象，它将优先于默认选项，提供的选项值不同。

可以 "扩展" 配置为默认选项的 `assertSnapshot` 函数。

```ts title="example_test.ts"
import {
  createAssertSnapshot,
} from "https://deno.land/std@$STD_VERSION/testing/snapshot.ts";
import { stripColor } from "https://deno.land/std@$STD_VERSION/fmt/colors.ts";

const assertSnapshot = createAssertSnapshot({
  dir: ".snaps",
});

const assertMonochromeSnapshot = createAssertSnapshot<string>(
  { serializer: stripColor },
  assertSnapshot,
);

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = "\x1b[32mThis green text has had it's colours stripped\x1b[39m";
  await assertMonochromeSnapshot(t, a);
});
```

```js title=".snaps/example_test.ts.snap"
export const snapshot = {};

snapshot[`isSnapshotMatch 1`] = `This green text has had it's colours stripped`;
```

### 使用 `Deno.customInspect` 进行序列化

默认的序列化行为可以通过两种方式进行自定义。第一种方式是通过指定 `serializer`
选项。这允许您控制传递给特定 `assertSnapshot`
调用的任何值的序列化。有关此选项的正确用法，请参见上面的文档。

第二种选择是使用 `Deno.customInspect`。因为 `assertSnapshot` 使用底层的
`Deno.inspect` 的默认序列化器，您可以将属性 `Symbol.for("Deno.customInspect")`
设置为自定义序列化函数。

这样做将确保在对象默认传递给 `assertSnapshot`
时，将使用自定义序列化。这在许多情况下都很有用。下面的代码段中显示了一个示例。

```ts title="example_test.ts"
import {
  assertSnapshot,
} from "https://deno.land/std@$STD_VERSION/testing/snapshot.ts";

class HTMLTag {
  constructor(
    public name: string,
    public children: Array<HTMLTag | string> = [],
  ) {}

  public render(depth: number) {
    const indent = "  ".repeat(depth);
    let output = `${indent}<${this.name}>\n`;
    for (const child of this children) {
      if (child instanceof HTMLTag) {
        output += `${child.render(depth + 1)}\n`;
      } else {
        output += `${indent}  ${child}\n`;
      }
    }
    output += `${indent}</${this.name}>`;
    return output;
  }

  public [Symbol.for("Deno.customInspect")]() {
    return this.render(0);
  }
}

Deno.test("Page HTML Tree", async (t) => {
  const page = new HTMLTag("html", [
    new HTMLTag("head", [
      new HTMLTag("title", [
        "Simple SSR Example",
      ]),
    ]),
    new HTMLTag("body", [
      new HTMLTag("h1", [
        "Simple SSR Example",
      ]),
      new HTMLTag("p", [
        "Ex of customInspect for a snapshot of an SSR representation",
      ]),
    ]),
  ]);

  await assertSnapshot(t, page);
});
```

此测试将生成以下快照。

```js title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Page HTML Tree 1`] = `
<html>
  <head>
    <title>
      Simple SSR Example
    </title>
  </head>
  <body>
    <h1>
      Simple SSR Example
    </h1>
    <p>
      Ex of customInspect for a snapshot of an SSR representation
    </p>
  </body>
</html>
`;
```

相比之下，当我们移除 `Deno.customInspect` 方法时，测试将生成以下快照。

```js title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Page HTML Tree 1`] = `
HTMLTag {
  children: [
    HTMLTag {
      children: [
        HTMLTag {
          children: [
            "Simple SSR Example",
          ],
          name: "title",
        },
      ],
      name: "head",
    },
    HTMLTag {
      children: [
        HTMLTag {
          children: [
            "Simple SSR Example",
          ],
          name: "h1",
        },
        HTMLTag {
          children: [
            "Ex of customInspect for a snapshot of an SSR representation",
          ],
          name: "p",
        },
      ],
      name: "body",
    },
  ],
  name: "html",
}
`;
```

你可以看到这个快照不太容易阅读。这是因为：

1. 键按字母顺序排序，所以元素的名称显示在它的子元素之后。
2. 它包括大量额外的信息，导致快照长度超过两倍。
3. 它不是数据表示的 HTML 的准确序列化。

请注意，在这个示例中，完全可以通过调用以下方式获得相同的结果：

```ts，忽略
await assertSnapshot(t, page.render(0));
```

但是，根据您选择公开的公共 API，可能在其他情况下不太实际。

还值得考虑，这将对快照测试以外的其他方面产生影响。例如，当调用 `console.log`
和某些其他情况时，也会使用 `Deno.customInspect`
来序列化对象。这可能是可取的，也可能不是。
