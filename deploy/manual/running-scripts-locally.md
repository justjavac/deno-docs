# 本地开发

对于本地开发，您可以使用 `deno` 命令行工具。要安装 `deno`，请按照
[Deno 手册](https://deno.land/manual/getting_started/installation) 中的
说明进行操作。

安装完成后，您可以在本地运行您的脚本：

```shell
$ deno run --allow-net=:8000 https://deno.com/examples/hello.js
正在监听 http://localhost:8000
```

要监视文件更改，请添加 `--watch` 标志：

```shell
$ deno run --allow-net=:8000 --watch ./main.js
正在监听 http://localhost:8000
```

有关 Deno 命令行工具的更多信息，以及如何配置您的开发 环境和集成开发环境，请访问
Deno 手册的 [入门指南][manual-gs] 部分。

[manual-gs]: https://docs.denohub.com/runtime/manual
