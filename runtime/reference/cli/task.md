---
title: "`deno task`"
oldUrl:
 - /runtime/tools/task_runner/
 - /runtime/manual/tools/task_runner/
 - /runtime/reference/cli/task_runner/
command: task
---

## 描述

`deno task` 提供了一种跨平台的方式来定义和执行特定于代码库的自定义命令。

要开始使用，请在代码库的 [Deno 配置文件](/runtime/fundamentals/configuration/)
中的 `"tasks"` 键下定义你的命令。

例如：

```jsonc
{
  "tasks": {
    "data": "deno task collect && deno task analyze",
    "collect": "deno run --allow-read=. --allow-write=. scripts/collect.js",
    "analyze": {
      "description": "运行分析脚本",
      "command": "deno run --allow-read=. scripts/analyze.js"
    }
  }
}
```

## 指定当前工作目录

默认情况下，`deno task` 以 Deno 配置文件（例如
_deno.json_）所在的目录作为当前工作目录执行命令。这允许任务使用相对路径，并且无论你在目录树中的哪个位置执行
`deno task`，任务都能继续工作。在某些情况下，这可能不是期望的行为，可以通过
`INIT_CWD` 环境变量覆盖此行为。

如果未设置，`INIT_CWD` 将被设置为运行任务的目录的完整路径。这与 `npm run`
的行为一致。

例如，以下任务将任务的当前工作目录更改为用户运行任务的目录，然后输出当前工作目录，该目录现在就是该目录（请记住，这在
Windows 上也有效，因为 `deno task` 是跨平台的）。

```json
{
  "tasks": {
    "my_task": "cd $INIT_CWD && pwd"
  }
}
```

## 获取运行 `deno task` 的目录

由于任务是以 Deno 配置文件所在的目录作为当前工作目录运行的，因此了解 `deno task`
是从哪个目录执行的可能会很有用。这可以通过在任务或从 `deno task`
启动的脚本中使用 `INIT_CWD` 环境变量来实现（与 `npm run`
中的工作方式相同，但以跨平台的方式）。

例如，要在任务中向脚本提供此目录，请执行以下操作（请注意，目录用双引号括起来，以保持其作为单个参数，以防它包含空格）：

```json
{
  "tasks": {
    "start": "deno run main.ts \"$INIT_CWD\""
  }
}
```

## 任务的通配符匹配

`deno task` 命令可以通过传递通配符模式来并行运行多个任务。通配符模式使用 `*`
字符指定。

```json title="deno.json"
{
  "tasks": {
    "build-client": "deno run -RW client/build.ts",
    "build-server": "deno run -RW server/build.ts"
  }
}
```

运行 `deno task "build-*"` 将同时运行 `build-client` 和 `build-server` 任务。

:::note

**使用通配符时** 请确保引用任务名称（例如 `"build-*"`），否则你的 shell
可能会尝试扩展通配符字符，导致意外的错误。

:::

## 任务依赖

你可以为任务指定依赖项：

```json title="deno.json"
{
  "tasks": {
    "build": "deno run -RW build.ts",
    "generate": "deno run -RW generate.ts",
    "serve": {
      "command": "deno run -RN server.ts",
      "dependencies": ["build", "generate"]
    }
  }
}
```

在上面的示例中，运行 `deno task serve` 将首先并行执行 `build` 和 `generate`
任务，一旦它们都成功完成，`serve` 任务将被执行：

```bash
$ deno task serve
Task build deno run -RW build.ts
Task generate deno run -RW generate.ts
生成数据中...
开始构建...
构建完成
数据生成完成
Task serve deno run -RN server.ts
监听于 http://localhost:8000/
```

依赖任务并行执行，默认的并行限制等于你机器上的核心数。要更改此限制，请使用
`DENO_JOBS` 环境变量。

依赖项会被跟踪，如果多个任务依赖于同一个任务，则该任务只会运行一次：

```jsonc title="deno.json"
{
  //   a
  //  / \
  // b   c
  //  \ /
  //   d
  "tasks": {
    "a": {
      "command": "deno run a.js",
      "dependencies": ["b", "c"]
    },
    "b": {
      "command": "deno run b.js",
      "dependencies": ["d"]
    },
    "c": {
      "command": "deno run c.js",
      "dependencies": ["d"]
    },
    "d": "deno run d.js"
  }
}
```

```bash
$ deno task a
Task d deno run d.js
运行 d
Task c deno run c.js
运行 c
Task b deno run b.js
运行 b
Task a deno run a.js
运行 a
```

如果发现依赖项之间存在循环，将返回错误：

```jsonc title="deno.json"
{
  "tasks": {
    "a": {
      "command": "deno run a.js",
      "dependencies": ["b"]
    },
    "b": {
      "command": "deno run b.js",
      "dependencies": ["a"]
    }
  }
}
```

```bash
$ deno task a
检测到任务循环：a -> b -> a
```

你也可以指定一个没有 `command` 但有 `dependencies`
的任务。这对于将多个任务逻辑分组在一起很有用：

```json title="deno.json"
{
  "tasks": {
    "dev-client": "deno run --watch client/mod.ts",
    "dev-server": "deno run --watch sever/mod.ts",
    "dev": {
      "dependencies": ["dev-client", "dev-server"]
    }
  }
}
```

运行 `deno task dev` 将并行运行 `dev-client` 和 `dev-server`。

## Node 和 npx 二进制支持

默认情况下，`deno task` 将使用 `deno` 二进制文件执行命令。如果你需要确保命令使用
`npm` 或 `npx` 二进制文件运行，可以分别调用 `npm` 或 `npx` 的 `run` 命令。例如：

```json
{
  "tasks": {
    "test:node": "npm run test"
  }
}
```

## 工作区支持

`deno task`
可以在工作区中使用，以并行运行来自多个成员目录的任务。要执行所有工作区成员的
`dev` 任务，请使用 `--recursive` 标志：

```jsonc title="deno.json"
{
  "workspace": [
    "client",
    "server"
  ]
}
```

```jsonc title="client/deno.json"
{
  "name": "@scope/client",
  "tasks": {
    "dev": "deno run -RN build.ts"
  }
}
```

```jsonc title="server/deno.json"
{
  "name": "@scope/server",
  "tasks": {
    "dev": "deno run -RN server.ts"
  }
}
```

```bash
$ deno task --recursive dev
Task dev deno run -RN build.ts
Task dev deno run -RN server.ts
打包项目中...
监听于 http://localhost:8000/
项目打包完成
```

可以根据工作区成员过滤要运行的任务：

```bash
$ deno task --filter "client" dev
Task dev deno run -RN build.ts
打包项目中...
项目打包完成
```

请注意，过滤器与每个成员的 `deno.json` 文件中的 `name`
字段指定的工作区成员名称匹配。

## 语法

`deno task` 使用一个跨平台的 shell，它是 sh/bash 的子集，用于执行定义的任务。

### 布尔列表

布尔列表提供了一种基于初始命令的退出代码执行附加命令的方式。它们使用 `&&` 和
`||` 运算符分隔命令。

`&&` 运算符提供了一种执行命令的方式，如果它 _成功_（退出代码为
`0`），它将执行下一个命令：

```sh
deno run --allow-read=. --allow-write=. collect.ts && deno run --allow-read=. analyze.ts
```

`||` 运算符则相反。它提供了一种执行命令的方式，只有在它
_失败_（退出代码非零）时才会执行下一个命令：

```sh
deno run --allow-read=. --allow-write=. collect.ts || deno run play_sad_music.ts
```

### 顺序列表

顺序列表与布尔列表类似，但无论列表中的上一个命令是否通过或失败，都会执行。命令用分号（`;`）分隔。

```sh
deno run output_data.ts ; deno run --allow-net server.ts
```

### 异步命令

异步命令提供了一种使命令异步执行的方式。这在启动多个进程时很有用。要使命令异步，请在命令末尾添加
`&`。例如，以下命令将同时执行 `sleep 1 && deno run --allow-net server.ts` 和
`deno run --allow-net client.ts`：

```sh
sleep 1 && deno run --allow-net server.ts & deno run --allow-net client.ts
```

与大多数 shell
不同，第一个失败的异步命令将导致所有其他命令立即失败。在上面的示例中，这意味着如果服务器命令失败，客户端命令也会失败并退出。你可以通过在命令末尾添加
`|| true` 来退出此行为，这将强制返回 `0` 退出代码。例如：

```sh
deno run --allow-net server.ts || true & deno run --allow-net client.ts || true
```

### 环境变量

环境变量定义如下：

```sh
export VAR_NAME=value
```

以下是一个在任务中使用环境变量的示例，首先进行 shell
变量替换，然后将其作为生成的 Deno 进程的环境的一部分导出（请注意，在 JSON
配置文件中，双引号需要用反斜杠转义）：

```sh
export VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

将输出：

```console
hello
Deno: hello
```

#### 为命令设置环境变量

要在命令之前指定环境变量，请按如下方式列出它们：

```console
VAR=hello VAR2=bye deno run main.ts
```

这将为以下命令专门使用这些环境变量。

### Shell 变量

Shell 变量与环境变量类似，但不会导出到生成的命令中。它们使用以下语法定义：

```sh
VAR_NAME=value
```

如果我们在一个类似于前面“环境变量”部分的示例中使用 shell 变量而不是环境变量：

```sh
VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

我们将得到以下输出：

```console
hello
Deno: undefined
```

当我们想要重用某个值但不希望它在任何生成的进程中可用时，Shell 变量会很有用。

### 退出状态变量

之前运行的命令的退出代码在 `$?` 变量中可用。

```sh
# 输出 10
deno eval 'Deno.exit(10)' || echo $?
```

### 管道

管道提供了一种将一个命令的输出传递给另一个命令的方式。

以下命令将 stdout 输出 "Hello" 传递给生成的 Deno 进程的 stdin：

```sh
echo Hello | deno run main.ts
```

要同时传递 stdout 和 stderr，请使用 `|&`：

```sh
deno eval 'console.log(1); console.error(2);' |& deno run main.ts
```

### 命令替换

`$(command)` 语法提供了一种在其他执行的命令中使用命令输出的方式。

例如，要将获取最新 git 修订版的输出传递给另一个命令，你可以执行以下操作：

```sh
deno run main.ts $(git rev-parse HEAD)
```

另一个使用 shell 变量的示例：

```sh
REV=$(git rev-parse HEAD) && deno run main.ts $REV && echo $REV
```

### 取反退出代码

要取反退出代码，请在命令前添加感叹号和空格：

```sh
# 将退出代码从 1 更改为 0
! deno eval 'Deno.exit(1);'
```

### 重定向

重定向提供了一种将 stdout 和/或 stderr 重定向到文件的方式。

例如，以下命令将 `deno run main.ts` 的 _stdout_ 重定向到文件系统上的 `file.txt`
文件：

```sh
deno run main.ts > file.txt
```

要重定向 _stderr_，请使用 `2>`：

```sh
deno run main.ts 2> file.txt
```

要同时重定向 stdout _和_ stderr，请使用 `&>`：

```sh
deno run main.ts &> file.txt
```

要追加到文件而不是覆盖现有文件，请使用两个右尖括号而不是一个：

```sh
deno run main.ts >> file.txt
```

通过重定向到 `/dev/null` 可以抑制命令的 stdout、stderr 或两者。这在包括 Windows
在内的跨平台方式中有效。

```sh
# 抑制 stdout
deno run main.ts > /dev/null
# 抑制 stderr
deno run main.ts 2> /dev/null
# 抑制 stdout 和 stderr
deno run main.ts &> /dev/null
```

或者将 stdout 重定向到 stderr，反之亦然：

```sh
# 将 stdout 重定向到 stderr
deno run main.ts >&2
# 将 stderr 重定向到 stdout
deno run main.ts 2>&1
```

输入重定向也支持：

```sh
# 将 file.txt 重定向到 gzip 的 stdin
gzip < file.txt
```

请注意，目前不支持多个重定向。

### 跨平台 shebang

从 Deno 1.42 开始，`deno task` 将以相同的方式在所有平台上执行以
`#!/usr/bin/env -S` 开头的脚本。

例如：

```ts title="script.ts"
#!/usr/bin/env -S deno run
console.log("Hello there!");
```

```json title="deno.json"
{
  "tasks": {
    "hi": "./script.ts"
  }
}
```

然后在 Windows 机器上：

```sh
> pwd
C:\Users\david\dev\my_project
> deno task hi
Hello there!
```

### 通配符扩展

Deno 1.34 及以上版本支持通配符扩展。这允许以跨平台的方式指定通配符来匹配文件。

```console
# 匹配当前目录和子目录中的 .ts 文件
echo **/*.ts
# 匹配当前目录中的 .ts 文件
echo *.ts
# 匹配以 "data" 开头，后跟一个数字，并以 .csv 结尾的文件
echo data[0-9].csv
```

支持的通配符字符是 `*`、`?` 和 `[`/`]`。

## 内置命令

`deno task` 附带了一些内置命令，这些命令在 Windows、Mac 和 Linux 上开箱即用。

- [`cp`](https://man7.org/linux/man-pages/man1/cp.1.html) - 复制文件。
- [`mv`](https://man7.org/linux/man-pages/man1/mv.1.html) - 移动文件。
- [`rm`](https://man7.org/linux/man-pages/man1/rm.1.html) - 删除文件或目录。
  - 例如：`rm -rf [FILE]...` - 通常用于递归删除文件或目录。
- [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) - 创建目录。
  - 例如：`mkdir -p DIRECTORY...` -
    通常用于创建目录及其所有父目录，如果目录已存在则不会报错。
- [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) -
  打印当前/工作目录的名称。
- [`sleep`](https://man7.org/linux/man-pages/man1/sleep.1.html) -
  延迟指定的时间。
  - 例如：`sleep 1` 延迟 1 秒，`sleep 0.5` 延迟半秒，或 `sleep 1m` 延迟一分钟
- [`echo`](https://man7.org/linux/man-pages/man1/echo.1.html) - 显示一行文本。
- [`cat`](https://man7.org/linux/man-pages/man1/cat.1.html) -
  连接文件并将其输出到 stdout。当未提供参数时，它读取并输出 stdin。
- [`exit`](https://man7.org/linux/man-pages/man1/exit.1p.html) - 导致 shell
  退出。
- [`head`](https://man7.org/linux/man-pages/man1/head.1.html) -
  输出文件的第一部分。
- [`unset`](https://man7.org/linux/man-pages/man1/unset.1p.html) -
  取消设置环境变量。
- [`xargs`](https://man7.org/linux/man-pages/man1/xargs.1p.html) - 从 stdin
  构建参数并执行命令。

如果你发现某个命令缺少有用的标志，或者有任何建议认为应该开箱即用地支持其他命令，请在
[deno_task_shell](https://github.com/denoland/deno_task_shell/) 仓库中
[提交问题](https://github.com/denoland/deno_task_shell/issues)。

请注意，如果你希望在 Mac 或 Linux
上以非跨平台的方式执行这些命令中的任何一个，可以通过 `sh`
运行它：`sh -c <command>`（例如 `sh -c cp source destination`）。

## package.json 支持

如果发现 `package.json` 文件，`deno task` 会回退到读取其中的 `"scripts"`
条目。请注意，Deno 不尊重或支持任何 npm 生命周期事件，如 `preinstall` 或
`postinstall`——你必须显式运行你想要运行的脚本条目（例如
`deno install --entrypoint main.ts && deno task postinstall`）。
