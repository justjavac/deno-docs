# 创建子进程

## 概念

- Deno 能够通过 [Deno.Command](https://deno.land/api?s=Deno.Command)
  来生成子进程。
- 生成子进程需要 `--allow-run` 权限。
- 生成的子进程不在安全沙盒中运行。
- 通过
  [stdin](https://deno.land/api?s=Deno.stdin)、[stdout](https://deno.land/api?s=Deno.stdout)
  和 [stderr](https://deno.land/api?s=Deno.stderr) 流与子进程通信。

## 简单示例

此示例等同于从命令行运行 `'echo hello'`。

```ts
/**
 * subprocess_simple.ts
 */

// 定义用于创建子进程的命令
const command = new Deno.Command(Deno.execPath(), {
  args: [
    "eval",
    "console.log('hello'); console.error('world')",
  ],
});

// 创建子进程并收集输出
const { code, stdout, stderr } = await command.output();

console.assert(code === 0);
console.assert("world\n" === new TextDecoder().decode(stderr));
console.log(new TextDecoder().decode(stdout));
```

运行：

```shell
$ deno run --allow-run --allow-read ./subprocess_simple.ts
hello
```

## 安全性

创建子进程需要 `--allow-run` 权限。请注意，子进程不在 Deno
沙箱中运行，因此具有与从命令行自行运行命令相同的权限。

## 与子进程通信

默认情况下，使用 `Deno.Command()` 时，子进程会继承父进程的 `stdin`、`stdout` 和
`stderr`。如果要与启动的子进程通信，必须使用 `"piped"` 选项。

## 管道到文件

此示例等同于在 bash 中运行 `yes &> ./process_output`。

```ts
/**
 * subprocess_piping_to_file.ts
 */

import {
  mergeReadableStreams,
} from "https://deno.land/std@$STD_VERSION/streams/merge_readable_streams.ts";

// 创建要将进程附加到的文件
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

// 示例：将 stdout 和 stderr 合并并发送到文件
const joined = mergeReadableStreams(
  process.stdout,
  process.stderr,
);

// 返回一个解析进程被终止/关闭时解析的 Promise
joined.pipeTo(file.writable).then(() => console.log("管道连接完成"));

// 手动停止进程，“yes”永远不会自行结束
setTimeout(() => {
  process.kill();
}, 100);
```

运行：

```shell
$ deno run --allow-run --allow-read --allow-write ./subprocess_piping_to_file.ts
```
