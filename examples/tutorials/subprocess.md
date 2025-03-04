---
title: "创建子进程"
url: /examples/subprocess_tutorial/
oldUrl:
  - /runtime/manual/examples/subprocess/
  - /runtime/tutorials/subprocess/
---

## 概念

- Deno 能够通过 [Deno.Command](https://docs.denohub.com/api/deno/~/Deno.Command)
  生成子进程。
- 生成子进程需要 `--allow-run` 权限。
- 生成的子进程不在安全沙箱中运行。
- 通过
  [stdin](https://docs.denohub.com/api/deno/~/Deno.stdin)、[stdout](https://docs.denohub.com/api/deno/~/Deno.stdout)
  和 [stderr](https://docs.denohub.com/api/deno/~/Deno.stderr) 流与子进程通信。

## 简单示例

此示例相当于在命令行中运行 `echo "Hello from Deno!"`。

```ts title="subprocess_simple.ts"
// 定义用于创建子进程的命令
const command = new Deno.Command("echo", {
  args: [
    "Hello from Deno!",
  ],
});

// 创建子进程并收集输出
const { code, stdout, stderr } = await command.output();

console.assert(code === 0);
console.log(new TextDecoder().decode(stdout));
console.log(new TextDecoder().decode(stderr));
```

运行它：

```shell
$ deno run --allow-run=echo ./subprocess_simple.ts
Hello from Deno!
```

## 安全性

创建子进程需要 `--allow-run` 权限。请注意，子进程不在 Deno
沙箱中运行，因此具有与从命令行直接运行命令相同的权限。

## 与子进程通信

默认情况下，使用 `Deno.Command()` 时，子进程会继承父进程的 `stdin`、`stdout` 和
`stderr`。如果你想与启动的子进程通信，必须使用 `"piped"` 选项。

## 管道输出到文件

此示例相当于在 bash 中运行 `yes &> ./process_output`。

```ts title="subprocess_piping_to_files.ts"
import {
  mergeReadableStreams,
} from "jsr:@std/streams@1.0.0-rc.4/merge-readable-streams";

// 创建要附加进程的文件
const file = await Deno.open("./process_output.txt", {
  read: true,
  write: true,
  create: true,
});

// 启动进程
const command = new Deno.Command("yes", {
  stdout: "piped",
  stderr: "piped",
});

const process = command.spawn();

// 将 stdout 和 stderr 合并并发送到文件的示例
const joined = mergeReadableStreams(
  process.stdout,
  process.stderr,
);

// 返回一个在进程被终止/关闭时解析的 Promise
joined.pipeTo(file.writable).then(() => console.log("pipe join done"));

// 手动停止进程，"yes" 永远不会自行结束
setTimeout(() => {
  process.kill();
}, 100);
```

运行它：

```shell
$ deno run --allow-run=yes --allow-read=. --allow-write=. ./subprocess_piping_to_file.ts
```
