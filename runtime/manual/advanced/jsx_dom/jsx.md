# 在 Deno 中配置 JSX

Deno 在 `.jsx` 文件和 `.tsx` 文件中都内置了对 JSX 的支持。在 Deno 中，JSX
可用于服务器端渲染或生成供浏览器使用的代码。

## 默认配置

Deno CLI 具有与 `tsc` 不同的默认 JSX 配置。实际上，Deno 默认使用以下
[TypeScript 编译器选项](https://www.typescriptlang.org/docs/handbook/compiler-options.html)：

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "React.createElement",
    "jsxFragmentFactory": "React.Fragment"
  }
}
```

## JSX 导入源

在 React 17 中，React 团队添加了他们所谓的
[新 JSX 转换](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)。这增强和现代化了
JSX 转换的 API，并提供了一种自动导入 JSX
库到模块中的机制，而不必显式导入它或将其作为全局范围的一部分。通常，这使得在应用程序中使用
JSX 更容易。

截至 Deno 1.16，已经添加了对这些转换的初步支持。Deno 支持 JSX 导入源 pragma
以及在 [配置文件](../../getting_started/configuration_file.md) 中配置 JSX
导入源。

### JSX 运行时

在使用自动转换时，Deno 将尝试导入一个预期符合新 JSX API 的 JSX
运行时模块，该模块位于 `jsx-runtime` 或 `jsx-dev-runtime`。例如，如果配置了 JSX
导入源为 `react`，则生成的代码将在生成的文件中添加以下内容：

```jsx, ignore
import { jsx as _jsx } from "react/jsx-runtime";
```

Deno 通常根据明确的
specifiers（指定符号）运行，这意味着在运行时，它将不会尝试使用除已发出的指定符号之外的任何其他指定符号。这意味着要成功加载
JSX 运行时，`"react/jsx-runtime"` 需要解析为一个模块。话虽如此，Deno
支持远程模块，并且大多数 CDN 可以轻松解析指定符号。

例如，如果您想要从 [esm.sh](https://esm.sh/) CDN 使用
[Preact](https://preactjs.com/)，您可以将 `https://esm.sh/preact` 用作 JSX
导入源，esm.sh 将解析 `https://esm.sh/preact/jsx-runtime`
为一个模块，并在响应中提供一个标题，告诉 Deno 在哪里找到 Preact 的类型定义。

### 使用 JSX 导入源 pragma

无论您是否为项目配置了 JSX 导入源，或者是否使用默认的“legacy”配置，您都可以在
`.jsx` 或 `.tsx` 模块中添加 JSX 导入源 pragma，Deno 将予以尊重。

`@jsxImportSource` pragma 需要位于模块的前导注释中。例如，要从 esm.sh 使用
Preact，您可以这样做：

```jsx, ignore
/** @jsxImportSource https://esm.sh/preact */

export function App() {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
```

### 在配置文件中使用 JSX 导入源

如果要为整个项目配置 JSX 导入源，以便无需在每个模块中插入 pragma，您可以在
[配置文件](../../getting_started/configuration_file.md) 中使用
`"compilerOptions"` 来指定这一点。例如，如果您将 Preact 用作 JSX 库，来自
esm.sh，您可以在配置文件中配置如下内容：

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "https://esm.sh/preact"
  }
}
```

### 使用导入映射

在无法将导入源加 `/jsx-runtime` 或 `/jsx-dev-runtime`
解析为正确模块的情况下，可以使用导入映射指示 Deno
在哪里找到模块。导入映射也可用于使导入源“更清洁”。例如，如果您想要从 skypack.dev
使用 Preact 并且让 skypack.dev 包含所有类型信息，您可以设置一个导入映射如下：

```json
{
  "imports": {
    "preact/jsx-runtime": "https://cdn.skypack.dev/preact/jsx-runtime?dts",
    "preact/jsx-dev-runtime": "https://cdn.skypack.dev/preact/jsx-dev-runtime?dts"
  }
}
```

然后，您可以使用以下 pragma：

```jsx, ignore
/** @jsxImportSource preact */
```

或者您可以在编译器选项中进行配置：

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

然后，您需要在命令行上传递 `--import-map` 选项（如果使用配置文件，则还需要
`--config` 选项），或在您的 IDE 中设置 `deno.importMap` 选项（以及 `deno.config`
选项）。
