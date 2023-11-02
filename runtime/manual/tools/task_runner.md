# 任务运行器

`deno task` 提供了一种跨平台的方法，用于定义和执行特定于代码库的自定义命令。

要开始，请在您的代码库的
[Deno 配置文件](../getting_started/configuration_file.md) 中定义您的命令，位于
`"tasks"` 键下。

例如：

```jsonc
{
  "tasks": {
    "data": "deno task collect && deno task analyze",
    "collect": "deno run --allow-read=. --allow-write=. scripts/collect.js",
    "analyze": "deno run --allow-read=. scripts/analyze.js"
  }
}
```

## 列出任务

要获取显示所有已定义任务的输出，请运行：

```sh
deno task
```

## 执行任务

要执行特定任务，请运行：

```shell
deno task task-name [additional args]...
```

在上面的示例中，要运行 `data` 任务，我们将执行：

```shell
deno task data
```

## 指定当前工作目录

默认情况下，`deno task` 会使用 Deno
配置文件（例如_deno.json_）所在的目录作为当前工作目录来执行命令。这允许任务使用相对路径，并且可以在执行
deno
任务的目录树的任何位置继续工作。在某些情况下，这可能不是期望的行为，可以使用
`INIT_CWD` 环境变量来覆盖此行为。

如果尚未设置，`INIT_CWD` 将设置为任务运行所在目录的完整路径。这与 `npm run`
的行为相同。

例如，以下任务将更改任务的当前工作目录为用户从中运行任务的同一目录，然后输出当前工作目录，即该目录（请记住，这也适用于
Windows，因为 deno task 是跨平台的）。

```
{
  "tasks": {
    "my_task": "cd $INIT_CWD && pwd"
  }
}
```

## 获取 `deno task` 运行的目录

由于任务是在 Deno 配置文件所在的目录作为当前工作目录中运行的，因此可能有必要了解
`deno task` 执行的目录。可以使用 `INIT_CWD` 环境变量在从 `deno task`
启动的任务或脚本中实现这一点（与 `npm run` 中的方式相同，但以跨平台的方式）。

例如，要将此目录提供给任务中的脚本，请执行以下操作（请注意，该目录用双引号括起来，以便保持为单个参数，以防它包含空格）：

```json
{
  "tasks": {
    "start": "deno run main.ts \"$INIT_CWD\""
  }
}
```

## 语法

`deno task` 使用一个交叉平台的 shell，它是 sh/bash 的子集，用于执行定义的任务。

### 布尔列表

布尔列表提供了一种根据初始命令的退出代码执行附加命令的方式。它们使用 `&&` 和
`||` 运算符分隔命令。

`&&` 运算符提供了一种执行命令的方式，如果它“成功”（具有退出代码
`0`），则将执行下一个命令：

```sh
deno run --allow-read=. --allow-write=. collect.ts && deno run --allow-read=. analyze.ts
```

`||`
运算符则相反。它提供了一种执行命令的方式，只有在它“失败”（具有非零退出代码）时才执行下一个命令：

```sh
deno run --allow-read=. --allow-write=. collect.ts || deno run play_sad_music.ts
```

### 顺序列表

顺序列表类似于布尔列表，但不管列表中的前一个命令是否通过或失败，都会执行。命令之间用分号（`;`）分隔。

```sh
deno run output_data.ts ; deno run --allow-net server.ts
```

### 异步命令

异步命令提供了一种使命令异步执行的方法。当启动多个进程时，这可能会很有用。要使命令异步执行，请在其末尾添加
`&`。例如，以下命令将同时执行 `sleep 1 && deno run --allow-net client.ts` 和
`deno run --allow-net server.ts`：

```sh
sleep 1 && deno run --allow-net client.ts & deno run --allow-net server.ts
```

与大多数 shell
不同，第一个失败的异步命令将导致所有其他命令立即失败。在上面的示例中，这意味着如果客户端命令失败，服务器命令也将失败并退出。您可以通过在命令的末尾添加
`|| true` 来退出这种行为，这将强制 `0` 退出代码。例如：

```sh
deno run --allow-net client.ts || true & deno run --allow-net server.ts || true
```

### 环境变量

环境变量的定义如下：

```sh
export VAR_NAME=value
```

以下是在任务中使用 shell 变量替代并将其导出为生成的 Deno
进程的环境的示例（请注意，在 JSON 配置文件中，双引号需要使用反斜杠进行转义）：

```sh
export VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

将输出：

```
hello
Deno: hello
```

#### 为命令设置环境变量

要在命令之前指定环境变量，请将它们列出如下：

```
VAR=hello VAR2=bye deno run main.ts
```

这将专门用于以下命令的环境变量。

### Shell 变量

Shell 变量类似于环境变量，但不会导出到生成的命令中。它们的定义语法如下：

```sh
VAR_NAME=value
```

如果我们在与前面“环境

变量”部分中显示的示例类似的示例中使用 shell 变量而不是环境变量：

```sh
VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

我们将获得以下输出：

```
hello
Deno: undefined
```

当我们想要重用一个值，但不希望在任何生成的进程中使用它时，Shell
变量可能会很有用。

### 管道

管道提供了一种将一个命令的输出传送到另一个命令的方法。

以下命令将 stdout 输出“Hello”传送到生成的 Deno 进程的 stdin：

```sh
echo Hello | deno run main.ts
```

要传送 stdout 和 stderr，请改用 `|&`：

```sh
deno eval 'console.log(1); console.error(2);' |& deno run main.ts
```

### 命令替代

`$(command)` 语法提供了一种在执行其他命令时使用命令输出的方法。

例如，要将获取最新 git 版本的输出提供给另一个命令，您可以执行以下操作：

```sh
deno run main.ts $(git rev-parse HEAD)
```

使用 shell 变量的另一个示例：

```sh
REV=$(git rev-parse HEAD) && deno run main.ts $REV && echo $REV
```

### 否定退出代码

要否定退出代码，请在命令之前添加感叹号和空格：

```sh
将退出代码从 1 更改为 0
! deno eval 'Deno.exit(1);'
```

### 重定向

重定向提供了一种将标准输出和/或标准错误导向文件的方法。

例如，以下将 `deno run main.ts` 的标准输出重定向到文件系统上的 `file.txt` 文件：

```sh
deno run main.ts > file.txt
```

要改为重定向标准错误，请使用 `2>`：

```sh
deno run main.ts 2> file.txt
```

要同时重定向标准输出和标准错误，请使用 `&>`：

```sh
deno run main.ts &> file.txt
```

要追加到文件而不是覆盖现有文件，使用两个右尖括号而不是一个：

```sh
deno run main.ts >> file.txt
```

通过将重定向到 `/dev/null`，可以抑制命令的标准输出、标准错误或两者。这在包括
Windows 在内的跨平台方式上都有效。

```sh
抑制标准输出
deno run main.ts > /dev/null
# 抑制标准错误
deno run main.ts 2> /dev/null
# 抑制标准输出和标准错误
deno run main.ts &> /dev/null
```

请注意，目前不支持重定向输入和多重重定向。

### Glob 扩展

Deno 1.34 及更高版本支持 Glob 扩展。这允许以跨平台方式指定匹配文件的通配符。

```
# 匹配当前目录和子目录中的.ts文件
echo **/*.ts
# 匹配当前目录中的.ts文件
echo *.ts
# 匹配以"data"开头，后跟一个数字，然后以.csv结尾的文件
echo data[0-9].csv
```

支持的通配符字符为 `*`、`?` 和 `[`/`]`。

## 内置命令

`deno task` 附带了几个内置命令，可以在 Windows、Mac 和 Linux 上开箱即用。

- [`cp`](https://man7.org/linux/man-pages/man1/cp.1.html) - 复制文件。
- [`mv`](https://man7.org/linux/man-pages/man1/mv.1.html) - 移动文件。
- [`rm`](https://man7.org/linux/man-pages/man1/rm.1.html) - 删除文件或目录。
  - 例如：`rm -rf [文件]...` - 通常用于递归删除文件或目录。
- [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) - 创建目录。
  - 例如：`mkdir -p 目录...` -
    通常用于创建目录及其所有父目录，如果已存在则不报错。
- [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) -
  显示当前工作目录的名称。
- [`sleep`](https://man7.org/linux/man-pages/man1/sleep.1.html) - 延迟指定时间。
  - 例如：`sleep 1` 休眠 1 秒，`sleep 0.5` 休眠半秒，或 `sleep 1m` 休眠 1 分钟。
- [`echo`](https://man7.org/linux/man-pages/man1/echo.1.html) - 显示一行文本。
- [`cat`](https://man7.org/linux/man-pages/man1/cat.1.html) -
  连接文件并将它们输出到标准输出。如果没有提供参数，它会读取并输出标准输入。
- [`exit`](https://man7.org/linux/man-pages/man1/exit.1p.html) - 导致 shell
  退出。
- [`unset`](https://man7.org/linux/man-pages/man1/unset.1p.html) -
  取消设置环境变量。
- [`xargs`](https://man7.org/linux/man-pages/man1/xargs.1p.html) -
  从标准输入构建参数并执行命令。

如果发现命令上缺少有用的标志，或对于应该默认支持的其他命令有建议，请在
[deno_task_shell](https://github.com/denoland/deno_task_shell/) 存储库上
[提出问题](https://github.com/denoland/deno_task_shell/issues)。

请注意，如果您希望在 Mac 或 Linux 上以非跨平台的方式执行这些命令，可以通过 `sh`
运行它：`sh -c <command>`（例如：`sh -c cp source destination`）。
