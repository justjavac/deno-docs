# 权限

Deno 默认情况下是安全的。因此，除非您明确启用它，否则使用 Deno
运行的程序没有文件、网络或环境访问权限。要访问安全敏感功能，需要通过命令行标志或运行时权限提示向执行脚本授予权限。这与
Node 有很大不同，Node
的依赖项会自动授予对一切的完全访问权限，从而引入项目中隐藏的漏洞。

## 自信地运行不受信任的代码

由于 Deno 默认情况下不提供 I/O
访问权限，因此它非常适合运行不受信任的代码和审核第三方代码。如果您正在构建或扩展一个运行用户生成的代码的平台，您可以使用
Deno 来安全地运行第三方代码，并通过
[Deno Subhosting](https://deno.com/subhosting)
或您选择的任何其他云平台托管此代码。

在以下示例中，`mod.ts`
已被授予对文件系统的只读访问权限。它不能对文件系统进行写操作，也不能执行任何其他安全敏感功能。

```shell
deno run --allow-read mod.ts
```

## 权限列表

以下权限可用：

- **--allow-env =\<VARIABLE_NAME\>** 允许访问环境，如获取和设置环境变量。自 Deno
  1.9
  以来，您可以指定一个可选的逗号分隔的环境变量列表，以提供允许的环境变量白名单。
- **--allow-sys =\<API_NAME\>** 允许访问提供有关用户操作系统信息的 API，例如
  `Deno.osRelease()` 和
  `Deno.systemMemoryInfo()`。您可以指定一个逗号分隔的允许接口列表，包括
  `hostname`、`osRelease`、`osUptime`、`loadavg`、`networkInterfaces`、`systemMemoryInfo`、`uid`
  和 `gid`。这些字符串映射到 `Deno` 命名空间中提供操作系统信息的函数，如
  [Deno.systemMemoryInfo](https://deno.land/api?s=Deno.SystemMemoryInfo)。
- **--allow-hrtime**
  允许高分辨率时间测量。高分辨率时间可用于计时攻击和指纹识别。
- **--allow-net =\<IP/HOSTNAME\>** 允许网络访问。您可以指定一个可选的逗号分隔的
  IP 地址或主机名列表（可选包括端口），以提供允许的网络地址白名单。
- **--allow-ffi =\<PATH\>**
  允许加载动态库。您可以指定一个可选的逗号分隔的目录或文件列表，以提供允许加载的动态库白名单。请注意，动态库不在沙箱中运行，因此与
  Deno 进程不具有相同的安全限制。因此，请谨慎使用。请注意，--allow-ffi
  是一个不稳定的功能。
- **--allow-read =\<PATH\>**
  允许文件系统读取权限。您可以指定一个可选的逗号分隔的目录或文件列表，以提供允许的文件系统访问白名单。
- **--allow-run =\<PROGRAM_NAME\>** 允许运行子进程。自 Deno 1.9
  以来，您可以指定一个可选的逗号分隔的子进程列表，以提供允许的子进程白名单。请注意，子进程不在沙箱中运行，因此与
  Deno 进程不具有相同的安全限制。因此，请谨慎使用。
- **--allow-write =\<PATH\>**
  允许文件系统写入权限。您可以指定一个可选的逗号分隔的目录或文件列表，以提供允许的文件系统访问白名单。
- **-A, --allow-all** 允许所有权限。这会启用所有安全敏感功能。请谨慎使用。

从 Deno 1.36 开始，以下标志可用：

- **--deny-env =\<VARIABLE_NAME\>**
  拒绝访问环境，如获取和设置环境变量。您可以指定一个可选的逗号分隔的环境变量列表，以提供允许的环境变量白名单。这里指定的任何环境变量将被拒绝访问，即使它们在--allow-env
  中指定。
- **--deny-sys =\<API_NAME\>** 拒绝访问提供有关用户操作系统信息的 API。
- **--deny-hrtime** 禁用高分辨率时间测量。高分辨率时间可用于计时攻击和指纹识别。
- **--deny-net =\<IP/HOSTNAME\>** 禁止网络访问。您可以指定一个可选的逗号分隔的
  IP
  地址或主机名列表（可选包括端口），以提供网络地址的拒绝名单。这里指定的任何地址将被拒绝访问，即使它们在--allow-net
  中指定。
- **--deny-ffi =\<PATH\>**
  拒绝加载动态库。您可以指定一个可选的逗号分隔的目录或文件列表，以提供允许加载的动态库的拒绝名单。这里指定的任何库将被拒绝访问，即使它们在--allow-ffi
  中指定。请注意，--deny-ffi 是一个不稳定的功能。
- **--deny-read =\<PATH\>**
  拒绝文件系统读取权限。您可以指定一个可选的逗号分隔的目录或文件列表，以提

供文件系统访问的拒绝名单。这里指定的任何路径将被拒绝访问，即使它们在--allow-read
中指定。

- **--deny-run =\<PROGRAM_NAME\>**
  拒绝运行子进程。您可以指定一个可选的逗号分隔的子进程列表，以提供子进程的拒绝名单。请注意，子进程不在沙箱中运行，因此与
  Deno
  进程不具有相同的安全限制。因此，请谨慎使用。这里指定的任何程序将被拒绝访问，即使它们在--allow-run
  中指定。
- **--deny-write =\<PATH\>**
  拒绝文件系统写入权限。您可以指定一个可选的逗号分隔的目录或文件列表，以提供文件系统访问的拒绝名单。这里指定的任何路径将被拒绝访问，即使它们在--allow-write
  中指定。

## 可配置的权限

一些权限允许您授予对特定实体（文件、服务器等）的访问权限，而不是对一切的访问权限。

### 文件系统访问

此示例通过允许只读访问 `/usr` 目录来限制文件系统访问。因此，当进程试图读取
`/etc` 目录中的文件时，执行会失败：

```shell
$ deno run --allow-read=/usr https://deno.land/std@0.198.0/examples/cat.ts /etc/passwd
error: Uncaught PermissionDenied: read access to "/etc/passwd", run again with the --allow-read flag
► $deno$/dispatch_json.ts:40:11
    at DenoError ($deno$/errors.ts:20:5)
    ...
```

通过允许访问 `/etc` 来再次尝试：

```shell
deno run --allow-read=/etc https://deno.land/std@0.198.0/examples/cat.ts /etc/passwd
```

您还可以使用 `--deny-read` 标志进一步限制某些子路径的访问权限：

```shell
deno run --allow-read=/etc --deny-read=/etc/hosts https://deno.land/std@0.198.0/examples/cat.ts /etc/passwd
deno run --allow-read=/etc --deny-read=/etc/hosts https://deno.land/std@0.198.0/examples/cat.ts /etc/hosts
error: Uncaught PermissionDenied: read access to "/etc/hosts"...
```

`--allow-write` 的工作方式与 `--allow-read` 相同。

> 对于 Windows 用户的注意事项：在 Windows 上，`/etc` 和 `/usr` 目录以及
> `/etc/passwd` 文件不存在。如果您想自己运行此示例，请将 `/etc/passwd` 替换为
> `C:\Windows\System32\Drivers\etc\hosts`，将 `/usr` 替换为 `C:\Users`。

### 网络访问

```js
// fetch.js
const result = await fetch("https://deno.land/");
```

这是一个允许访问特定主机名或 IP 地址的网络访问示例，可以选择锁定到指定的端口：

```shell
允许多个主机名，所有端口均允许
deno run --allow-net=github.com,deno.land fetch.js

# 主机名位于端口 80：
deno run --allow-net=deno.land:80 fetch.js

# IPv4 地址位于端口 443
deno run --allow-net=1.1.1.1:443 fetch.js

# IPv6 地址，所有端口均允许
deno run --allow-net=[2606:4700:4700::1111] fetch.js
```

您可以使用 `--deny-net` 标志限制某些域永远不可访问：

```shell
允许与所有地址建立网络连接，但拒绝访问 myserver.com。
deno run --allow-net --deny-net=myserver.com fetch.js
```

如果 `fetch.js` 试图建立到任何未明确允许的主机名或 IP
的网络连接，相关调用将引发异常。

允许对任何主机名/IP 进行 net 调用：

```shell
deno run --allow-net fetch.js
```

### 环境变量

```js
// env.js
Deno.env.get("HOME");
```

这是一个允许访问环境变量的示例：

```shell
允许所有环境变量
deno run --allow-env env.js

# 仅允许访问 HOME 环境变量
deno run --allow-env=HOME env.js
```

> 对于 Windows 用户的注意事项：在 Windows 上，环境变量不区分大小写，因此 Deno
> 也会在 Windows 上不区分大小写地匹配它们。

您可以使用 `--deny-env` 标志限制某些环境变量永远不可访问：

```shell
允许访问所有环境变量，但拒绝访问 AWS_ACCESS_KEY_ID 和 AWS_SECRET_ACCESS_KEY。
deno run --allow-env --deny-env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY env.js
```

### 子进程权限

子进程非常强大，可能有些令人担忧：它们可以访问系统资源，而不受您为生成它们的
Deno 进程授予的权限的限制。Unix 系统上的 `cat`
程序可用于从磁盘上读取文件。如果通过 `Deno.run` API 启动此程序，即使父 Deno
进程无法直接读取文件，它仍可以读取磁盘上的文件。这通常被称为特权升级。

因此，请仔细考虑是否要授予程序 `--allow-run` 权限：这实际上会使 Deno
安全沙箱无效。如果确实需要启动特定可执行文件，可以通过将特定的可执行文件名称传递给
`--allow-run` 标志

```js
// run.js
const proc = Deno.run({ cmd: ["whoami"] });
```

```shell
允许仅生成 `whoami` 子进程：
deno run --allow-run=whoami run.js

# 允许运行任何子进程：
deno run --allow-run run.js
```

只能限制允许的可执行文件；如果允许执行，那么可以传递任何参数。例如，如果传递
`--allow-run=cat`，则用户可以使用 `cat` 读取任何文件。

您可以使用 `--deny-run` 标志来禁止访问某些可执行文件：

```shell
禁止生成 `git`。
deno run --allow-run --deny-run=git run.js
```
