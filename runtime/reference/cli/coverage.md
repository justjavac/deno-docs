---
title: "deno coverage"
oldUrl: /runtime/manual/tools/coverage/
command: coverage
---

## 包含与排除

默认情况下，覆盖率包括本地文件系统中存在的任何代码及其导入。

你可以使用 `--include` 和 `--exclude` 选项来自定义包含和排除。

你可以通过使用 `--include`
选项并自定义正则表达式模式来扩展覆盖率，以包括不在本地文件系统中的文件。

```bash
deno coverage --include="^file:|https:"
```

默认的包含模式应该足以满足大多数用例，但你可以自定义它，以更具体地指定哪些文件包含在覆盖率报告中。

文件名中包含 `test.js`、`test.ts`、`test.jsx` 或 `test.tsx` 的文件默认被排除。

这相当于：

```bash
deno coverage --exclude="test\.(js|mjs|ts|jsx|tsx)$"
```

此默认设置可防止你的测试代码影响覆盖率报告。对于 URL
来说，它必须匹配包含模式且不匹配排除模式。

## 忽略代码

可以通过添加覆盖率忽略注释来在生成的覆盖率报告中忽略代码。忽略代码中的分支和行将从报告中排除。忽略的分支和行不计为覆盖行。相反，忽略的代码行被视为空行。

要忽略整个文件，请在文件顶部添加 `// deno-coverage-ignore-file` 注释。

```ts
// deno-coverage-ignore-file

// 此文件中的所有代码都被忽略
```

忽略的文件不会出现在覆盖率报告中。

要忽略单行代码，请在你想要忽略的代码行上方添加 `// deno-coverage-ignore-next`
注释。

```ts
// deno-coverage-ignore-next
console.log("这一行被忽略");
```

要忽略多行代码，请在你想要忽略的代码上方添加 `// deno-coverage-ignore-start`
注释，并在下方添加 `// deno-coverage-ignore-stop` 注释。

```ts
// deno-coverage-ignore-start
if (condition) {
  console.log("分支和行都被忽略");
}
// deno-coverage-ignore-stop
```

在 `// deno-coverage-ignore-start` 注释之后的所有代码都会被忽略，直到遇到
`// deno-coverage-ignore-stop`。但是，如果有多个连续的起始注释，每个起始注释都必须由相应的停止注释终止。

```ts
// deno-coverage-ignore-start
if (condition) {
  // deno-coverage-ignore-start
  console.log("这一行被忽略");
  // deno-coverage-ignore-stop
  console.log("这一行也被忽略");
}
// deno-coverage-ignore-stop

console.log("这一行没有被忽略");
```

覆盖率注释中的覆盖率指令前只能有空白字符。但是，指令后可以有任何文本。

```ts
// deno-coverage-ignore-next 允许尾随文本。
console.log("这一行被忽略");

// 但前导文本不行。 deno-coverage-ignore-next
console.log("这一行没有被忽略");
```

覆盖率注释必须以 `//` 开头。以 `/*` 开头的注释不是有效的覆盖率注释。

```ts
// deno-coverage-ignore-next
console.log("这一行被忽略");

/* deno-coverage-ignore-next */
console.log("这一行没有被忽略");
```

## 输出格式

默认情况下，我们支持 Deno 自己的覆盖率格式——但你也可以输出 lcov 格式或 html
格式的覆盖率报告。

```bash
deno coverage --lcov --output=cov.lcov
```

此 lcov 文件可以用于支持 lcov 格式的其他工具。

```bash
deno coverage --html
```

这将输出一个 html 格式的覆盖率报告。

## 示例

从工作区中的默认覆盖率配置文件中生成覆盖率报告

```bash
deno test --coverage
deno coverage
```

从具有自定义名称的覆盖率配置文件中生成覆盖率报告

```bash
deno test --coverage=custom_profile_name
deno coverage custom_profile_name
```

仅包含匹配特定模式的覆盖率——在这种情况下，仅包含来自 main.ts 的测试

```bash
deno coverage --include="main.ts"
```

将默认覆盖率配置文件中的测试覆盖率导出到 lcov 文件

```bash
deno test --coverage
deno coverage --lcov --output=cov.lcov
```
