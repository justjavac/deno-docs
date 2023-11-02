# 通过 CDN 使用 npm

大多数开发者目前通过使用众多 CDN 之一导入 npm 模块来在 Deno 中使用它们。您可以在
Deno 代码中或直接在浏览器中将 CDN URL 作为 ES 模块引用。这些 CDN URL
可以重复使用，它们还提供了如何在 Deno、浏览器等中使用的说明。

**从 Deno 发行版 1.28 开始**，Deno 还提供了对 [`npm:` 规范](./npm_specifiers.md)
的稳定支持，这是一种在 Deno 中使用 npm 模块的新方法。

**从 Deno 发行版 1.31 开始**，Deno 支持解析 npm 依赖项
[from package.json](./package_json.md)，如果它存在的话。

### esm.sh

[esm.sh](https://esm.sh/) 是一个专为 Deno 设计的 CDN，但也满足了 Deno
的需求，使它成为一种通用的 CDN，用于访问 npm 包作为 ES 模块捆绑包。esm.sh 使用
[esbuild](https://esbuild.github.io/) 来处理任意的 npm 包，并确保它可以作为 ES
模块使用。在许多情况下，您可以将 npm 包导入到您的 Deno 应用程序中：

```tsx
import React from "https://esm.sh/react";

export default class A extends React.Component {
  render() {
    return <div></div>;
  }
}
```

esm.sh 支持使用特定版本的包，以及 [semver](https://semver.npmjs.com/)
版本的包，因此您可以以与导入时类似的方式表达依赖关系，就像在 `package.json`
文件中一样。例如，要获取特定版本的包：

```tsx
import React from "https://esm.sh/react@17.0.2";
```

或者获取次要版本的最新修补程序发布：

```tsx
import React from "https://esm.sh/react@~16.13.0";
```

或导入子模块：

```tsx
import { renderToString } from "https://esm.sh/react-dom/server";
```

或导入常规文件：

```tsx, ignore
import "https://esm.sh/tailwindcss/dist/tailwind.min.css";
```

esm.sh 还自动设置一个标头，Deno 可以识别，允许 Deno
获取包/模块的类型定义。有关此工作原理的更多详细信息，请参见本手册中的
[使用 `X-TypeScript-Types` 标头](../advanced/typescript/types.md)。

esm.sh 还提供了 [自托管 CDN](https://github.com/ije/esm.sh/blob/main/HOSTING.md)
的信息。

请查看 [esm.sh 主页](https://esm.sh/) 以获取有关如何使用 CDN
以及它的特性的更详细信息。

### UNPKG

[UNPKG](https://unpkg.com/) 是最知名的 npm 包的 CDN。对于包括 ES
模块分发以供浏览器等用途的包，很多可以直接从 UNPKG 使用。尽管如此，UNPKG
上提供的所有内容都可以在更适用于 Deno 的 CDN 上找到。

### JSPM

[jspm.io](https://jspm.io) CDN 是专门设计用于以与导入映射良好配合工作的方式提供
npm 和其他注册包作为 ES 模块。虽然它目前不针对 Deno，但由于 Deno
可以利用导入映射，您可以使用 [JSPM.io 生成器](https://generator.jspm.io/)
生成要使用并从 CDN 提供的所有包的导入映射。
