---
title: "语言服务器集成"
oldUrl:
- /runtime/manual/reference/lsp/
- /runtime/manual/advanced/language_server/overview/
- /runtime/manual/advanced/language_server/imports/
- /runtime/manual/advanced/language_server/testing_api/
- /runtime/reference/cli/lsp_integration/
---

:::tip

如果您正在寻找如何在各种编辑器中使用 Deno 的 LSP 的信息，请访问
[设置您的环境页面](/runtime/getting_started/setup_your_environment/)。

:::

Deno CLI 内置了一个语言服务器，可以提供智能的编辑体验，以及轻松访问 Deno
内置的其他工具。对于大多数用户来说，使用语言服务器通常是通过诸如
[Visual Studio Code](/runtime/reference/vscode/) 或
[其他编辑器](/runtime/getting_started/setup_your_environment/) 来实现的。

本页面专为那些创建语言服务器集成或为 Deno 提供智能集成的包注册表的用户设计。

Deno 语言服务器提供了
[语言服务器协议](https://microsoft.github.io/language-server-protocol/)
的服务器实现，该协议专门为提供 _Deno_
代码视图而定制。它已集成到命令行中，可以通过 `lsp` 子命令启动。

## 结构

当语言服务器启动时，会创建一个 `LanguageServer`
实例，该实例保存语言服务器的所有状态。它还定义了客户端通过语言服务器 RPC
协议调用的所有方法。

## 设置

语言服务器支持工作区的多种设置：

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

此外，语言服务器还支持针对每个资源的设置：

- `deno.enable`
- `deno.enablePaths`
- `deno.codeLens.test`

Deno 在语言服务器进程的多个点分析这些设置。首先，当客户端发送 `initialize`
请求时，`initializationOptions` 将被假定为代表 `deno`
命名空间选项的对象。例如，以下值将启用 Deno 并为此语言服务器实例启用不稳定 API。

```json
{
  "enable": true,
  "unstable": true
}
```

当语言服务器收到 `workspace/didChangeConfiguration`
通知时，它将评估客户端是否指示其具有 `workspaceConfiguration`
能力。如果有，它将发送一个 `workspace/configuration`
请求，该请求将包括对工作区配置以及语言服务器当前跟踪的所有 URI 的配置的请求。

如果客户端具有 `workspaceConfiguration` 能力，语言服务器将在收到
`textDocument/didOpen` 通知时发送 URI 的配置请求，以获取特定资源的设置。

如果客户端没有 `workspaceConfiguration`
能力，语言服务器将假定工作区设置适用于所有资源。

## 命令

语言服务器可能会向客户端发出几个命令，客户端应实现这些命令：

### .cache

`deno.cache`
作为解析代码操作发送，当有未缓存的模块标识符被导入模块时。它将发送一个包含已解析标识符作为字符串的参数，以便缓存。

### showReferences

`deno.showReferences`
作为某些代码镜片的命令发送，以显示引用的位置。参数包含命令的主题标识符、目标的起始位置以及要显示的引用位置。

### test

`deno.test`
作为测试代码镜片的一部分发送，客户端应根据参数运行测试，参数包含测试所在的标识符和用于过滤测试的测试名称。

## 请求

LSP 目前支持以下自定义请求。客户端应实现这些请求，以便与 Deno 良好集成：

### /cache

`deno/cache` 将指示 Deno 尝试缓存模块及其所有依赖项。如果仅传递
`referrer`，则将加载模块标识符的所有依赖项。如果 `uris` 中有值，则仅缓存这些
`uris`。

它期望的参数为：

```ts
interface CacheParams {
  referrer: TextDocumentIdentifier;
  uris: TextDocumentIdentifier[];
}
```

### performance

`deno/performance` 请求返回 Deno 内部仪器的时间平均值。它不需要任何参数。

### reloadImportRegistries

`deno/reloadImportRegistries`
重新加载从导入注册表缓存的所有响应。它不需要任何参数。

### virtualTextDocument

`deno/virtualTextDocument` 请求从 LSP
获取虚拟文本文档，这是一个可以在客户端显示的只读文档。这允许客户端访问 Deno
缓存中的文档，例如远程模块和 Deno 内置的 TypeScript 库文件。Deno
语言服务器将使用自定义模式 `deno:` 对所有内部文件进行编码，因此客户端应将所有对
`deno:` 模式的请求路由回 `deno/virtualTextDocument` API。

它还支持一个特殊的 URL `deno:/status.md`，该 URL 提供一个包含 LSP 状态详细信息的
Markdown 格式文本文档，供用户查看。

它期望的参数为：

```ts
interface VirtualTextDocumentParams {
  textDocument: TextDocumentIdentifier;
}
```

### task

`deno/task` 请求返回可用的 deno 任务，请参阅
[task_runner](/runtime/reference/cli/task_runner/)。它不需要任何参数。

## 通知

目前有一个自定义通知从服务器发送到客户端，即 `deno/registryState`。当
`deno.suggest.imports.autoDiscover` 为 `true` 且添加到文档中的导入的源未在
`deno.suggest.imports.hosts` 中明确设置时，将检查源并向客户端发送状态通知。

当收到通知时，如果参数 `suggestion` 为
`true`，客户端应向用户提供启用源并将其添加到 `deno.suggest.imports.hosts`
配置中的选项。如果 `suggestion` 为 `false`，客户端应将其添加到配置中为
`false`，以阻止语言服务器尝试检测是否支持建议。

通知的参数为：

```ts
interface RegistryStatusNotificationParams {
  origin: string;
  suggestions: boolean;
}
```

## 语言 ID

语言服务器支持以下
[文本文档语言 ID](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocumentItem)
的诊断和格式化：

- `"javascript"`
- `"javascriptreact"`
- `"jsx"` _非标准，与 `javascriptreact` 相同_
- `"typescript"`
- `"typescriptreact"`
- `"tsx"` _非标准，与 `typescriptreact` 相同_

语言服务器仅支持以下语言 ID 的格式化：

- `"json"`
- `"jsonc"`
- `"markdown"`

## 测试

Deno 语言服务器支持一组自定义 API 以启用测试。这些 API 围绕提供信息以支持
[vscode 的测试 API](https://code.visualstudio.com/api/extension-guides/testing)
构建，但也可以被其他语言服务器客户端用于提供类似的接口。

客户端和服务器都应支持实验性的 `testingApi` 能力：

```ts
interface ClientCapabilities {
  experimental?: {
    testingApi: boolean;
  };
}
```

```ts
interface ServerCapabilities {
  experimental?: {
    testingApi: boolean;
  };
}
```

当支持测试 API 的 Deno
版本遇到支持该能力的客户端时，它将初始化处理测试检测的代码，并开始提供启用它的通知。

还应注意的是，当启用测试 API 能力时，测试代码镜片将不再发送到客户端。

### 测试设置

有一些特定设置会改变语言服务器的行为：

- `deno.testing.args` - 一个字符串数组，将在执行测试时作为参数提供。这与
  `deno test` 子命令的工作方式相同。
- `deno.testing.enable` - 一个二进制标志，用于启用或禁用测试服务器

### 测试通知

服务器将在某些条件下向客户端发送通知。

#### deno/testModule

当服务器发现包含测试的模块时，它将通过发送 `deno/testModule` 通知以及
`TestModuleParams` 的有效负载来通知客户端。

Deno 以这种方式构建：

- 一个模块可以包含 _n_ 个测试。
- 一个测试可以包含 _n_ 个步骤。
- 一个步骤可以包含 _n_ 个步骤。

当 Deno 对测试模块进行静态分析时，它尝试识别任何测试和测试步骤。由于在 Deno
中声明测试的动态方式，它们不能总是被静态识别，只能在模块执行时被识别。通知旨在在更新客户端时处理这两种情况。当测试被静态发现时，通知
`kind` 将为 `"replace"`，当测试或步骤在执行时被发现时，通知 `kind` 将为
`"insert"`。

当测试文档在编辑器中编辑时，并且从客户端收到 `textDocument/didChange`
通知时，服务器端将对这些更改进行静态分析，如果测试已更改，客户端将收到通知。

当客户端收到 `"replace"` 通知时，它可以安全地“替换”测试模块表示，而当收到
`"insert"` 时，它应递归地尝试添加到现有表示中。

对于测试模块，`textDocument.uri` 应用作任何表示的唯一
ID（因为它是唯一模块的字符串 URL）。`TestData` 项包含一个唯一的 `id` 字符串。此
`id` 字符串是服务器跟踪测试的识别信息的 SHA-256 哈希值。

```ts
interface TestData {
  /** 此测试/步骤的唯一 ID。 */
  id: string;

  /** 测试/步骤的显示标签。 */
  label: string;

  /** 与此测试/步骤关联的任何测试步骤 */
  steps?: TestData[];

  /** 适用于测试的所属文本文档的范围。 */
  range?: Range;
}

interface TestModuleParams {
  /** 与测试相关的文本文档标识符。 */
  textDocument: TextDocumentIdentifier;

  /** 一个指示，描述测试是否是 _新_ 发现的，应 _插入_，或者关联的测试是否替换任何现有测试。 */
  kind: "insert" | "replace";

  /** 测试模块的文本标签。 */
  label: string;

  /** 此测试模块拥有的测试数组。 */
  tests: TestData[];
}
```

#### deno/testModuleDelete

当服务器观察到的测试模块被删除时，服务器将发出 `deno/testModuleDelete`
通知。当收到通知时，客户端应删除测试模块及其所有子测试和测试步骤的表示。

```ts
interface TestModuleDeleteParams {
  /** 已被删除的文本文档标识符。 */
  textDocument: TextDocumentIdentifier;
}
```

#### deno/testRunProgress

当客户端请求 [`deno/testRun`](#denotestrun) 时，服务器将通过
`deno/testRunProgress` 通知支持该测试运行的进度。

客户端应处理这些消息并更新任何 UI 表示。

状态更改在 `TestRunProgressParams` 的 `.message.kind` 属性中表示。状态为：

- `"enqueued"` - 测试或测试步骤已排队等待测试。
- `"skipped"` - 测试或测试步骤被跳过。当 Deno 测试的 `ignore` 选项设置为 `true`
  时会发生这种情况。
- `"started"` - 测试或测试步骤已开始。
- `"passed"` - 测试或测试步骤已通过。
- `"failed"` -
  测试或测试步骤已失败。这旨在指示测试框架的错误，而不是测试本身的错误，但 Deno
  目前不支持这种区分。
- `"errored"` - 测试或测试步骤出错。有关错误的更多信息将在 `.message.messages`
  属性中。
- `"end"` - 测试运行已结束。

```ts
interface TestIdentifier {
  /** 消息相关的测试模块。 */
  textDocument: TextDocumentIdentifier;

  /** 测试的可选 ID。如果不存在，则消息适用于测试模块中的所有测试。 */
  id?: string;

  /** 步骤的可选 ID。如果不存在，则消息仅适用于测试。 */
  stepId?: string;
}

interface TestMessage {
  /** 消息的内容。 */
  message: MarkupContent;

  /** 表示预期输出的可选字符串。 */
  expectedOutput?: string;

  /** 表示实际输出的可选字符串。 */
  actualOutput?: string;

  /** 与消息相关的可选位置。 */
  location?: Location;
}

interface TestEnqueuedStartedSkipped {
  /** 特定测试或测试步骤发生的状态更改。
   *
   * - `"enqueued"` - 测试现在已排队等待测试
   * - `"started"` - 测试已开始
   * - `"skipped"` - 测试被跳过
   */
  type: "enqueued" | "started" | "skipped";

  /** 与状态更改相关的测试或测试步骤。 */
  test: TestIdentifier;
}

interface TestFailedErrored {
  /** 特定测试或测试步骤发生的状态更改。
   *
   * - `"failed"` - 测试未能正确运行，与测试出错不同。
   *   目前 Deno 语言服务器不支持此功能。
   * - `"errored"` - 测试出错。
   */
  type: "failed" | "errored";

  /** 与状态更改相关的测试或测试步骤。 */
  test: TestIdentifier;

  /** 与状态更改相关的消息。 */
  messages: TestMessage[];

  /** 从开始到当前状态的可选持续时间，以毫秒为单位。 */
  duration?: number;
}

interface TestPassed {
  /** 特定测试或测试步骤发生的状态更改。 */
  type: "passed";

  /** 与状态更改相关的测试或测试步骤。 */
  test: TestIdentifier;

  /** 从开始到当前状态的可选持续时间，以毫秒为单位。 */
  duration?: number;
}

interface TestOutput {
  /** 测试或测试步骤有输出信息 / 记录信息。 */
  type: "output";

  /** 输出的值。 */
  value: string;

  /** 如果有，则关联的测试或测试步骤。 */
  test?: TestIdentifier;

  /** 与输出相关的可选位置。 */
  location?: Location;
}

interface TestEnd {
  /** 测试运行已结束。 */
  type: "end";
}

type TestRunProgressMessage =
  | TestEnqueuedStartedSkipped
  | TestFailedErrored
  | TestPassed
  | TestOutput
  | TestEnd;

interface TestRunProgressParams {
  /** 进度消息适用的测试运行 ID。 */
  id: number;

  /** 消息*/
  message: TestRunProgressMessage;
}
```

### 测试请求

服务器处理两种不同的请求：

#### deno/testRun

要请求语言服务器执行一组测试，客户端发送 `deno/testRun`
请求，其中包括用于未来响应客户端的测试运行
ID、测试运行的类型以及要包含或排除的任何测试模块或测试。

目前 Deno 仅支持 `"run"` 类型的测试运行。`"debug"` 和 `"coverage"`
计划在未来支持。

当没有包含任何测试模块或测试时，意味着应执行所有发现的测试模块和测试。当包含测试模块但不包含任何测试
ID
时，意味着应包含该测试模块中的所有测试。一旦所有测试被识别，任何排除的测试将被删除，并在响应中返回已解析的测试集为
`"enqueued"`。

由于测试步骤声明和运行的动态性质，无法通过此 API 包含或排除测试步骤。

```ts
interface TestRunRequestParams {
  /** 用于未来消息的测试运行 ID。 */
  id: number;

  /** 运行类型。目前 Deno 仅支持 `"run"` */
  kind: "run" | "coverage" | "debug";

  /** 要从测试运行中排除的测试模块或测试。 */
  exclude?: TestIdentifier[];

  /** 要包含在测试运行中的测试模块或测试。 */
  include?: TestIdentifier[];
}

interface EnqueuedTestModule {
  /** 已排队测试 ID 相关的测试模块 */
  textDocument: TextDocumentIdentifier;

  /** 现在已排队等待测试的测试 ID */
  ids: string[];
}

interface TestRunResponseParams {
  /** 现在已排队等待测试的测试模块和测试 ID。 */
  enqueued: EnqueuedTestModule[];
}
```

#### deno/testRunCancel

如果客户端希望取消当前正在运行的测试运行，它发送一个 `deno/testRunCancel`
请求，其中包含要取消的测试 ID。返回的响应将是 `true`（如果测试被取消）或
`false`（如果无法取消）。在测试被取消时，仍将发送适当的测试进度通知。

```ts
interface TestRunCancelParams {
  /** 要取消的测试 ID。 */
  id: number;
}
```
