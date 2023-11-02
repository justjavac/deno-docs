---
sidebar_position: 4
---

# 命令行界面

Deno 是一个命令行程序。在跟随示例并已经了解了 Shell
的基础知识后，您应该熟悉一些简单的命令。

查看主要帮助文本的多种方法：

```shell
# 使用子命令。
deno help

# 使用短标志 -- 输出与上述相同的内容。
deno -h

# 使用长标志 -- 输出更详细的帮助文本（如果可用）。
deno --help
```

Deno 的 CLI 基于子命令。上述命令应该显示支持的子命令列表，例如
`deno compile`。要查看特定子命令的帮助，例如 `compile`，您可以运行以下之一：

```shell
deno help compile
deno compile -h
deno compile --help
```

每个子命令的详细指南可以在[这里](../index.mdx)找到。

## 脚本来源

Deno 可以从多个来源获取脚本，包括文件名、URL 和 '-'
以从标准输入读取文件。后者对于与其他应用程序集成非常有用。

```shell
deno run main.ts
deno run https://mydomain.com/main.ts
cat main.ts | deno run -
```

## 脚本参数

除了 Deno
运行时标志之外，您可以通过在脚本名称之后指定它们**之后**来传递用户空间参数给您正在运行的脚本：

```shell
deno run main.ts a b -c --quiet
```

```ts
// main.ts
console.log(Deno.args); // [ "a", "b", "-c", "--quiet" ]
```

**请注意，在脚本名称之后传递的任何内容都将作为脚本参数传递，并不会被视为 Deno
运行时标志。** 这导致了以下陷阱：

```shell
# 好的。我们授予 net 权限给 net_client.ts。
deno run --allow-net net_client.ts

# 不好！--allow-net 被传递给 Deno.args，引发了 net 权限错误。
deno run net_client.ts --allow-net
```

有人认为：

> 一个非位置标志的解析方式因其位置而异属于不规范的。

然而：

1. 这是区分运行时标志和脚本参数的最合乎逻辑和人体工程学的方式。
2. 事实上，这与任何其他流行运行时的行为相同。
   - 尝试 `node -c index.js` 和 `node index.js -c`。第一个只会对 `index.js` 执行
     Node 的 `-c` 标志的语法检查。第二个将使用 `-c` 执行 `index.js` 传递给
     `require("process").argv`。

---

存在一些逻辑标志组，它们在相关子命令之间共享。我们将在下面讨论这些标志。

## 观察模式

您可以为 `deno run`、`deno test`、`deno compile` 和 `deno fmt` 提供 `--watch`
标志，以启用内置的文件监视器。被观察的文件取决于所使用的子命令：

- 对于 `deno run`、`deno test` 和
  `deno compile`，入口点和入口点静态导入的所有本地文件都将被观察。
- 对于
  `deno fmt`，所有本地文件和目录（或者如果未传递特定文件/目录，则是工作目录）都将被观察。

每当磁盘上的被观察文件之一发生更改时，程序将自动重新启动/格式化/测试/捆绑。

```shell
deno run --watch main.ts
deno test --watch
deno fmt --watch
```

## 完整性标志（锁定文件）

影响可以将资源下载到缓存的命令：`deno cache`、`deno run`、`deno test`、`deno doc`
和 `deno compile`。

```terminal
--lock <FILE>    检查指定的锁定文件
--lock-write     写入锁定文件。与 --lock 一起使用。
```

在[这里](../basics/modules/integrity_checking.md)了解更多。

## 缓存和编译标志

影响可以填充缓存的命令：`deno cache`、`deno run`、`deno test`、`deno doc` 和
`deno compile`。除了上面的标志之外，还包括影响模块解析、编译配置等的标志。

```terminal
--config <FILE>               加载配置文件
--import-map <FILE>           加载导入映射文件
--no-remote                   不解析远程模块
--reload=<CACHE_BLOCKLIST>    重新加载源代码缓存（重新编译TypeScript）
--unstable                    启用不稳定的API
```

## 运行时标志

影响执行用户代码的命令：`deno run` 和
`deno test`。这些包括上述所有标志以及以下标志。

### 类型检查标志

您可以使用以下命令对代码进行类型检查（而不执行）：

```shell
> deno check main.ts
```

您还可以使用 `deno run` 的 `--check` 参数在执行之前对代码进行类型检查：

```shell
> deno run --check main.ts
```

此标志影响 `deno run`、`deno eval`、`deno repl` 和
`deno cache`。以下表格描述了各个子命令的类型检查行为。在这里，"本地"意味着仅来自本地代码的错误会引起类型错误，从https
URL（远程）导入的模块可能

会有未报告的类型错误。 （要为所有模块启用类型检查，请使用 `--check=all`。）

| 子命令         | 类型检查模式 |
| -------------- | ------------ |
| `deno bench`   | 📁 本地      |
| `deno cache`   | ❌ 无        |
| `deno check`   | 📁 本地      |
| `deno compile` | 📁 本地      |
| `deno eval`    | ❌ 无        |
| `deno repl`    | ❌ 无        |
| `deno run`     | ❌ 无        |
| `deno test`    | 📁 本地      |

### 权限标志

这些列在[这里](../basics/permissions.md#permissions-list)。

### 其他运行时标志

更多影响执行环境的标志。

```terminal
--cached-only                要求远程依赖已经被缓存
--inspect=<HOST:PORT>        在主机:端口上激活检查器...
--inspect-brk=<HOST:PORT>    在主机:端口上激活检查器并中断...
--inspect-wait=<HOST:PORT>   在主机:端口上激活检查器并等待...
--location <HREF>            由一些Web API使用的 'globalThis.location' 的值
--prompt                     如果没有传递所需权限，回退到提示
--seed <NUMBER>              种子 Math.random()
--v8-flags=<v8-flags>        设置V8命令行选项。获取帮助: ...
```

## 自动完成

您可以通过 [Fig](https://fig.io/) 获取 Deno 的 IDE 风格自动完成
<a href="https://fig.io/" target="_blank"><img src="https://fig.io/badges/Logo.svg" width="15" height="15"/></a>。它适用于
bash、zsh 和 fish。

要安装，请运行：

```shell
brew install fig
```
