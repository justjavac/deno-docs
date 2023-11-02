# 环境变量

在 Deno 中使用环境变量有几种方法：

## 内置 `Deno.env`

Deno 运行时提供了对环境变量的内置支持，使用
[`Deno.env`](https://deno.land/api@v1.25.3?s=Deno.env)。

`Deno.env` 提供了获取和设置方法。以下是示例用法：

```ts
Deno.env.set("FIREBASE_API_KEY", "examplekey123");
Deno.env.set("FIREBASE_AUTH_DOMAIN", "firebasedomain.com");

console.log(Deno.env.get("FIREBASE_API_KEY")); // examplekey123
console.log(Deno.env.get("FIREBASE_AUTH_DOMAIN")); // firebasedomain.com
console.log(Deno.env.has("FIREBASE_AUTH_DOMAIN")); // true
```

## `.env` 文件

您还可以将环境变量放在 `.env` 文件中，并使用标准库中的 `dotenv` 来检索它们。

假设您有一个像这样的 `.env` 文件：

```sh
PASSWORD=Geheimnis
```

要访问 `.env` 文件中的环境变量，请从标准库中导入 `load`
函数。然后，使用它导入配置。

```ts
import { load } from "https://deno.land/std@$STD_VERSION/dotenv/mod.ts";

const env = await load();
const password = env["PASSWORD"];

console.log(password);
// "Geheimnis"
```

## `std/flags`

Deno 标准库具有用于解析命令行参数的
[`std/flags` 模块](https://deno.land/std/flags/mod.ts)。

## 特殊环境变量

Deno 运行时具有这些特殊环境变量。

| 名称                 | 描述                                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| DENO_AUTH_TOKENS     | 用于从私有存储库中提取远程模块时使用的令牌和主机名的分号分隔列表 <br />(例如，`abcde12345@deno.land;54321edcba@github.com`) |
| DENO_TLS_CA_STORE    | 逗号分隔的有序依赖证书存储列表。<br /> 可能的值：`system`，`mozilla`。默认为 `mozilla`。                                    |
| DENO_CERT            | 从 PEM 编码文件加载证书颁发机构                                                                                             |
| DENO_DIR             | 设置缓存目录                                                                                                                |
| DENO_INSTALL_ROOT    | 设置 Deno 安装的输出目录（默认为 `$HOME/.deno/bin`）                                                                        |
| DENO_REPL_HISTORY    | 设置 REPL 历史文件路径，当值为空时禁用历史文件 <br />(默认为 `$DENO_DIR/deno_history.txt`)                                  |
| DENO_NO_PACKAGE_JSON | 禁用 `package.json` 的自动解析                                                                                              |
| DENO_NO_PROMPT       | 设置以禁用访问权限提示 <br />(替代在调用时传递 `--no-prompt`)                                                               |
| DENO_NO_UPDATE_CHECK | 设置以禁用检查是否有新的 Deno 版本可用                                                                                      |
| DENO_V8_FLAGS        | 设置 V8 命令行选项                                                                                                          |
| DENO_JOBS            | 用于测试子命令的 `--parallel` 标志的并行工作程序数量 <br /> 默认为可用 CPU 数量。                                           |
| HTTP_PROXY           | 用于 HTTP 请求的代理地址（模块下载，获取）                                                                                  |
| HTTPS_PROXY          | 用于 HTTPS 请求的代理地址（模块下载，获取）                                                                                 |
| NPM_CONFIG_REGISTRY  | 用于 npm 注册表的 URL。                                                                                                     |
| NO_COLOR             | 设置为禁用颜色                                                                                                              |
| NO_PROXY             | 不使用代理的主机的逗号分隔列表（模块下载，获取）                                                                            |

您还可以使用 `deno --help` 查看相同内容。
