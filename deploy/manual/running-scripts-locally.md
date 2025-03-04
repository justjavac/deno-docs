---
title: "本地开发"
---

对于本地开发，你可以使用 `deno` CLI。要安装 `deno`，请按照
[Deno 手册](https://deno.land/manual/getting_started/installation)
中的说明进行操作。

安装完成后，你可以在本地运行你的脚本：

```shell
$ deno run --allow-net=:8000 https://deno.com/examples/hello.js
Listening on http://localhost:8000
```

要监听文件更改，请添加 `--watch` 标志：

```shell
$ deno run --allow-net=:8000 --watch ./main.js
Listening on http://localhost:8000
```

有关 Deno CLI 的更多信息，以及如何配置你的开发环境和 IDE，请访问 Deno 手册的
[入门][manual-gs] 部分。

[manual-gs]: https://deno.land/manual/getting_started
