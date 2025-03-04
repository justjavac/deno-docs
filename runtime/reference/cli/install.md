---
title: "`deno install`"
oldUrl:
 - /runtime/manual/tools/script_installer/
 - /runtime/reference/cli/script_installer/
 - /runtime/manual/tools/script_installer/
 - /runtime/manual/tools/cache/
 - /runtime/reference/cli/cache/
command: install
---

## 示例

### deno install

使用此命令安装 `deno.json` 和 `package.json` 中定义的所有依赖项。

依赖项将安装在全局缓存中，但如果你的项目有 `package.json` 文件，本地
`node_modules` 目录也将被设置。

### deno install [PACKAGES]

使用此命令安装特定包并将其添加到 `deno.json` 或 `package.json`。

```shell
$ deno install jsr:@std/testing npm:express
```

:::tip

你也可以使用 `deno add`，它是 `deno install [PACKAGES]` 的别名。

:::

如果你的项目有 `package.json` 文件，来自 npm 的包将被添加到 `package.json` 的
`dependencies` 中。否则，所有包都将被添加到 `deno.json`。

### deno install --entrypoint [FILES]

使用此命令安装提供的文件及其依赖项中使用的所有依赖项。

如果你在代码中使用 `jsr:`、`npm:`、`http:` 或 `https:`
说明符，并希望在部署项目之前缓存所有依赖项，这将特别有用。

```js title="main.js"
import * as colors from "jsr:@std/fmt/colors";
import express from "npm:express";
```

```shell
$ deno install -e main.js
Download jsr:@std/fmt
Download npm:express
```

:::tip

如果你想设置本地 `node_modules` 目录，可以传递 `--node-modules-dir=auto` 标志。

某些依赖项可能在没有本地 `node_modules` 目录的情况下无法正常工作。

:::

### deno install --global [PACKAGE_OR_URL]

使用此命令将提供的包或脚本安装为系统上全局可用的二进制文件。

此命令创建一个薄的可执行 shell 脚本，该脚本使用指定的 CLI 标志和主模块调用
`deno`。它被放置在安装根目录中。

示例：

```shell
$ deno install --global --allow-net --allow-read jsr:@std/http/file-server
Download jsr:@std/http/file-server...

✅ 成功安装 file-server。
/Users/deno/.deno/bin/file-server
```

要更改可执行文件的名称，请使用 `-n`/`--name`：

```shell
deno install -g -N -R -n serve jsr:@std/http/file-server
```

默认情况下，可执行文件的名称是推断的：

- 尝试获取 URL 路径的文件名。上面的示例将变为 'file-server'。
- 如果文件名是 'main'、'mod'、'index' 或 'cli'
  等通用名称，并且路径没有父级，则获取父级路径的文件名。否则使用通用名称。
- 如果生成的名称有 '@...' 后缀，则将其删除。

要更改安装根目录，请使用 `--root`：

```shell
deno install -g -N -R --root /usr/local/bin jsr:@std/http/file-server
```

安装根目录按以下顺序确定：

- `--root` 选项
- `DENO_INSTALL_ROOT` 环境变量
- `$HOME/.deno/bin`

如果需要，必须手动将这些路径添加到 PATH 中。

```shell
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

你必须在安装时指定用于运行脚本的权限。

```shell
deno install -g -N -R jsr:@std/http/file-server -- -p 8080
```

上述命令创建一个名为 `file_server`
的可执行文件，该文件具有网络和读取权限，并绑定到端口 8080。

为了良好的实践，请使用 [`import.meta.main`](/runtime/tutorials/module_metadata/)
习惯用法来指定可执行脚本中的入口点。

示例：

```ts
// https://example.com/awesome/cli.ts
async function myAwesomeCli(): Promise<void> {
  // -- snip --
}

if (import.meta.main) {
  myAwesomeCli();
}
```

当你创建可执行脚本时，请确保通过将示例安装命令添加到你的存储库来让用户知道：

```shell
# 使用 deno install 安装

$ deno install -n awesome_cli https://example.com/awesome/cli.ts
```

## 原生 Node.js 插件

许多流行的 npm 包，如 [`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) 或
[`npm:duckdb`](https://www.npmjs.com/package/duckdb)，依赖于
["生命周期脚本"](https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts)，例如
`preinstall` 或 `postinstall`
脚本。大多数情况下，运行这些脚本是包正常工作的必要条件。

与 npm 不同，Deno 默认不运行这些脚本，因为它们可能带来潜在的安全漏洞。

你仍然可以通过在运行 `deno install` 时传递 `--allow-scripts=<packages>`
标志来运行这些脚本：

```shell
deno install --allow-scripts=npm:sqlite3
```

_安装所有依赖项并允许 `npm:sqlite3` 包运行其生命周期脚本_。

## 卸载

你可以使用 `deno uninstall` 命令卸载依赖项或二进制脚本：

```shell
$ deno uninstall express
Removed express
```

```shell
$ deno uninstall -g file-server
deleted /Users/deno/.deno/bin/file-server
✅ 成功卸载 file-server
```

有关更多详细信息，请参阅
[`deno uninstall` 页面](/runtime/reference/cli/uninstall/)。
