---
title: "可执行脚本"
url: /examples/hashbang_tutorial/
oldUrl:
  - /runtime/manual/examples/hashbang/
  - /runtime/tutorials/hashbang/
---

在创建小型工具或实用程序时，使 Deno
脚本可执行会非常有用，特别是当你需要处理文件操作、数据处理或重复任务时，这些任务可能希望从命令行运行。可执行脚本允许你创建临时解决方案，而无需设置整个项目。

## 创建示例脚本

要使脚本可执行，请在脚本开头添加一个 hashbang（有时称为
shebang）。这是一个字符序列（#!），它告诉操作系统如何执行脚本。它后面跟着应该用于运行脚本的解释器的路径。

:::note

要在 Windows 上使用 hashbang，你需要安装 Windows Subsystem for Linux (WSL)
或使用类似 Unix 的 shell，如 [Git Bash](https://git-scm.com/downloads)。

:::

我们将创建一个简单的脚本，使用 [Deno.env](/api/deno/~/Deno.env) API 打印 Deno
的安装路径。

创建一个名为 `hashbang.ts` 的文件，内容如下：

```ts title="hashbang.ts"
#!/usr/bin/env -S deno run --allow-env
const path = Deno.env.get("DENO_INSTALL");

console.log("Deno Install Path:", path);
```

此脚本告诉系统使用 deno 运行时来运行脚本。-S
标志将命令拆分为参数，并指示应将后续参数（`deno run --allow-env`）传递给 env
命令。

然后，脚本使用 `Deno.env.get()` 检索与名为 `DENO_INSTALL`
的环境变量关联的值，并将其分配给名为 `path` 的变量。最后，它使用 `console.log()`
将路径打印到控制台。

### 执行脚本

为了执行脚本，你可能需要为脚本赋予执行权限，你可以使用 `chmod` 命令并添加 `+x`
标志（表示执行）：

```sh
chmod +x hashbang.ts
```

你可以直接在命令行中执行脚本：

```sh
./hashbang.ts
```

## 在无扩展名的文件中使用 hashbang

为了简洁起见，你可能希望省略脚本文件名的扩展名。在这种情况下，请在脚本本身中使用
`--ext` 标志提供一个扩展名，然后你可以仅使用文件名运行脚本：

```shell title="my_script"
$ cat my_script
#!/usr/bin/env -S deno run --allow-env --ext=js
console.log("Hello!");
$ ./my_script
Hello!
```

🦕 现在你可以直接从命令行执行 Deno
脚本了！记得为你的脚本文件设置执行权限（`chmod +x`），你就可以开始构建从简单实用程序到复杂工具的任何东西了。查看
[Deno 示例](/examples/) 以获取脚本灵感的启发。
