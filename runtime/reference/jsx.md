---
title: "JSX"
oldUrl:
  - /deploy/manual/using-jsx/
  - /runtime/manual/advanced/jsx_dom/jsx/
  - /runtime/manual/advanced/jsx/
---

Deno 内置支持 `.jsx` 文件和 `.tsx` 文件中的 JSX。在 Deno 中，JSX
可以方便地用于服务器端渲染或生成供浏览器使用的代码。

## 默认配置

Deno CLI 有一个与 `tsc` 默认配置不同的 JSX 默认配置。实际上，Deno 默认使用以下
[TypeScript 编译器](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
选项：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "React.createElement",
    "jsxFragmentFactory": "React.Fragment"
  }
}
```

使用 `"react"` 选项会将 JSX 转换为以下 JavaScript 代码：

```jsx
// 输入
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// 输出：
const jsx = React.createElement(
  "div",
  { className: "foo" },
  React.createElement(MyComponent, { value: 2 }),
);
```

## JSX 自动运行时（推荐）

在 React 17 中，React 团队添加了所谓的
[新的 JSX 转换](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)。这增强并现代化了
JSX 转换的 API，同时提供了一种自动添加相关 JSX
导入的机制，这样你就不必自己手动添加。这是使用 JSX 的推荐方式。

要使用较新的 JSX 运行时转换，请更改 `deno.json` 中的编译器选项。

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "npm:react"
  }
}
```

在幕后，`jsxImportSource` 设置将始终在导入说明符后附加 `/jsx-runtime`。

```js
// 此导入将自动插入
import { jsx as _jsx } from "react/jsx-runtime";
```

使用 `"react-jsx"` 选项会将 JSX 转换为以下 JavaScript 代码：

```jsx
// 输入
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// 输出
import { jsx as _jsx } from "react/jsx-runtime";
const jsx = _jsx(
  "div",
  {
    className: "foo",
    children: _jsx(MyComponent, { value: 2 }),
  },
);
```

如果你想使用 [Preact](https://preactjs.com/) 而不是 React，可以相应地更新
`jsxImportSource` 值。

```diff title="deno.json"
  {
    "compilerOptions": {
      "jsx": "react-jsx",
-     "jsxImportSource": "react"
+     "jsxImportSource": "preact"
    },
    "imports": {
-     "react": "npm:react"
+     "preact": "npm:preact"
    }
  }
```

### 开发转换

将 `"jsx"` 选项设置为 `"react-jsxdev"` 而不是 `"react-jsx"` 将为每个 JSX
节点传递额外的调试信息。这些额外信息包括每个 JSX
节点调用点的文件路径、行号和列号。

这些信息通常用于框架中以增强开发期间的调试体验。在 React
中，这些信息用于增强堆栈跟踪，并在 React
开发者工具浏览器扩展中显示组件的实例化位置。

使用 `"react-jsxdev"` 选项会将 JSX 转换为以下 JavaScript 代码：

```jsx
// 输入
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// 输出
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const _jsxFileName = "file:///input.tsx";
const jsx = _jsxDEV(
  "div",
  {
    className: "foo",
    children: _jsxDEV(
      MyComponent,
      {
        value: 2,
      },
      void 0,
      false,
      {
        fileName: _jsxFileName,
        lineNumber: 3,
        columnNumber: 5,
      },
      this,
    ),
  },
  void 0,
  false,
  {
    fileName: _jsxFileName,
    lineNumber: 1,
    columnNumber: 14,
  },
  this,
);
```

:::caution

仅在开发期间使用 `"react-jsxdev"` 信息，不要在生产环境中使用。

:::

### 使用 JSX 导入源 pragma

无论你是否为项目配置了 JSX 导入源，或者你使用的是默认的“传统”配置，你都可以在
`.jsx` 或 `.tsx` 模块中添加 JSX 导入源 pragma，Deno 会尊重它。

`@jsxImportSource` pragma 需要放在模块的头部注释中。例如，要从 esm.sh 使用
Preact，你可以这样做：

```jsx
/** @jsxImportSource https://esm.sh/preact */

export function App() {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
```

### `jsxImportSourceTypes`

在某些情况下，库可能不提供类型。要指定类型，你可以使用 `@jsxImportSourceTypes`
pragma：

```jsx
/** @jsxImportSource npm:react@^18.3 */
/** @jsxImportSourceTypes npm:@types/react@^18.3 */

export function Hello() {
  return <div>Hello!</div>;
}
```

或者通过 `deno.json` 中的 `jsxImportSourceTypes` 编译器选项指定：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "npm:react@^18.3",
    "jsxImportSourceTypes": "npm:@types/react@^18.3"
  }
}
```

## JSX 预编译转换

Deno 附带了一个
[新的 JSX 转换](https://deno.com/blog/v1.38#fastest-jsx-transform)，它针对服务器端渲染进行了优化。它比其他
JSX 转换选项快 **7-20 倍**。不同之处在于，预编译转换会静态分析你的
JSX，并在可能的情况下存储预编译的 HTML 字符串。这样可以避免大量创建 JSX
对象的时间。

要使用预编译转换，请将 `jsx` 选项设置为 `"precompile"`。

```diff title="deno.json"
  {
    "compilerOptions": {
+     "jsx": "precompile",
      "jsxImportSource": "preact"
    },
    "imports": {
      "preact": "npm:preact"
    }
  }
```

为了防止表示 HTML 元素的 JSX 节点被预编译，你可以将它们添加到
`jsxPrecompileSkipElements` 设置中。

```diff title="deno.json"
  {
    "compilerOptions": {
      "jsx": "precompile",
      "jsxImportSource": "preact",
+     "jsxPrecompileSkipElements": ["a", "link"]
    },
    "imports": {
      "preact": "npm:preact"
    }
  }
```

:::note

`precompile` 转换最适合与 [Preact](https://preactjs.com/) 或
[Hono](https://hono.dev/) 一起使用。它在 React 中不受支持。

:::

使用 `"precompile"` 选项会将 JSX 转换为以下 JavaScript 代码：

```jsx
// 输入
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// 输出：
import {
  jsx as _jsx,
  jsxTemplate as _jsxTemplate,
} from "npm:preact/jsx-runtime";
const $$_tpl_1 = [
  '<div class="foo">',
  "</div>",
];
function MyComponent() {
  return null;
}
const jsx = _jsxTemplate(
  $$_tpl_1,
  _jsx(MyComponent, {
    value: 2,
  }),
);
```
