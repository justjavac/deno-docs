# TCP echo Server

## 概念

- 使用 [Deno.listen](https://deno.land/api?s=Deno.listen) 监听 TCP 端口连接。
- 使用 [Deno.Conn.readable](https://deno.land/api?s=Deno.Conn#prop_readable) 和
  [Deno.Conn.writable](https://deno.land/api?s=Deno.Conn#prop_writable) 来接收
  进入的数据并将其重定向为出站数据。

## 示例

这是一个服务器的示例，它在端口 8080 上接受连接，并返回客户端发送的任何内容。

```ts
/**
 * echo_server.ts
 */
const listener = Deno.listen({ port: 8080 });
console.log("listening on 0.0.0.0:8080");
for await (const conn of listener) {
  conn.readable.pipeTo(conn.writable);
}
```

使用以下命令运行：

```shell
deno run --allow-net echo_server.ts
```

要测试它，请尝试使用 [netcat](https://en.wikipedia.org/wiki/Netcat)
向其发送数据（仅限 Linux/MacOS）。在连接上传送了 `'hello world'`
后，它会回显给用户：

```shell
$ nc localhost 8080
hello world
hello world
```

与 [cat.ts 示例](./unix_cat.md) 一样，这里的 `pipeTo()`
方法也不会进行不必要的内存复制。它从内核接收一个数据包并将其发送回，没有进一步的复杂性。
