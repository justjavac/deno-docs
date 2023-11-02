# Deno 命名空间 API

全局 Deno 命名空间包含不属于 Web 标准的 API，包括文件读取、打开 TCP 套接字、提供
HTTP 服务、执行子进程等等。

要查看完整的 Deno 内置 API 列表，请参见
[参考文档](https://deno.land/api?s=Deno)。以下是一些最重要的亮点。

## 错误

Deno 运行时附带了
[20 个错误类](https://deno.land/api#Errors)，可以在多种条件下引发。

一些示例包括：

```sh
Deno.errors.NotFound;
Deno.errors.WriteZero;
```

它们可以像下面这样使用：

```ts
try {
  const file = await Deno.open("./some/file.txt");
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error("文件未找到");
  } else {
    // 否则重新抛出
    throw error;
  }
}
```

## 文件系统

Deno 运行时附带了
[用于处理文件和目录的各种函数](https://deno.land/api#File_System)。您需要使用
--allow-read 和 --allow-write 权限来访问文件系统。

请参考下面的链接，以获取如何使用文件系统函数的代码示例。

- [以多种不同方式读取文件](https://examples.deno.land/reading-files)
- [以流的方式读取文件](../../tutorials/file_server.md)
- [读取文本文件 (`Deno.readTextFile`)](../../tutorials/read_write_files.md#reading-a-text-file)
- [写入文本文件 (`Deno.writeTextFile`)](../../tutorials/read_write_files.md#writing-a-text-file)

## I/O

Deno 运行时附带了
[用于处理资源和 I/O 的内置函数](https://deno.land/api#I/O)。请参考下面的链接，以获取常见函数的代码示例。

- [关闭资源 (`Deno.close`)](https://doc.deno.land/deno/stable/~/Deno.close)
- [在资源内寻找特定位置 (`Deno.seek`)](https://doc.deno.land/deno/stable/~/Deno.seek)

## 网络

Deno 运行时附带了
[用于处理与网络端口的连接的内置函数](https://deno.land/api#Network)。请参考下面的链接，以获取常见函数的代码示例。

- [连接到主机名和端口 (`Deno.connect`)](https://doc.deno.land/deno/stable/~/Deno.connect)
- [在本地传输地址上宣布 (`Deno.listen`)](https://doc.deno.land/deno/stable/~/Deno.listen)

## 子进程

Deno 运行时附带了
[用于启动子进程的内置函数](https://deno.land/api#Sub_Process)。请参考下面的链接，以获取如何创建子进程的代码示例。

- [创建子进程 (`Deno.Command`)](../../tutorials/subprocess.md)
