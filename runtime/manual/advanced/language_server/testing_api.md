# 测试 API

Deno 语言服务器支持一组自定义 API 以启用测试。这些 API 围绕着提供信息来支持
[vscode 的测试 API](https://code.visualstudio.com/api/extension-guides/testing)，但也可以被其他语言服务器客户端用来提供类似的接口。

## 功能

客户端和服务器都应该支持实验性的 `testingApi` 功能：

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
版本遇到支持该功能的客户端时，它将初始化处理测试检测的代码，并开始提供启用测试的通知。

还应该注意，当启用测试 API 功能时，测试代码镜头将不再发送给客户端。

## 设置

有特定的设置可以更改语言服务器的行为：

- `deno.testing.args` - 一个字符串数组，用于在执行测试时提供参数，这与
  `deno test` 子命令的方式相同。
- `deno.testing.enable` - 一个启用或禁用测试服务器的二进制标志

## 通知

服务器将在特定条件下向客户端发送通知。

### `deno/testModule`

当服务器发现包含测试的模块时，它将通过发送 `deno/testModule` 通知以及
`TestModuleParams` 的有效负载来通知客户端。

Deno 以以下方式组织：

- 一个模块可以包含 _n_ 个测试。
- 一个测试可以包含 _n_ 个步骤。
- 一个步骤可以包含 _n_ 个步骤。

当 Deno 对测试模块进行静态分析时，它会尝试识别任何测试和测试步骤。由于测试可以在
Deno
中以动态方式声明，它们不能总是被静态识别，只能在模块执行时才能被识别。通知旨在处理更新客户端时的这两种情况。当静态发现测试时，通知
`kind` 将是 `"replace"`，当在执行时发现测试或步骤时，通知 `kind` 将是
`"insert"`。

当客户端接收到 `"replace"` 通知时，它可以安全地 "替换"
测试模块的表示，而当接收到 `"insert"` 时，它应该递归尝试添加到现有表示中。

对于测试模块，`textDocument.uri`
应该用作任何表示的唯一标识符（因为它是唯一模块的字符串 URL）。`TestData`
项目包含一个唯一的 `id` 字符串。此 `id` 字符串是服务器跟踪测试的标识信息的
SHA-256 散列。

```ts, ignore
interface TestData {
  /** 此测试/步骤的唯一 ID。 */
  id: string;

  /** 测试/步骤的显示标签。 */
  label: string;

  /** 与此测试/步骤相关的任何测试步骤 */
  steps?: TestData[];

  /** 适用于测试的拥有文本文档的范围。 */
  range?: Range;
}

interface TestModuleParams {
  /** 与测试相关的文本文档标识符。 */
  textDocument: TextDocumentIdentifier;

  /** 如果所描述的测试是 _新_ 发现的并应该被 _插入_，或者相关的测试是替代现有测试的替代。 */
  kind: "insert" | "replace";

  /** 测试模块的文本标签。 */
  label: string;

  /** 由该测试模块拥有的测试的数组。 */
  tests: TestData[];
}
```

### `deno/testModuleDelete`

当服务器正在观察的测试模块被删除时，服务器将发出 `deno/testModuleDelete`
通知。收到通知后，客户端应删除测试模块及其所有子测试和测试步骤的表示。

```ts, ignore
interface TestModuleDeleteParams {
  /** 已删除的文本文档标识符。 */
  textDocument: TextDocumentIdentifier;
}
```

### `deno/testRunProgress`

当客户端请求 [`deno/testRun`](#denotestrun) 时，服务器将通过
`deno/testRunProgress` 通知支持测试运行的进度。

客户端应处理这些消息并更新任何 UI 表示。

状态变化在 `TestRunProgressParams` 的 `.message.kind` 属性中表示。状态包括：

- `"enqueued"` - 测试或测试步骤已经排队等待测试。
- `"skipped"` - 测试或测试步骤已被跳过。当 Deno 测试的 `ignore` 选项设置为
  `true` 时会发生这种情况。
- `"started"` - 测试或测试步骤已启动。
- `"passed"` - 测试或测试步骤已通过。
- `"failed"` -
  测试或测试步骤失败。这旨在指示测试工具的错误而不是测试本身的错误，但 Deno
  目前不支持这种区分。
- `"errored"` - 测试或测试步骤出现错误。关于错误的其他信息将在
  `.message.messages` 属性中。

```ts, ignore
interface TestIdentifier {
  /** 与消息相关的测试模块。 */
  textDocument: TextDocumentIdentifier;

  /** 测试的可选 ID。如果不存在，消息适用于测试模块中的所有测试。 */
  id?: string;

  /** 步骤的可选 ID。如果不存在，消息仅适用于测试。 */
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
  /** 发生在特定测试或测试步骤的状态更改。
   *
   * - "enqueued" - 测试现在已排队等待测试
   * - "started" - 测试已启动
   * - "skipped" - 测试被跳过
   */
  type: "enqueued" | "started" | "skipped";

  /** 与状态更改相关的测试或测试步骤。 */
  test: TestIdentifier;
}

interface TestFailedErrored {
  /** 发生在特定测试或测试步骤的状态更改。
   *
   * - "failed" - 测试未正确运行，与测试出错不同。
   *   目前 Deno 语言服务器不支持此功能。
   * - "errored" - 测试出错。
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
  /** 发生在特定测试或测试步骤的状态更改。 */
  type: "passed";

  /** 与状态更改相关的测试或测试步骤。 */
  test: TestIdentifier;

  /** 从开始到当前状态的可选持续时间，以毫秒为单位。 */
  duration?: number;
}

interface TestOutput {
  /** 测试或测试步骤具有输出信息/记录信息。 */
  type: "output";

  /** 输出的值。 */
  value: string;

  /** 如果存在，与输出相关的测试或测试步骤。 */
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
  /** 进度消息适用于的测试运行 ID。 */
  id: number;

  /** 消息 */
  message: TestRunProgressMessage;
}
```

## 请求

服务器处理两种不同的请求：

### `deno/testRun`

要求语言服务器执行一组测试，客户端发送一个 `deno/testRun`
请求，其中包括将来在响应给客户端时要使用的测试运行的
ID、测试运行的类型以及要包括或排除的任何测试模块或测试。

当前，Deno 仅支持 "run" 类型的测试运行。 "debug" 和 "coverage"
两种类型计划在将来支持。

当没有包括任何测试模块或测试时，意味着应执行所有已发现的测试模块和测试。当包括一个测试模块但不包括任何测试
ID
时，意味着应包括该测试模块中的所有测试。一旦确定了所有测试，任何排除的测试将被移除，并在响应中以
"enqueued" 形式返回已解析的测试集。

通过此 API
不可能包括或排除测试步骤，这是因为测试步骤的声明和运行方式具有动态性。

```ts，忽略
interface TestRunRequestParams {
  /** 用于将来消息的测试运行的ID。 */
  id: number;

  /** 运行类型。当前，Deno仅支持 "run" */
  kind: "run" | "coverage" | "debug";

  /** 要从测试运行中排除的测试模块或测试。 */
  exclude?: TestIdentifier[];

  /** 要在测试运行中包括的测试模块或测试。 */
  include?: TestIdentifier[];
}

interface EnqueuedTestModule {
  /** 与排队测试ID相关的测试模块 */
  textDocument: TextDocumentIdentifier;

  /** 现在已排队等待测试的测试ID */
  ids: string[];
}

interface TestRunResponseParams {
  /** 现在已排队等待测试的测试模块和测试ID。 */
  enqueued: EnqueuedTestModule[];
}
```

### `deno/testRunCancel`

如果客户端希望取消当前正在运行的测试运行，它将发送一个 `deno/testRunCancel`
请求，其中包括要取消的测试 ID。响应将返回一个布尔值
`true`，如果测试被取消，则返回
`false`，如果不可能取消。尽管测试被取消，仍将发送适当的测试进度通知。

```ts
interface TestRunCancelParams {
  /** 要取消的测试 ID。 */
  id: number;
}
```
