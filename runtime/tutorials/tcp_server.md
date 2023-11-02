# TCP 服务器

这是一个在端口 8080 上接受连接并将客户端发送的任何内容返回的服务器示例。

```ts
const hostname = "0.0.0.0";
const port = 8080;
const listener = Deno.listen({ hostname, port });
console.log(`正在监听 ${hostname}:${port}`);
for await (const conn of listener) {
  conn.readable.pipeTo(conn.writable);
}
```

出于安全原因，Deno
不允许程序在没有明确权限的情况下访问网络。要允许访问网络，请使用命令行标志：

```shell
deno run --allow-net https://deno.land/std/examples/echo_server.ts
```

要测试它，请使用 `netcat`（或 Windows 上的 `telnet`）发送数据：

> Windows 用户注意：Windows 上没有 `netcat`。您可以使用内置的 `telnet`
> 客户端。但是，默认情况下 Windows 上禁用了 telnet
> 客户端。不过，启用它非常简单：只需按照
> [Microsoft TechNet 上的说明](https://social.technet.microsoft.com/wiki/contents/articles/38433.windows-10-enabling-telnet-client.aspx)
> 操作。

```shell
Windows 用户注意：将下面的 `nc` 替换为 `telnet`
$ nc localhost 8080
hello world
hello world
```

与 `cat.ts` 示例一样，`pipeTo(writable)`
方法不会复制数据。数据直接从可读流写入可写流。
