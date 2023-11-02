# 编译可执行文件

`deno compile [--output <OUT>] <SRC>` 将脚本编译成一个 独立的可执行文件。

```
> deno compile https://deno.land/std/examples/welcome.ts
```

如果省略了 `OUT` 参数，则可执行文件的名称将被 推断。

## 标志

与 [`deno install`](./script_installer.md) 一样，用于执行脚本的运行时标志
必须在编译时指定。这包括 权限标志。

```
> deno compile --allow-read --allow-net https://deno.land/std/http/file_server.ts
```

[脚本参数](../getting_started/command_line_interface.md#script-arguments)
可以部分嵌入。

```
> deno compile --allow-read --allow-net https://deno.land/std/http/file_server.ts -p 8080
> ./file_server --help
```

## 动态导入

默认情况下，可以在输出中包括可以静态分析的动态导入（具有字符串的导入（...）调用表达式）。

```ts, ignore
// calculator.ts 和它的依赖项将包括在二进制文件中
const calculator = await import("./calculator.ts");
```

但无法静态分析的动态导入不会：

```ts, ignore
const specifier = condition ? "./calc.ts" : "./better_calc.ts";
const calculator = await import(specifier);
```

要包括无法静态分析的动态导入，请指定 `--include <path>` 标志。

```shell
deno compile --include calc.ts --include better_calc.ts main.ts
```

## Workers

与无法静态分析的动态导入类似，[workers](../runtime/workers.md)
的代码不会默认包括在编译后的可执行文件中。 您必须使用 `--include <path>`
标志来包括 worker 代码。

```shell
deno compile --include worker.ts main.ts
```

## 交叉编译

您可以通过添加 `--target` CLI 标志来为其他平台编译二进制文件。 Deno
目前支持编译为 Windows x64、macOS x64、macOS ARM 和 Linux x64。 使用
`deno compile --help` 列出每个编译目标的完整值。

## 在可执行文件中不可用

- [Web 存储 API](../runtime/web_storage_api.md)
