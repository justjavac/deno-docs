---
title: "安全与权限"
oldUrl:
  - /runtime/manual/basics/permissionsDeno/
  - /manual/basics/permissions
  - /runtime/manual/basics/permissions
  - /runtime/manual/getting_started/permissions
---

Deno 默认是安全的。除非你明确启用，否则使用 Deno 运行的程序无法访问敏感
API，例如文件系统访问、网络连接或环境访问。你必须通过命令行标志或运行时权限提示明确授予对这些资源的访问权限。这是与
Node 的主要区别，在 Node 中，依赖项会自动获得对所有系统 I/O
的完全访问权限，这可能会在你的项目中引入隐藏的漏洞。

在使用 Deno
运行完全不受信任的代码之前，请阅读下面的[执行不受信任的代码](#executing-untrusted-code)部分。

## 关键原则

在深入了解权限的具体细节之前，理解 Deno 安全模型的关键原则非常重要：

- **默认无 I/O 访问权限**：在 Deno
  运行时中执行的代码无法访问文件系统上的任意文件进行读写，无法发出网络请求或打开网络监听器，无法访问环境变量，也无法生成子进程。
- **对同一权限级别的代码执行无限制**：Deno
  允许多种方式执行任何代码（JS/TS/Wasm），包括
  `eval`、`new Function`、动态导入和 Web Worker，且对代码来源（网络、npm、JSR
  等）几乎没有限制。
- **同一应用程序的多次调用可以共享数据**：Deno 提供了内置缓存和 KV 存储
  API，使同一应用程序的多次调用可以共享数据。不同的应用程序无法看到彼此的数据。
- **同一线程上执行的所有代码共享相同的权限级别**：同一线程上执行的所有代码共享相同的权限级别。在同一线程中，不同的模块不可能拥有不同的权限级别。
- **代码无法在未经用户同意的情况下提升其权限**：在 Deno
  运行时中执行的代码无法在未经用户通过交互提示或调用时标志明确同意的情况下提升其权限。
- **初始静态模块图可以无限制地导入本地文件**：初始静态模块图中导入的所有文件都可以无限制地导入，即使未明确授予该文件的读取权限。这不适用于任何动态模块导入。

这些关键原则旨在提供一个环境，使用户可以以最小的风险执行代码，避免对主机或网络造成损害。安全模型设计简单易懂，并在运行时和其中执行的代码之间提供了清晰的关注点分离。安全模型由
Deno 运行时强制执行，不依赖于底层操作系统。

## 权限

默认情况下，大多数系统 I/O 的访问都被拒绝。即使默认情况下，某些 I/O
操作也以有限的方式被允许。这些操作如下所述。

要启用这些操作，用户必须明确授予 Deno 运行时权限。这是通过向 `deno` 命令传递
`--allow-read`、`--allow-write`、`--allow-net`、`--allow-env` 和 `--allow-run`
标志来完成的。

在执行脚本期间，用户还可以在运行时提示时明确授予对特定文件、目录、网络地址、环境变量和子进程的权限。如果
stdout/stderr 不是 TTY，或者向 `deno` 命令传递了 `--no-prompt`
标志，则不会显示提示。

用户还可以通过使用 `--deny-read`、`--deny-write`、`--deny-net`、`--deny-env` 和
`--deny-run`
标志明确禁止访问特定资源。这些标志优先于允许标志。例如，如果你允许网络访问但拒绝访问特定域，则拒绝标志将优先。

Deno 还提供了一个 `--allow-all`
标志，该标志授予脚本所有权限。这**完全禁用**了安全沙箱，应谨慎使用。`--allow-all`
具有与在 Node.js 中运行脚本相同的安全属性（即无安全性）。

定义：`-A, --allow-all`

```sh
deno run -A script.ts
deno run --allow-all script.ts
```

### 文件系统访问

默认情况下，执行代码无法读取或写入文件系统上的任意文件。这包括列出目录内容、检查给定文件是否存在以及打开或连接到
Unix 套接字。

使用 `--allow-read`（或 `-R`）标志授予读取文件的权限，使用 `--allow-write`（或
`-W`）标志授予写入文件的权限。这些标志可以指定路径列表，以允许访问特定文件或目录。

定义：`--allow-read[=<PATH>...]` 或 `-R[=<PATH>...]`

```sh
# 允许从文件系统读取所有文件
deno run -R script.ts
# 或
deno run --allow-read script.ts

# 仅允许读取 foo.txt 和 bar.txt 文件
deno run --allow-read=foo.txt,bar.txt script.ts
```

定义：`--deny-read[=<PATH>...]`

```sh
# 允许读取 /etc 中的文件，但禁止读取 /etc/hosts
deno run --allow-read=/etc --deny-read=/etc/hosts script.ts

# 禁止所有磁盘读取访问，禁用读取权限提示。
deno run --deny-read script.ts
```

定义：`--allow-write[=<PATH>...]` 或 `-W[=<PATH>...]`

```sh
# 允许写入文件系统的所有文件
deno run -W script.ts
# 或
deno run --allow-write script.ts

# 仅允许写入 foo.txt 和 bar.txt 文件
deno run --allow-write=foo.txt,bar.txt script.ts
```

定义：`--deny-write[=<PATH>...]`

```sh
# 允许读取当前工作目录中的文件，但禁止写入 ./secrets 目录。
deno run --allow-write=./ --deny-write=./secrets script.ts

# 禁止所有磁盘写入访问，禁用写入权限提示。
deno run --deny-write script.ts
```

Deno 中的某些 API
在底层使用文件系统操作实现，即使它们不提供对特定文件的直接读写访问。这些 API
会读取和写入磁盘，但不需要任何显式的读写权限。这些 API 的一些示例包括：

- `localStorage`
- Deno KV
- `caches`
- `Blob`

由于这些 API
使用文件系统操作实现，即使用户没有直接访问文件系统的权限，也可以使用它们来消耗文件系统资源，如存储空间。

在模块加载期间，Deno 可以从磁盘加载文件。这有时需要显式权限，有时默认允许：

- 从入口模块导入的所有文件（以可以静态分析的方式）默认允许读取。这包括静态
  `import` 语句和动态 `import()`
  调用，其中参数是指向特定文件或文件目录的字符串字面量。可以使用
  `deno info <entrypoint>` 打印此列表中的所有文件。
- 以无法静态分析的方式动态导入的文件需要运行时读取权限。
- `node_modules/` 目录中的文件默认允许读取。

从网络获取模块或将 TypeScript 代码转译为 JavaScript 时，Deno
使用文件系统作为缓存。这意味着即使用户未明确授予读写权限，Deno
也可以消耗文件系统资源，如存储空间。

### 网络访问

默认情况下，执行代码无法发出网络请求、打开网络监听器或执行 DNS 解析。这包括发出
HTTP 请求、打开 TCP/UDP 套接字以及监听 TCP 或 UDP 上的传入连接。

使用 `--allow-net` 标志授予网络访问权限。该标志可以指定 IP
地址或主机名列表，以允许访问特定网络地址。

定义：`--allow-net[=<IP_OR_HOSTNAME>...]` 或 `-N[=<IP_OR_HOSTNAME>...]`

```sh
# 允许网络访问
deno run -N script.ts
# 或
deno run --allow-net script.ts

# 允许访问 github.com 和 jsr.io
deno run --allow-net=github.com,jsr.io script.ts

# 端口 80 上的主机名：
deno run --allow-net=example.com:80 script.ts

# 端口 443 上的 IPv4 地址
deno run --allow-net=1.1.1.1:443 script.ts

# IPv6 地址，允许所有端口
deno run --allow-net=[2606:4700:4700::1111] script.ts
```

定义：`--deny-net[=<IP_OR_HOSTNAME>...]`

```sh
# 允许访问网络，但禁止访问 github.com 和 jsr.io
deno run --allow-net --deny-net=github.com,jsr.io script.ts

# 禁止所有网络访问，禁用网络权限提示。
deno run --deny-net script.ts
```

在模块加载期间，Deno 可以从网络加载模块。默认情况下，Deno
允许从以下位置使用静态和动态导入加载模块，而无需显式网络访问：

- `https://deno.land/`
- `https://jsr.io/`
- `https://esm.sh/`
- `https://raw.githubusercontent.com`
- `https://gist.githubusercontent.com`

这些位置是受信任的“公共资源”注册表，预计不会通过 URL
路径启用数据泄露。你可以使用 `--allow-imports` 标志添加更多受信任的注册表。

此外，Deno 允许通过 `npm:` 说明符导入任何 NPM 包。

Deno 还会每天最多向 `https://dl.deno.land/` 发送一次请求，以检查 Deno CLI
的更新。可以使用 `DENO_NO_UPDATE_CHECK=1` 环境变量禁用此功能。

### 环境变量

默认情况下，执行代码无法读取或写入环境变量。这包括读取环境变量和设置新值。

使用 `--allow-env`
标志授予对环境变量的访问权限。该标志可以指定环境变量列表，以允许访问特定环境变量。从
Deno v2.1 开始，你现在可以指定后缀通配符以允许对环境变量的“范围”访问。

定义：`--allow-env[=<VARIABLE_NAME>...]` 或 `-E[=<VARIABLE_NAME>...]`

```sh
# 允许访问所有环境变量
deno run -E script.ts
# 或
deno run --allow-env script.ts

# 允许 HOME 和 FOO 环境变量
deno run --allow-env=HOME,FOO script.ts

# 允许访问所有以 AWS_ 开头的环境变量
deno run --allow-env="AWS_*" script.ts
```

定义：`--deny-env[=<VARIABLE_NAME>...]`

```sh
# 允许所有环境变量，但 AWS_ACCESS_KEY_ID 和 AWS_SECRET_ACCESS_KEY 除外。
deno run \
  --allow-env \
  --deny-env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY \
  script.ts

# 禁止所有环境变量访问，禁用环境变量权限提示。
deno run --deny-env script.ts
```

> 对于 Windows 用户的注意：环境变量在 Windows 上不区分大小写，因此 Deno
> 在匹配时也不区分大小写（仅在 Windows 上）。

Deno 在启动时会读取某些环境变量，例如 `DENO_DIR` 和
`NO_COLOR`（[查看完整列表](/runtime/reference/cli/env_variables/)）。

`NO_COLOR` 环境变量的值对 Deno
运行时中运行的所有代码可见，无论代码是否被授予读取环境变量的权限。

### 系统信息

默认情况下，执行代码无法访问系统信息，例如操作系统版本、系统运行时间、负载平均值、网络接口和系统内存信息。

使用 `--allow-sys`
标志授予对系统信息的访问权限。该标志可以指定允许的接口列表，包括：`hostname`、`osRelease`、`osUptime`、`loadavg`、`networkInterfaces`、`systemMemoryInfo`、`uid`
和 `gid`。这些字符串映射到 `Deno` 命名空间中提供操作系统信息的函数，例如
[Deno.systemMemoryInfo](https://docs.denohub.com/api/deno/~/Deno.SystemMemoryInfo)。

定义：`--allow-sys[=<API_NAME>...]` 或 `-S[=<API_NAME>...]`

```sh
# 允许所有系统信息 API
deno run -S script.ts
# 或
deno run --allow-sys script.ts

# 允许 systemMemoryInfo 和 osRelease API
deno run --allow-sys="systemMemoryInfo,osRelease" script.ts
```

定义：`--deny-sys[=<API_NAME>...]`

```sh
# 允许访问所有系统信息，但 "networkInterfaces" 除外。
deno run --allow-sys --deny-sys="networkInterfaces" script.ts

# 禁止所有系统信息访问，禁用系统信息权限提示。
deno run --deny-sys script.ts
```

### 子进程

默认情况下，在 Deno
运行时中执行的代码无法生成子进程，因为这违反了代码无法在未经用户同意的情况下提升其权限的原则。

Deno 提供了执行子进程的机制，但这需要用户的明确许可。这是通过使用 `--allow-run`
标志来完成的。

从你的程序生成的任何子进程都独立于授予父进程的权限运行。这意味着子进程可以访问系统资源，无论你授予生成它的
Deno 进程的权限如何。这通常被称为权限提升。

因此，请确保你仔细考虑是否要授予程序 `--allow-run` 访问权限：它基本上使 Deno
安全沙箱失效。如果你确实需要生成特定的可执行文件，可以通过向 `--allow-run`
标志传递特定的可执行文件名来限制 Deno 进程可以启动的程序，从而降低风险。

定义：`--allow-run[=<PROGRAM_NAME>...]`

```sh
# 允许运行所有子进程
deno run --allow-run script.ts

# 允许运行 "curl" 和 "whoami" 子进程
deno run --allow-run="curl,whoami" script.ts
```

:::caution

除非父进程具有 `--allow-all`，否则你可能永远不想使用
`--allow-run=deno`，因为能够生成 `deno`
进程意味着脚本可以生成另一个具有完全权限的 `deno` 进程。

:::

定义：`--deny-run[=<PROGRAM_NAME>...]`

```sh
# 允许运行所有程序，但 "whoami" 和 "ps" 除外。
deno run --allow-run --deny-run="whoami,ps" script.ts

# 禁止所有生成子进程的访问，禁用生成子进程权限提示。
deno run --deny-run script.ts
```

默认情况下，`npm` 包在安装期间不会执行其安装后脚本（例如使用
`deno install`），因为这将允许任意代码执行。当使用 `--allow-scripts`
标志运行时，npm 包的安装后脚本将作为子进程执行。

### FFI（外部函数接口）

Deno 提供了一种机制，用于从 Deno 运行时中执行用其他语言（如 Rust、C 或
C++）编写的代码。这是通过使用 `Deno.dlopen` API 来完成的，该 API
可以加载共享库并调用其中的函数。

默认情况下，执行代码无法使用 `Deno.dlopen`
API，因为这违反了代码无法在未经用户同意的情况下提升其权限的原则。

除了 `Deno.dlopen`，FFI 还可以通过
Node-API（NAPI）原生插件使用。这些默认情况下也不允许。

`Deno.dlopen` 和 NAPI 原生插件都需要使用 `--allow-ffi`
标志明确授予权限。该标志可以指定文件或目录列表，以允许访问特定的动态库。

_与子进程一样，动态库不在沙箱中运行，因此不具有与加载它们的 Deno
进程相同的安全限制。因此，请极其谨慎地使用。_

定义：`--allow-ffi[=<PATH>...]`

```sh
# 允许加载所有动态库
deno run --allow-ffi script.ts

# 允许从特定路径加载动态库
deno run --allow-ffi=./libfoo.so script.ts
```

定义：`--deny-ffi[=<PATH>...]`

```sh
# 允许加载所有动态库，但 ./libfoo.so 除外。
deno run --allow-ffi --deny-ffi=./libfoo.so script.ts

# 禁止加载所有动态库，禁用动态库权限提示。
deno run --deny-ffi script.ts
```

### 从 Web 导入

允许从 Web 导入代码。默认情况下，Deno
限制你可以从中导入代码的主机。这对于静态和动态导入都是如此。

如果你想动态导入代码，无论是使用 `import()` 还是 `new Worker()`
API，都需要授予额外的权限。从本地文件系统导入[需要 `--allow-read`](#file-system-read-access)，但
Deno 也允许从 `http:` 和 `https:` URL 导入。在这种情况下，你需要指定显式的
`--allow-import` 标志：

```
# 允许从 `https://example.com` 导入代码
$ deno run --allow-import=example.com main.ts
```

默认情况下，Deno 允许从以下主机导入源：

- `deno.land`
- `esm.sh`
- `jsr.io`
- `cdn.jsdelivr.net`
- `raw.githubusercontent.com`
- `gist.githubusercontent.com`

**仅允许使用 HTTPS 导入**

默认情况下，此允许列表适用于静态导入，如果指定了 `--allow-import`
标志，则默认也适用于动态导入。

```
# 允许从 `https://deno.land` 动态导入代码
$ deno run --allow-import main.ts
```

请注意，为 `--allow-import` 指定允许列表将覆盖默认主机列表。

## 代码评估

Deno 对同一权限级别的代码执行没有限制。这意味着在 Deno
运行时中执行的代码可以使用 `eval`、`new Function`，甚至动态导入或 Web Worker
来执行**任意**代码，且具有与调用 `eval`、`new Function` 或动态导入或 Web Worker
的代码相同的权限级别。

此代码可以托管在网络上，可以是本地文件（如果授予了读取权限），也可以作为纯文本存储在调用
`eval`、`new Function` 或动态导入或 Web Worker 的代码中的字符串中。

## 执行不受信任的代码

虽然 Deno
提供了旨在保护主机和网络免受损害的安全功能，但不受信任的代码仍然令人担忧。在执行不受信任的代码时，拥有多层防御非常重要。下面概述了一些执行不受信任代码的建议，我们建议在执行任意不受信任代码时使用
