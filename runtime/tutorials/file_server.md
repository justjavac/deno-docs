# 文件服务器

## 概念

- 使用 [Deno.open](https://deno.land/api?s=Deno.open) 以块的方式读取文件内容。
- 将 Deno 文件转换成
  [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)。
- 使用 Deno 集成的 HTTP 服务器来运行您自己的文件服务器。

## 概览

通过网络发送文件是一个常见的需求。正如在 [获取数据示例](./fetch_data.md)
中所看到的，由于文件可以是任何大小，因此使用流以避免将整个文件加载到内存中是非常重要的。

## 示例

**命令：** `deno run --allow-read=. --allow-net file_server.ts`

```ts
// 在本地主机的端口 8080 上开始监听。
const server = Deno.listen({ port: 8080 });
console.log("文件服务器在 http://localhost:8080/ 上运行。");

for await (const conn of server) {
  handleHttp(conn).catch(console.error);
}

async function handleHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    // 将请求路径名用作文件路径
    const url = new URL(requestEvent.request.url);
    const filepath = decodeURIComponent(url.pathname);

    // 尝试打开文件
    let file;
    try {
      file = await Deno.open("." + filepath, { read: true });
    } catch {
      // 如果无法打开文件，返回“404 未找到”响应
      const notFoundResponse = new Response("404 Not Found", { status: 404 });
      await requestEvent.respondWith(notFoundResponse);
      continue;
    }

    // 构建可读流，以便在发送文件时不必完全加载到内存中
    const readableStream = file.readable;

    // 构建并发送响应
    const response = new Response(readableStream);
    await requestEvent.respondWith(response);
  }
}
```

## 使用 `std/http` 文件服务器

Deno 标准库提供了一个
[文件服务器](https://deno.land/std/http/file_server.ts)，这样您就不必自己编写了。

要使用它，首先将远程脚本安装到本地文件系统。这将安装脚本到 Deno 安装根目录的 bin
目录，例如 `/home/alice/.deno/bin/file_server`。

```shell
deno install --allow-net --allow-read https://deno.land/std/http/file_server.ts
```

现在可以使用简化的脚本名称运行该脚本。运行它：

```shell
$ file_server .
正在下载 https://deno.land/std/http/file_server.ts...
[...]
HTTP 服务器正在监听 http://0.0.0.0:4507/
```

现在在您的网络浏览器中转到
[http://0.0.0.0: 4507/](http://0.0.0.0:4507/)，以查看您的本地目录内容。

完整的选项列表可通过以下方式获取：

```shell
file_server --help
```

示例输出：

```
Deno 文件服务器
    以 HTTP 方式提供本地目录。
  安装:
    deno install --allow-net --allow-read https://deno.land/std/http/file_server.ts
  使用:
    file_server [路径] [选项]
  选项:
    -h, --help          打印帮助信息
    -p, --port <PORT>   设置端口
    --cors              通过 "Access-Control-Allow-Origin" 标头启用 CORS
    --host     <HOST>   主机名（默认为 0.0.0.0）
    -c, --cert <FILE>   TLS 证书文件（启用 TLS）
    -k, --key  <FILE>   TLS 密钥文件（启用 TLS）
    --no-dir-listing    禁用目录列表
    提供 TLS 选项时，需要提供所有 TLS 选项。
```
