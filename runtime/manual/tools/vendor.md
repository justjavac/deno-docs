# 依赖库存储

`deno vendor <specifiers>...` 将会下载指定模块的所有远程依赖到本地的 `vendor`
文件夹中。例如：

```shell
存储 main.ts 的远程依赖
$ deno vendor main.ts

# 示例文件系统树
$ tree
.
├── main.ts
└── vendor
    ├── deno.land
    ├── import_map.json
    └── raw.githubusercontent.com

# 将文件夹加入源代码控制
$ git add -u vendor
$ git commit
```

要在您的程序中使用这些存储的依赖，只需在您的 Deno 命令中添加
`--import-map=vendor/import_map.json`。您还可以添加 `--no-remote`
到您的命令，以完全禁用远程模块的获取，确保它使用了 `vendor` 目录中的模块。

```shell
deno run --no-remote --import-map=vendor/import_map.json main.ts
```

请注意，您可以在存储依赖时指定多个模块和远程模块。

```shell
deno vendor main.ts test.deps.ts https://deno.land/std/path/mod.ts
```

运行 `deno vendor --help` 以获取更多详细信息。
