# 脚本安装程序

Deno 提供 `deno install` 以轻松安装和分发可执行代码。

`deno install [OPTIONS...] [URL] [SCRIPT_ARGS...]` 将安装位于 `URL`
下的脚本，命名为 `EXE_NAME`。

此命令创建一个薄的可执行 Shell 脚本，调用 `deno`，使用指定的 CLI
标志和主模块。它放置在安装根目录的 `bin` 目录中。

示例：

```shell
$ deno install --allow-net --allow-read https://deno.land/std/http/file_server.ts
[1/1] 编译 https://deno.land/std/http/file_server.ts

✅ 成功安装文件服务器。
/Users/deno/.deno/bin/file_server
```

要更改可执行文件的名称，请使用 `-n`/`--name`：

```shell
deno install --allow-net --allow-read -n serve https://deno.land/std/http/file_server.ts
```

默认情况下推断可执行文件的名称：

- 尝试获取 URL 路径的文件主干。上述示例将变为'file_server'。
- 如果文件主干是一些通用的，比如'main'、'mod'、'index'或'cli'，并且路径没有父级，取父级路径的文件名。否则，使用通用名称。
- 如果生成的名称带有'@...'后缀，请删除它。

要更改安装根目录，请使用 `--root`：

```shell
deno install --allow-net --allow-read --root /usr/local https://deno.land/std/http/file_server.ts
```

安装根目录按以下顺序确定：

- `--root` 选项
- `DENO_INSTALL_ROOT` 环境变量
- `$HOME/.deno`

如果需要，必须手动将这些添加到路径中。

```shell
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

必须在安装时指定将用于运行脚本的权限。

```shell
deno install --allow-net --allow-read https://deno.land/std/http/file_server.ts -- -p 8080
```

上述命令创建一个名为 `file_server`
的可执行文件，具有网络和读取权限，并绑定到端口 8080。

为了良好的实践，请使用 [`import.meta.main`](../../tutorials/module_metadata.md)
习惯用法在可执行脚本中指定入口点。

示例：

<!-- deno-fmt-ignore -->

```ts
// https://example.com/awesome/cli.ts
async function myAwesomeCli(): Promise<void> {
  // -- 剪辑 --
}

if (import.meta.main) {
  myAwesomeCli();
}
```

创建可执行脚本时，请确保通过将示例安装命令添加到存储库来通知用户：

```shell
使用 deno install 安装

$ deno install -n awesome_cli https://example.com/awesome/cli.ts
```

## 卸载

您可以使用 `deno uninstall` 命令卸载脚本。

```shell
$ deno uninstall file_server
已删除/Users/deno/.deno/bin/file_server
✅ 成功卸载文件服务器
```

有关更多详细信息，请参阅 `deno uninstall -h`。
