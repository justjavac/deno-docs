---
title: "环境变量"
oldUrl:
- /runtime/manual/basics/env_variables/
- /runtime/reference/cli/env_variables/
---

在 Deno 中有几种使用环境变量的方法：

## 内置的 Deno.env

Deno 运行时通过 [`Deno.env`](https://docs.denohub.com/api/deno/~/Deno.env)
提供了对环境变量的内置支持。

`Deno.env` 具有 getter 和 setter 方法。以下是示例用法：

```ts
Deno.env.set("FIREBASE_API_KEY", "examplekey123");
Deno.env.set("FIREBASE_AUTH_DOMAIN", "firebasedomain.com");

console.log(Deno.env.get("FIREBASE_API_KEY")); // examplekey123
console.log(Deno.env.get("FIREBASE_AUTH_DOMAIN")); // firebasedomain.com
console.log(Deno.env.has("FIREBASE_AUTH_DOMAIN")); // true
```

## .env 文件

Deno 支持 `.env` 文件。你可以使用 `--env-file` 标志让 Deno 从 `.env`
文件中读取环境变量：`deno run --env-file <script>`。这将从当前工作目录或第一个包含
`.env` 文件的父目录中读取 `.env`
文件；如果你想从不同的文件中加载环境变量，可以将该文件作为标志的参数指定。此外，你可以传递多个
`--env-file`
标志（例如，`deno run --env-file=.env.one --env-file=.env.two --allow-env <script>`）以从多个文件中加载变量。

:::note

当单个 `.env`
文件中存在多个相同环境变量的声明时，将应用第一个出现的值。然而，如果相同的变量在多个
`.env` 文件中定义（使用多个 `--env-file`
参数），则最后一个指定的文件中的值将优先。这意味着将应用列出的最后一个 `.env`
文件中找到的第一个值。

:::

或者，标准库中的 `dotenv` 包也会从 `.env` 文件中加载环境变量。

假设你有一个如下所示的 `.env` 文件：

```sh
GREETING="Hello, world."
```

导入 `load` 模块以自动从 `.env` 文件中导入到进程环境中。

```ts
import "jsr:@std/dotenv/load";

console.log(Deno.env.get("GREETING")); // "Hello, world."
```

有关 `.env` 处理的更多文档可以在 [@std/dotenv](https://jsr.io/@std/dotenv/doc)
文档中找到。

## `std/cli`

Deno 标准库有一个用于解析命令行参数的
[`std/cli` 模块](https://jsr.io/@std/cli)。请参阅该模块以获取文档和示例。

## 特殊环境变量

Deno 运行时具有以下特殊环境变量。

| name                 | description                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| DENO_AUTH_TOKENS     | 以分号分隔的承载令牌和主机名列表，用于从私有仓库获取远程模块<br />(例如 `abcde12345@deno.land;54321edcba@github.com`) |
| DENO_TLS_CA_STORE    | 以逗号分隔的顺序依赖的证书存储列表。<br />可能的值：`system`, `mozilla`。默认为 `mozilla`。                           |
| DENO_CERT            | 从 PEM 编码的文件加载证书颁发机构                                                                                     |
| DENO_DIR             | 设置缓存目录                                                                                                          |
| DENO_INSTALL_ROOT    | 设置 deno install 的输出目录（默认为 `$HOME/.deno/bin`）                                                              |
| DENO_REPL_HISTORY    | 设置 REPL 历史文件路径。当值为空时，历史文件被禁用 <br />(默认为 `$DENO_DIR/deno_history.txt`)                        |
| DENO_NO_PACKAGE_JSON | 禁用 `package.json` 的自动解析                                                                                        |
| DENO_NO_PROMPT       | 设置为禁用访问时的权限提示<br />(替代在调用时传递 `--no-prompt`)                                                      |
| DENO_NO_UPDATE_CHECK | 设置为禁用检查是否有更新的 Deno 版本可用                                                                              |
| DENO_V8_FLAGS        | 设置 V8 命令行选项                                                                                                    |
| DENO_JOBS            | 用于 `--parallel` 标志与 test 子命令的并行工作线程数。<br />默认为可用 CPU 的数量。                                   |
| DENO_WEBGPU_TRACE    | 使用 WebGPU API 时输出 [WGPU 跟踪](https://github.com/gfx-rs/wgpu/pull/619) 的目录路径                                |
| DENO_WEBGPU_BACKEND  | 选择 WebGPU 将使用的后端，或按优先顺序排列的逗号分隔的后端列表。可能的值是 `vulkan`, `dx12`, `metal`, 或 `opengl`     |
| HTTP_PROXY           | HTTP 请求的代理地址（模块下载，fetch）                                                                                |
| HTTPS_PROXY          | HTTPS 请求的代理地址（模块下载，fetch）                                                                               |
| NPM_CONFIG_REGISTRY  | 用于 npm 注册表的 URL。                                                                                               |
| NO_COLOR             | 设置为禁用颜色                                                                                                        |
| NO_PROXY             | 不使用代理的主机的逗号分隔列表（模块下载，fetch）                                                                     |
