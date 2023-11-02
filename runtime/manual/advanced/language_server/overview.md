# 语言服务器概述

Deno 语言服务器提供了
[Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
的服务器实现，专门为提供 _Deno_ 代码视图而定制。它已集成到命令行，并可以通过
`lsp` 子命令启动。

大多数用户将不会直接与服务器交互，而是通过
[`vscode_deno`](../../references/vscode_deno/index.md) 或其他
[编辑器扩展](../../getting_started/setup_your_environment.md)
进行交互。本文档是为那些实现编辑器客户端的人员编写的。

## 结构

当语言服务器启动时，将创建一个 `LanguageServer`
实例，它保存了语言服务器的所有状态。它还定义了客户端通过 Language Server RPC
协议调用的所有方法。

## 设置

语言服务器支持工作区的多个设置：

- `deno.enable`
- `deno.enablePaths`
- `deno.cache`
- `deno.certificateStores`
- `deno.config`
- `deno.importMap`
- `deno.internalDebug`
- `deno.codeLens.implementations`
- `deno.codeLens.references`
- `deno.codeLens.referencesAllFunctions`
- `deno.codeLens.test`
- `deno.suggest.completeFunctionCalls`
- `deno.suggest.names`
- `deno.suggest.paths`
- `deno.suggest.autoImports`
- `deno.suggest.imports.autoDiscover`
- `deno.suggest.imports.hosts`
- `deno.lint`
- `deno.tlsCertificate`
- `deno.unsafelyIgnoreCertificateErrors`
- `deno.unstable`

语言服务器按资源的基础支持以下设置：

- `deno.enable`
- `deno.enablePaths`
- `deno.codeLens.test`

在 Deno 分析这些设置的过程中，首先在客户端的 `initialize`
请求时，`initializationOptions` 将被假定为表示 `deno`
选项命名空间的对象。例如，以下值：

```json
{
  "enable": true,
  "unstable": true
}
```

将启用具有不稳定 API 的 Deno 的此语言服务器实例。

当语言服务器接收到 `workspace/didChangeConfiguration`
通知时，它将评估客户端是否指示具有 `workspaceConfiguration`
能力。如果有，它将发送一个 `workspace/configuration`
请求，其中包括对工作区配置的请求以及语言服务器当前正在跟踪的所有 URI 的配置。

如果客户端具有 `workspaceConfiguration` 能力，语言服务器将为客户端接收到的
`textDocument/didOpen` 通知的 URI 发送配置请求，以获取特定资源的设置。

如果客户端没有 `workspaceConfiguration`
能力，语言服务器将假定工作区设置适用于所有资源。

## 命令

语言服务器可能向客户端发出多个命令，客户端预期实现这些命令：

- `deno.cache` -
  当未缓存的模块规范被导入到模块中时，将其作为分辨率代码操作发送。它将被发送并包含解析后的规范作为要缓存的字符串的参数。
- `deno.showReferences` -
  这是作为一些代码镜头的命令发送的，用于显示引用的位置。参数包含了作为命令主题的规范，目标的起始位置以及要显示的引用的位置。
- `deno.test` -
  这是作为测试代码镜头的一部分发送的，客户端预期根据参数运行测试，参数是包含测试的规范和要筛选测试的名称。

## 请求

LSP 目前支持以下自定义请求。客户端应该实现这些请求，以便具有与 Deno
很好集成的完全功能客户端：

- `deno/cache` - 此命令将指示 Deno 尝试缓存模块及其所有依赖项。如果只传递了一个
  `referrer`，则将加载模块规范的所有依赖项。如果在 `uris`
  中有值，那么只会缓存那些 `uris`。

  它期望的参数是：

  ```ts, ignore
  interface CacheParams {
    referrer: TextDocumentIdentifier;
    uris: TextDocumentIdentifier[];
  }
  ```
- `deno/performance` - 请求返回 Deno 内部仪器的定时平均值。

  它不期望任何参数。
- `deno/reloadImportRegistries` - 重新加载从导入注册表中缓存的响应。

  它不期望任何参数。
- `deno/virtualTextDocument` - 请求从 LSP
  获取虚拟文本文档，这是客户端中可以显示的只读文档。这允许客户端访问 Deno
  缓存中的文档，如远程模块和内置于 Deno 中的 TypeScript 库文件。Deno
  语言服务器将在自定义模式 `deno:` 下编码所有内部文件，因此客户端应将对 `deno:`
  模式的所有请求路由到 `deno/virtualTextDocument` API。

  它还支持一个特殊的 URL，`deno:/status.md`，其中包含有关 LSP 状态的详细信息的
  markdown 格式文本文档供显示给用户。

  它期望的参数是：

  ```ts, ignore
  interface VirtualTextDocumentParams {
    textDocument: TextDocumentIdentifier;
  }
  ```

- `deno/task` - 请求返回可用的 Deno 任务，请参阅
  [task_runner](../../tools/task_runner.md)。

  它不期望任何参数。

## 通知

目前，服务器向客户端发送一条自定义通知：

- `deno/registryState` - 当 `deno.suggest.imports.autoDiscover` 为 `true`
  且将导入添加到文档的源未明确设置在 `deno.suggest.imports.hosts`
  中时，将检查源并将

状态通知发送到客户端。

在接收通知时，如果参数 `suggestion` 为
`true`，客户端应该为用户提供选择启用源并将其添加到 `deno.suggest.imports.hosts`
配置中。如果 `suggestion` 为
`false`，客户端应该将其添加到配置中，以阻止语言服务器尝试检测是否支持建议。

通知的参数是：

```ts
interface RegistryStatusNotificationParams {
  origin: string;
  suggestions: boolean;
}
```

## 语言标识

语言服务器支持以下文本文档语言标识的诊断和格式化：

- `"javascript"`
- `"javascriptreact"`
- `"jsx"` _非标准，与 `javascriptreact` 相同_
- `"typescript"`
- `"typescriptreact"`
- `"tsx"` _非标准，与 `typescriptreact` 相同_

语言服务器仅支持以下语言标识的格式化：

- `"json"`
- `"jsonc"`
- `"markdown"`
