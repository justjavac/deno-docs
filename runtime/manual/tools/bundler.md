# 打包静态资源 (已弃用)

::: 警告

`deno bundle` 已被弃用，并将在将来的某个版本中移除。 请改用
[deno_emit](https://github.com/denoland/deno_emit)、
[esbuild](https://esbuild.github.io/) 或 [rollup](https://rollupjs.org)。

:::

# 打包

`deno bundle [URL]` 将输出一个用于在 Deno 中使用的单个 JavaScript
文件，其中包括指定输入的所有依赖项。例如：

```bash
deno bundle https://deno.land/std/examples/colors.ts colors.bundle.js
Bundle https://deno.land/std/examples/colors.ts
Download https://deno.land/std/examples/colors.ts
Download https://deno.land/std/fmt/colors.ts
Emit "colors.bundle.js" (9.83KB)
```

如果省略输出文件，则捆绑文件将发送到 `stdout`。

这个捆绑文件可以像在 Deno 中的任何其他模块一样运行：

```bash
deno run colors.bundle.js
```

输出是一个自包含的 ES
模块，其中来自命令行指定的主模块的任何导出将可用。例如，如果主模块看起来像这样：

```ts, 忽略
export { foo } from "./foo.js";

export const bar = "bar";
```

它可以像这样导入：

```ts, 忽略
import { bar, foo } from "./lib.bundle.js";
```

## 为 Web 打包

`deno bundle` 的输出旨在在 Deno 中使用，而不是在 Web
浏览器或其他运行时中使用。尽管如此，根据输入的内容，它可能在其他环境中运行。

如果您希望为 Web 打包，我们建议使用其他解决方案，如
[esbuild](https://esbuild.github.io/)。
