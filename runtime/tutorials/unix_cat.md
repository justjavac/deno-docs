# Unix "cat" 程序的实现

## 概念

- 使用 Deno 运行时 API 将文件的内容输出到控制台。
- [Deno.args](https://deno.land/api?s=Deno.args) 用于访问命令行参数。
- [Deno.open](https://deno.land/api?s=Deno.open) 用于获取文件的句柄。
- [Deno.stdout.writable](https://deno.land/api?s=Deno.stdout.writable)
  用于获取控制台标准输出的可写流。
- [Deno.FsFile.readable](https://deno.land/api?s=Deno.FsFile#prop_readable)
  用于从文件获取可读流。（此可读流在完成读取后会关闭文件，因此无需显式关闭文件。）
- 模块可以直接从远程 URL 运行。

## 示例

在这个程序中，每个命令行参数都被假定为文件名，文件被打开，并打印到标准输出（例如控制台）。

```ts
/**
 * cat.ts
 */
for (const filename of Deno.args) {
  const file = await Deno.open(filename);
  await file.readable.pipeTo(Deno.stdout.writable, { preventClose: true });
}
```

运行程序：

```shell
deno run --allow-read https://deno.land/std/examples/cat.ts /etc/passwd
```
