# package.json 兼容性

Deno 支持根据当前或祖先目录中的 `package.json` 文件解析依赖项。这类似于 Node.js
解析依赖项的方式。我们建议使用 `deno.json` 配合导入映射，详细说明在
[这里](../basics/import_maps.md)。

```json title="package.json"
{
  "name": "@deno/my-example-project",
  "description": "使用 Deno 创建的示例应用程序",
  "type": "module",
  "scripts": {
    "dev": "deno run --allow-env --allow-sys main.ts"
  },
  "dependencies": {
    "chalk": "^5.2"
  }
}
```

```ts title="main.ts"
import chalk from "chalk";

console.log(chalk.green("来自 Deno 的问候!"));
```

然后我们可以运行这个脚本：

```shell
> deno run --allow-env --allow-sys main.ts
来自 Deno 的问候!
```

或者通过 `deno task` 也可以执行 package.json 脚本：

```shell
> deno task dev
来自 Deno 的问候!
```
