---
title: "压缩响应体"
oldUrl:
  - /deploy/docs/compression/
---

压缩响应体以节省带宽是一种常见的做法。为了减轻您的工作负担，我们直接将这一功能内置到了
Deploy 中。

Deno Deploy 支持 brotli 和 gzip 压缩。当满足以下条件时，压缩将被应用。

1. 对您的部署的请求中，[`Accept-Encoding`][accept-encoding] 头被设置为
   `br`（brotli）或 `gzip`。
2. 您的部署的响应中包含 [`Content-Type`][content-type] 头。
3. 提供的内容类型是可压缩的；我们使用
   [此数据库](https://github.com/jshttp/mime-db/blob/master/db.json)
   来确定内容类型是否可压缩。
4. 响应体的大小大于 20 字节。

当 Deploy 压缩响应体时，它会根据使用的压缩算法在响应中设置
`Content-Encoding: gzip` 或 `Content-Encoding: br` 头。

### 何时会跳过压缩？

Deno Deploy 会在以下情况下跳过压缩：

- 响应中包含 [`Content-Encoding`][content-encoding] 头。
- 响应中包含 [`Content-Range`][content-range] 头。
- 响应的 [`Cache-Control`][cache-control] 头中包含
  [`no-transform`][no-transform] 值（例如
  `cache-control: public, no-transform`）。

### 我的 `Etag` 头会怎样？

当您在响应中设置 Etag 头时，如果我们对响应体应用了压缩，我们会将该头的值转换为
Weak Etag。如果它已经是 Weak Etag，我们不会修改该头。

[accept-encoding]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Encoding
[cache-control]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control
[content-encoding]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Encoding
[content-type]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type
[no-transform]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control#other
[content-range]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Range
