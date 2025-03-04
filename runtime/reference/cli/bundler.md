---
title: "Bundler (已弃用)"
oldUrl: /runtime/manual/cli/bundler/
command: bundle
---

:::caution

`deno bundle` 已被弃用，并将在未来的某个版本中移除。请使用
[deno_emit](https://github.com/denoland/deno_emit)、[esbuild](https://esbuild.github.io/)
或 [rollup](https://rollupjs.org) 替代。

:::

`deno bundle [URL]` 将输出一个供 Deno 使用的单一 JavaScript
文件，其中包含指定输入的所有依赖项。例如：

```bash
$ deno bundle https://deno.land/std@0.190.0/examples/colors.tsts colors.bundle.js
Bundle https://deno.land/std@0.190.0/examples/colors.ts
Download https://deno.land/std@0.190.0/examples/colors.ts
Download https://deno.land/std@0.190.0/fmt/colors.ts
Emit "colors.bundle.js" (9.83KB)
```

如果省略输出文件，打包结果将发送到 `stdout`。

打包后的文件可以像 Deno 中的其他模块一样运行：

```bash
deno run colors.bundle.js
```

输出是一个自包含的 ES
模块，命令行中提供的主模块的任何导出都将可用。例如，如果主模块如下所示：

```ts
export { foo } from "./foo.js";

export const bar = "bar";
```

它可以像这样导入：

```ts
import { bar, foo } from "./lib.bundle.js";
```

## 为 Web 打包

`deno bundle` 的输出旨在供 Deno 使用，而不是用于 Web
浏览器或其他运行时。也就是说，根据输入的不同，它可能在其他环境中也能工作。

如果你希望为 Web 打包，我们推荐使用其他解决方案，例如
[esbuild](https://esbuild.github.io/)。
