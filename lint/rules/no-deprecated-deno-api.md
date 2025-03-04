---
tags: [recommended]
---

警告使用已弃用的 Deno API。

以下 API 将从 `Deno.*` 命名空间中移除，但有新的 API 可以迁移。请参阅
[Deno 1.x 到 2.x 迁移指南](https://docs.denohub.com/runtime/manual/advanced/migrate_deprecations)
获取迁移说明。

- `Deno.Buffer`
- `Deno.Closer`
- `Deno.close()`
- `Deno.Conn.rid`
- `Deno.copy()`
- `Deno.customInspect`
- `Deno.File`
- `Deno.fstatSync()`
- `Deno.fstat()`
- `Deno.FsWatcher.rid`
- `Deno.ftruncateSync()`
- `Deno.ftruncate()`
- `Deno.futimeSync()`
- `Deno.futime()`
- `Deno.isatty()`
- `Deno.Listener.rid`
- `Deno.ListenTlsOptions.certFile`
- `Deno.ListenTlsOptions.keyFile`
- `Deno.readAllSync()`
- `Deno.readAll()`
- `Deno.Reader`
- `Deno.ReaderSync`
- `Deno.readSync()`
- `Deno.read()`
- `Deno.run()`
- `Deno.seekSync()`
- `Deno.seek()`
- `Deno.serveHttp()`
- `Deno.Server`
- `Deno.shutdown`
- `Deno.stderr.rid`
- `Deno.stdin.rid`
- `Deno.stdout.rid`
- `Deno.TlsConn.rid`
- `Deno.UnixConn.rid`
- `Deno.writeAllSync()`
- `Deno.writeAll()`
- `Deno.Writer`
- `Deno.WriterSync`
- `Deno.writeSync()`
- `Deno.write()`
- `new Deno.FsFile()`

以下 API 将从 `Deno.*` 命名空间中移除，且没有替代方案。

- `Deno.resources()`
- `Deno.metrics()`
