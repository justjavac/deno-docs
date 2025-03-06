```json
{
  "title": "Lint 插件"
}
```

:::caution

这是一个实验性功能，需要 Deno `2.2.0` 或更高版本。

插件 API 目前标记为“不稳定”，因为它在未来可能会发生变化。

:::

内置的 linter 可以通过插件进行扩展，以添加自定义的 lint 规则。

虽然 Deno 默认提供了
[许多 lint 规则](/lint/)，但在某些情况下，您可能需要为您的项目量身定制一个特定的规则——无论是为了捕捉特定上下文中的问题，还是为了强制执行公司范围内的约定。

这就是 lint 插件 API 的用武之地。

lint 插件 API 有意模仿了
[ESLint API](https://eslint.org/docs/latest/extend/custom-rules)。虽然这个 API
并不提供 100% 的兼容性，但如果您过去编写过自定义的 [ESLint](https://eslint.org/)
规则，那么大部分现有的知识都可以被重用。

插件通过 `deno.json` 中的 `lint.plugins` 设置加载。

该值是一个插件标识符数组。这些标识符可以是路径、`npm:` 或 `jsr:` 标识符。

```json title="deno.json"
{
  "lint": {
    "plugins": ["./my-plugin.ts"]
  }
}
```

## 示例插件

插件始终具有相同的结构。它有一个默认导出，即您的插件对象。

:::info

Deno 为 lint 插件 API 提供了类型声明。

所有类型声明都位于 `Deno.lint` 命名空间下。

:::

```ts title="my-plugin.ts"
const plugin: Deno.lint.Plugin = {
  // 插件的名称。将在错误输出中显示
  name: "my-plugin",
  // 包含规则的对象。属性名是规则名称，也将在错误输出中显示。
  rules: {
    "my-rule": {
      // 在 `create(context)` 方法中放置您的逻辑。
      // 当文件被 lint 时，它会被调用。
      create(context) {
        // 返回一个 AST 访问者对象
        return {
          // 在这个例子中，我们禁止任何标识符被命名为 `_a`
          Identifier(node) {
            if (node.name === "_a") {
              // 报告一个带有自定义消息的 lint 错误
              context.report({
                node,
                message: "应该是 _b",
                // 可选：提供一个修复，当用户运行 `deno lint --fix` 时可以应用
                fix(fixer) {
                  return fixer.replaceText(node, "_b");
                },
              });
            }
          },
        };
      },
    },
  },
};
export default plugin;
```

## 使用选择器匹配节点

如果您用纯 JavaScript
编写代码来匹配特定节点，有时可能会变得有点繁琐。有时，这种匹配逻辑通过选择器来表达会更容易，类似于
CSS
选择器。通过在返回的访问者对象中使用字符串作为属性名，我们可以指定一个自定义选择器。

```ts title="my-plugin.ts"
const plugin: Deno.lint.Plugin = {
  name: "my-plugin",
  rules: {
    "my-rule": {
      create(context) {
        return {
          // 也可以使用选择器。这里我们检查 `require("...")` 调用。
          'CallExpression[callee.name="require"]'(node) {
            context.report({
              node,
              message: "不要使用 require() 调用来加载模块",
            });
          },
        };
      },
    },
  },
};
export default plugin;
```

请注意，如果匹配逻辑过于复杂，无法仅通过选择器表达，我们始终可以在 JavaScript
中进一步细化匹配。选择器支持的完整语法列表如下：

| 语法                   | 描述             |
| ---------------------- | ---------------- |
| `Foo + Foo`            | 下一个兄弟选择器 |
| `Foo > Bar`            | 子组合器         |
| `Foo ~ Bar`            | 后续兄弟组合器   |
| `Foo Bar`              | 后代组合器       |
| `Foo[attr]`            | 属性存在         |
| `Foo[attr.length < 2]` | 属性值比较       |
| `:first-child`         | 第一个子伪类     |
| `:last-child`          | 最后一个子伪类   |
| `:nth-child(2n + 1)`   | 第 n 个子伪类    |
| `:not(> Bar)`          | 非伪类           |
| `:is(> Bar)`           | 是伪类           |

还有一个 `:exit` 伪类，它仅在整个选择器的末尾有效。当它存在时，Deno 将在
**向上** 遍历树时调用该函数，而不是在向下遍历时调用。

:::tip

我们强烈建议在开发 lint 规则时使用
[typescript-eslint playground](https://typescript-eslint.io/play/)。它允许您检查代码和生成的
AST 格式。这使得更容易看到哪些选择器匹配哪些节点。

:::

## 应用修复

自定义 lint 规则可以在报告问题时提供一个函数来应用修复。可选的 `fix()`
方法在运行 `deno lint --fix` 或通过 Deno LSP 从编辑器内部应用修复时被调用。

`fix()` 方法接收一个 `fixer`
实例，其中包含帮助方法，使创建修复更容易。修复由起始位置、结束位置和应放在此范围内的新文本组成。

```ts
context.report({
  node,
  message: "应该是 _b",
  fix(fixer) {
    return fixer.replaceText(node, "_b");
  },
});
```

`fixer` 对象具有以下方法：

- `insertTextAfter(node, text)`：在给定节点后插入文本。
- `insertTextAfterRange(range, text)`：在给定范围后插入文本。
- `insertTextBefore(node, text)`：在给定节点前插入文本。
- `insertTextBeforeRange(range, text)`：在给定范围前插入文本。
- `remove(node)`：删除给定节点。
- `removeRange(range)`：删除给定范围内的文本。
- `replaceText(node, text)`：替换给定节点中的文本。
- `replaceTextRange(range, text)`：替换给定范围内的文本。

`fix()`
方法还可以返回一个修复数组，或者如果它是一个生成器函数，则可以生成多个修复。

有时需要节点的原始源代码来创建修复。要获取任何节点的源代码，请使用
`context.sourceCode.getText()`：

```ts
context.report({
  node,
  message: "应该是 _b",
  fix(fixer) {
    const original = context.sourceCode.getText(node);
    const newText = `{ ${original} }`;
    return fixer.replaceText(node, newText);
  },
});
```

## 运行清理代码

如果您的插件需要在文件被 lint 后运行清理代码，您可以通过 `destroy()` 钩子连接到
linter。它在文件被 lint 后调用，就在插件上下文被销毁之前。

```ts title="my-plugin.ts"
const plugin: Deno.lint.Plugin = {
  name: "my-plugin",
  rules: {
    "my-rule": {
      create(context) {
        // ...
      },
      // 可选：在文件 lint 完成后运行代码，并且每个规则上下文被销毁。
      destroy() {
        // 如果需要，可以做一些清理工作
      },
    },
  },
};
export default plugin;
```

:::caution

不能安全地假设您的插件代码会为每个被 lint 的文件再次执行。

尽量不要保持全局状态，并在 `destroy` 钩子中进行清理，以防 `deno lint`
决定重用现有的插件实例。

:::

## 排除自定义规则

与内置规则类似，您可以禁用插件提供的自定义规则。为此，请将其添加到 `deno.json`
中的 `lint.rules.exclude` 键。自定义 lint 规则的格式始终为
`<插件名称>/<规则名称>`。

```json title="deno.json"
{
  "lint": {
    "plugins": ["./my-plugin.ts"],
    "rules": {
      "exclude": ["my-plugin/my-rule"]
    }
  }
}
```

## 测试插件

`Deno.lint.runPlugin` API
提供了一种方便的方式来测试您的插件。它允许您断言插件在给定特定输入时会产生预期的诊断。

让我们使用上面定义的示例插件：

```ts title="my-plugin_test.ts"
import { assertEquals } from "jsr:@std/assert";
import myPlugin from "./my-plugin.ts";

Deno.test("my-plugin", () => {
  const diagnostics = Deno.lint.runPlugin(
    myPlugin,
    "main.ts", // 虚拟文件名，文件不需要存在。
    "const _a = 'a';",
  );

  assertEquals(diagnostics.length, 1);
  const d = diagnostics[0];
  assertEquals(d.id, "my-plugin/my-rule");
  assertEquals(d.message, "应该是 _b");
  assertEquals(d.fix, [{ range: [6, 8], text: "_b" }]);
});
```

:::info

`Deno.lint.runPlugin` API 仅在 `deno test` 和 `deno bench` 子命令中可用。

尝试在任何其他子命令中使用它将抛出错误。

:::

有关 [`Deno.lint.runPlugin`](/api/deno/~/Deno.lint.runPlugin) 和
[`Deno.lint.Diagnostic`](/api/deno/~/Deno.lint.Diagnostic) 的更多信息，请参阅
[API 参考](/api/deno/)。
