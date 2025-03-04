---
title: 命令行界面
oldUrl:
 - /manual/getting_started/command_line_interface
 - /runtime/manual/getting_started/command_line_interface/
 - /runtime/fundamentals/command_line_interface/
 - /runtime/manual/tools/
---

Deno 是一个命令行程序。Deno
命令行界面（CLI）可用于运行脚本、管理依赖项，甚至将代码编译为独立的可执行文件。您可能已经通过前面的示例熟悉了一些简单的命令。本页将提供更详细的
Deno CLI 概述。

Deno CLI 有许多子命令（如 `run`、`init` 和 `test` 等）。它们用于在 Deno
运行时环境中执行不同的任务。每个子命令都有自己的一组标志和选项（例如
--version），可用于自定义其行为。

您可以通过在终端中运行 `deno help` 子命令或使用 `-h` 或 `--help`
标志来查看所有可用的命令和标志。

查看 [CLI 参考指南](/runtime/reference/cli/)
以获取所有子命令和标志的进一步文档。我们将在下面更详细地查看一些命令，了解它们的使用和配置方式。

## 示例子命令 - `deno run`

您可以通过指定相对于当前工作目录的路径来运行本地的 TypeScript 或 JavaScript
文件：

```shell
deno run main.ts
```

Deno 支持直接从 URL 运行脚本。这对于快速测试或运行代码而无需先下载它特别有用：

```shell
deno run https://docs.denohub.com/examples/scripts/hello_world.ts
```

您还可以通过标准输入管道运行脚本。这对于与其他命令行工具集成或动态生成脚本非常有用：

```shell
cat main.ts | deno run -
```

## 传递脚本参数

脚本参数是您可以在从命令行运行脚本时传递给脚本的附加参数。这些参数可用于根据运行时提供的输入自定义程序的行为。参数应在脚本名称**之后**传递。

为了测试这一点，我们可以创建一个脚本，它将记录传递给它的参数：

```ts title="main.ts"
console.log(Deno.args);
```

当我们运行该脚本并传递一些参数时，它会将它们记录到控制台：

```shell
$ deno run main.ts arg1 arg2 arg3
[ "arg1", "arg2", "arg3" ]
```

## 参数和标志顺序

_请注意，脚本名称之后传递的任何内容都将作为脚本参数传递，而不会被 Deno
运行时标志消耗。_ 这会导致以下陷阱：

```shell
# 正确。我们授予 net_client.ts 网络权限。
deno run --allow-net net_client.ts

# 错误！--allow-net 被传递给 Deno.args，抛出网络权限错误。
deno run net_client.ts --allow-net
```

## 常用标志

一些标志可以与多个相关的子命令一起使用。我们在下面讨论这些标志。

### 监视模式

您可以为 `deno run`、`deno test` 和 `deno fmt` 提供 `--watch`
标志以启用内置文件监视器。监视器在检测到源文件中的更改时自动重新加载您的应用程序。这在开发过程中特别有用，因为它允许您立即看到更改的效果，而无需手动重新启动应用程序。

监视的文件将取决于使用的子命令：

- 对于 `deno run` 和 `deno test`，将监视入口点以及入口点静态导入的所有本地文件。
- 对于
  `deno fmt`，将监视作为命令行参数指定的所有本地文件和目录（如果未传递特定文件/目录，则监视工作目录）。

```shell
deno run --watch main.ts
deno test --watch
deno fmt --watch
```

您可以通过提供 `--watch-exclude` 标志来排除路径或模式。语法为
`--watch-exclude=path1,path2`。例如：

```shell
deno run --watch --watch-exclude=file1.ts,file2.ts main.ts
```

这将排除 file1.ts 和 file2.ts 被监视。

要排除模式，请记住将其用引号括起来，以防止 shell 扩展 glob：

```shell
deno run --watch --watch-exclude='*.js' main.ts
```

### 热模块替换模式

您可以将 `--watch-hmr` 标志与 `deno run`
一起使用以启用热模块替换模式。运行时将尝试就地更新程序，而不是重新启动程序。如果就地更新失败，程序仍将重新启动。

```sh
deno run --watch-hmr main.ts
```

当触发热模块替换时，运行时将分派一个类型为 `hmr` 的 `CustomEvent`，其 `detail`
对象中将包含 `path`
属性。您可以监听此事件并在模块更新时执行任何所需的附加逻辑（例如通过 WebSocket
连接通知浏览器）。

```ts
addEventListener("hmr", (e) => {
  console.log("HMR triggered", e.detail.path);
});
```

### 完整性标志（锁定文件）

影响可以下载资源到缓存的命令：`deno install`、`deno run`、`deno test`、`deno doc`
和 `deno compile`。

```sh
--lock <FILE>    检查指定的锁定文件
--frozen[=<BOOLEAN>] 如果锁定文件过期则报错
```

了解更多信息，请参见
[这里](/runtime/fundamentals/modules/#integrity-checking-and-lock-files)。

### 缓存和编译标志

影响可以填充缓存的命令：`deno install`、`deno run`、`deno test`、`deno doc` 和
`deno compile`。除了上述标志外，还包括影响模块解析、编译配置等的标志。

```sh
--config <FILE>               加载配置文件
--import-map <FILE>           加载导入映射文件
--no-remote                   不解析远程模块
--reload=<CACHE_BLOCKLIST>    重新加载源代码缓存（重新编译 TypeScript）
--unstable                    启用不稳定 API
```

### 运行时标志

影响执行用户代码的命令：`deno run` 和
`deno test`。这些包括上述所有标志以及以下标志。

### 类型检查标志

您可以使用以下命令对代码进行类型检查（而不执行它）：

```shell
> deno check main.ts
```

您还可以通过使用 `--check` 参数在执行前对代码进行类型检查：

```shell
> deno run --check main.ts
```

此标志影响
`deno run`、`deno eval`、`deno repl`。下表描述了各种子命令的类型检查行为。这里的“本地”意味着只有本地代码的错误会引发类型错误，从
https
URL（远程）导入的模块可能包含未报告的类型错误。（要为所有模块启用类型检查，请使用
`--check=all`。）

| 子命令         | 类型检查模式 |
| -------------- | ------------ |
| `deno bench`   | 📁 本地      |
| `deno check`   | 📁 本地      |
| `deno compile` | 📁 本地      |
| `deno eval`    | ❌ 无        |
| `deno repl`    | ❌ 无        |
| `deno run`     | ❌ 无        |
| `deno test`    | 📁 本地      |

### 权限标志

这些列在 [这里](/runtime/fundamentals/security/)。

### 其他运行时标志

更多影响执行环境的标志。

```sh
--cached-only                要求远程依赖项已缓存
--inspect=<HOST:PORT>        在 host:port 上激活检查器 ...
--inspect-brk=<HOST:PORT>    在 host:port 上激活检查器并在 ... 处中断
--inspect-wait=<HOST:PORT>   在 host:port 上激活检查器并等待 ...
--location <HREF>            某些 web API 使用的 'globalThis.location' 的值
--prompt                     如果未传递所需权限，则回退到提示
--seed <NUMBER>              设置 Math.random() 的种子
--v8-flags=<v8-flags>        设置 V8 命令行选项。帮助： ...
```
