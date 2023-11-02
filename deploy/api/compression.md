# 压缩响应体

压缩响应体以节省带宽是一种常见的做法。为了减轻您的工作负担，我们将这些功能直接内置到
Deploy 中。

Deno Deploy 支持 brotli 和 gzip 压缩。当满足以下条件时应用压缩。

1. 到您的部署的请求包含 [`Accept-Encoding`][accept-encoding] 头，设置为
   `br`（brotli）或 `gzip`。
2. 来自您的部署的响应包括 [`Content-Type`][content-type] 头。
3. 提供的内容类型是可压缩的；我们使用
   [此数据库](https://github.com/jshttp/mime-db/blob/master/db.json) 来
   确定内容类型是否可压缩。
4. 响应体大小大于 20 字节。

当 Deploy 压缩响应体时，将根据使用的压缩算法设置 `Content-Encoding: gzip` 或
`Content-Encoding: br` 头。

### 何时跳过压缩？

Deno Deploy 跳过压缩如果：

- 响应具有 [`Content-Encoding`][content-encoding] 头。
- 响应具有 [`Content-Range`][content-range] 头。
- 响应的 [`Cache-Control`][cache-control] 头具有 [`no-transform`][no-transform]
  值（例如 `cache-control: public, no-transform`）。

### 我的 `Etag` 头会发生什么？

当您在响应中设置 Etag 头时，如果我们对响应体应用压缩，我们将将头值转换为弱
Etag。如果它已经是弱 Etag，则我们不会更改头。

[accept-encoding]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
[cache-control]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
[content-encoding]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
[content-type]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
[no-transform]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#other
[content-range]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range
