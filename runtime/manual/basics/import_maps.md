# 导入映射

为了让 Deno 能够解析像 `"react"` 或 `"lodash"` 这样的
_裸规范_，它需要知道在哪里查找它。`"lodash"` 是指一个 npm 模块，还是映射到一个
https URL？

```ts, ignore
import lodash from "lodash";
```

Node 和 npm 使用 `package.json` 和 `node_modules`
文件夹来进行这个解析。另一方面，Deno 使用
[导入映射](https://github.com/WICG/import-maps) 标准。

要使上面的 `import lodash from "lodash"` 工作，将以下内容添加到
[`deno.json` 配置文件](../getting_started/configuration_file.md)。

```json
{
  "imports": {
    "lodash": "https://esm.sh/lodash@4.17.21"
  }
}
```

`deno.json` 文件会自动发现并起到（除其他功能外）导入映射的作用。
[在这里了解更多关于 `deno.json` 的信息](../getting_started/configuration_file.md)。

这也适用于 npm 规范。与上面的方法不同，我们也可以在 `deno.json`
配置文件中编写类似的内容：

```json
{
  "imports": {
    "lodash": "npm:lodash@^4.17"
  }
}
```

## 示例 - 通过 `fmt/` 使用 deno_std 的 fmt 模块

```json title="deno.json"
{
  "imports": {
    "fmt/": "https://deno.land/std@$STD_VERSION/fmt/"
  }
}
```

```ts title="color.ts"
import { red } from "fmt/colors.ts";

console.log(red("hello world"));
```

## 示例 - 使用项目根目录进行绝对导入

要在项目根目录中进行绝对导入：

```json title="deno.json"
{
  "imports": {
    "/": "./",
    "./": "./"
  }
}
```

这将导致以 `/` 开头的导入规范相对于 导入映射的 URL 或文件路径进行解析。

## 覆盖导入

导入映射非常有用的另一种情况是在特定模块中覆盖导入。

假设您希望将 deno_std 从 0.177.0 覆盖到所有导入的模块中的最新版本，但对于
`https://deno.land/x/example/` 模块，您希望使用本地 `patched`
目录中的文件。您可以使用导入映射中的作用域来实现这样的效果，示例如下：

```json
{
  "imports": {
    "https://deno.land/std@0.177.0/": "https://deno.land/std@$STD_VERSION/"
  },
  "scopes": {
    "https://deno.land/x/example/": {
      "https://deno.land/std@0.177.0/": "./patched/"
    }
  }
}
```

## 导入映射适用于应用程序

值得注意的是，导入映射配置文件仅适用于 Deno
应用程序，而不适用于您的应用程序代码可能导入的各种库。这使您作为应用程序作者能够决定包含在您的项目中的库的版本。

如果您正在开发一个库，您应该更倾向于使用
[管理依赖](../../tutorials/manage_dependencies.md) 中讨论的 `deps.ts` 模式。
