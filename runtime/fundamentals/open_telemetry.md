---
title: OpenTelemetry
---

:::caution

Deno 的 OpenTelemetry 集成仍在开发中，可能会发生变化。要使用它，必须向 Deno 传递
`--unstable-otel` 标志。

:::

Deno 内置了对 [OpenTelemetry](https://opentelemetry.io/) 的支持。

> OpenTelemetry 是一组 API、SDK
> 和工具。使用它来检测、生成、收集和导出遥测数据（指标、日志和跟踪），以帮助分析软件的性能和行为。
>
> <i>- https://opentelemetry.io/</i>

此集成使您能够使用 OpenTelemetry 可观测性工具（如日志、指标和跟踪）来监控您的
Deno 应用程序。

Deno 提供以下功能：

- 使用 OpenTelemetry 协议将收集的指标、跟踪和日志导出到服务器。
- 使用 OpenTelemetry 指标、跟踪和日志对 Deno
  运行时进行[自动检测](#auto-instrumentation)。
- 使用 `npm:@opentelemetry/api`
  包创建的[用户定义指标、跟踪和日志的收集](#user-metrics)。

## 快速开始

要启用 OpenTelemetry 集成，请使用 `--unstable-otel` 标志运行您的 Deno
脚本，并设置环境变量 `OTEL_DENO=true`：

```sh
OTEL_DENO=true deno run --unstable-otel my_script.ts
```

这将自动收集运行时可观测性数据，并使用 Protobuf over HTTP (`http/protobuf`)
将其导出到 `localhost:4318` 的 OpenTelemetry 端点。

:::tip

如果您尚未设置 OpenTelemetry 收集器，可以通过运行以下命令使用
[Docker 中的本地 LGTM 堆栈](https://github.com/grafana/docker-otel-lgtm/tree/main?tab=readme-ov-file)（Loki（日志）、Grafana（仪表板）、Tempo（跟踪）和
Mimir（指标））开始：

```sh
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
	-v "$PWD"/lgtm/grafana:/data/grafana \
	-v "$PWD"/lgtm/prometheus:/data/prometheus \
	-v "$PWD"/lgtm/loki:/data/loki \
	-e GF_PATHS_DATA=/data/grafana \
	docker.io/grafana/otel-lgtm:0.8.1
```

然后，您可以使用用户名 `admin` 和密码 `admin` 访问 `http://localhost:3000` 的
Grafana 仪表板。

:::

这将自动收集和导出运行时可观测性数据，如 `console.log`、HTTP 请求的跟踪和 Deno
运行时的指标。[了解更多关于自动检测的信息](#auto-instrumentation)。

您还可以使用 `npm:@opentelemetry/api`
包创建自己的指标、跟踪和日志。[了解更多关于用户定义指标的信息](#user-metrics)。

## 自动检测

Deno 会自动收集一些可观测性数据并将其导出到 OTLP 端点。

这些数据在 Deno 运行时的内置检测范围内导出。此范围的名称为 `deno`。Deno
运行时的版本是 `deno` 检测范围的版本（例如 `deno:2.1.4`）。

### 跟踪

Deno 会自动为各种操作创建跨度，例如：

- 使用 `Deno.serve` 处理的传入 HTTP 请求。
- 使用 `fetch` 发出的传出 HTTP 请求。

#### `Deno.serve`

当您使用 `Deno.serve` 创建 HTTP
服务器时，会为每个传入请求创建一个跨度。跨度在发送响应头时自动结束（而不是在发送响应体时结束）。

创建的跨度的名称为 `${method}`。跨度类型为 `server`。

创建跨度时，会自动添加以下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.full`: 请求的完整 URL（如 `req.url` 报告的）。
- `url.scheme`: 请求 URL 的方案（例如 `http` 或 `https`）。
- `url.path`: 请求 URL 的路径。
- `url.query`: 请求 URL 的查询字符串。

处理请求后，会添加以下属性：

- `http.status_code`: 响应的状态码。

Deno 不会自动向跨度添加 `http.route`
属性，因为运行时不知道路由，而是由用户处理函数中的路由逻辑决定。如果您想向跨度添加
`http.route` 属性，可以在处理函数中使用 `npm:@opentelemetry/api`
添加。在这种情况下，您还应更新跨度名称以包含路由。

```ts
import { trace } from "npm:@opentelemetry/api@1";

const INDEX_ROUTE = new URLPattern({ pathname: "/" });
const BOOK_ROUTE = new URLPattern({ pathname: "/book/:id" });

Deno.serve(async (req) => {
  const span = trace.getActiveSpan();
  if (INDEX_ROUTE.test(req.url)) {
    span.setAttribute("http.route", "/");
    span.updateName(`${req.method} /`);

    // 处理根路由
  } else if (BOOK_ROUTE.test(req.url)) {
    span.setAttribute("http.route", "/book/:id");
    span.updateName(`${req.method} /book/:id`);

    // 处理书籍路由
  } else {
    return new Response("Not found", { status: 404 });
  }
});
```

#### `fetch`

当您使用 `fetch` 发出 HTTP
请求时，会为该请求创建一个跨度。跨度在接收到响应头时自动结束。

创建的跨度的名称为 `${method}`。跨度类型为 `client`。

创建跨度时，会自动添加以下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.full`: 请求的完整 URL。
- `url.scheme`: 请求 URL 的方案。
- `url.path`: 请求 URL 的路径。
- `url.query`: 请求 URL 的查询字符串。

接收到响应后，会添加以下属性：

- `http.status_code`: 响应的状态码。

### 指标

以下指标会自动收集并导出：

#### `Deno.serve` / `Deno.serveHttp`

##### `http.server.request.duration`

使用 `Deno.serve` 或 `Deno.serveHttp` 处理的传入 HTTP
请求的持续时间的直方图。测量的时间是从接收到请求到发送响应头的时间。这不包括发送响应体的时间。此指标的单位是秒。直方图桶为
`[0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0]`。

此指标记录以下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.scheme`: 请求 URL 的方案。
- `network.protocol.version`: 请求使用的 HTTP 协议版本（例如 `1.1` 或 `2`）。
- `server.address`: 服务器监听的地址。
- `server.port`: 服务器监听的端口。
- `http.response.status_code`: 响应的状态码（如果请求已处理且未发生致命错误）。
- `error.type`: 发生的错误类型（如果请求处理过程中发生错误）。

##### `http.server.active_requests`

`Deno.serve` 或 `Deno.serveHttp`
在任何给定时间处理的活跃请求数量的仪表。这是已接收但尚未响应的请求数量（响应头尚未发送）。此指标记录以下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.scheme`: 请求 URL 的方案。
- `server.address`: 服务器监听的地址。
- `server.port`: 服务器监听的端口。

##### `http.server.request.body.size`

使用 `Deno.serve` 或 `Deno.serveHttp` 处理的传入 HTTP
请求的请求体大小的直方图。此指标的单位是字节。直方图桶为
`[0, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]`。

此指标记录以下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.scheme`: 请求 URL 的方案。
- `network.protocol.version`: 请求使用的 HTTP 协议版本（例如 `1.1` 或 `2`）。
- `server.address`: 服务器监听的地址。
- `server.port`: 服务器监听的端口。
- `http.response.status_code`: 响应的状态码（如果请求已处理且未发生致命错误）。
- `error.type`: 发生的错误类型（如果请求处理过程中发生错误）。

##### `http.server.response.body.size`

使用 `Deno.serve` 或 `Deno.serveHttp` 处理的传入 HTTP
请求的响应体大小的直方图。此指标的单位是字节。直方图桶为
`[0, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]`。

此指标记录以下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.scheme`: 请求 URL 的方案。
- `network.protocol.version`: 请求使用的 HTTP 协议版本（例如 `1.1` 或 `2`）。
- `server.address`: 服务器监听的地址。
- `server.port`: 服务器监听的端口。
- `http.response.status_code`: 响应的状态码（如果请求已处理且未发生致命错误）。
- `error.type`: 发生的错误类型（如果请求处理过程中发生错误）。

### 日志

以下日志会自动收集并导出：

- 使用 `console.*` 方法（如 `console.log` 和 `console.error`）创建的任何日志。
- Deno 运行时创建的任何日志，例如调试日志、`Downloading` 日志等。
- 导致 Deno 运行时退出的任何错误（无论是来自用户代码还是运行时本身）。

从 JavaScript 代码引发的日志将在相关跨度上下文中导出，如果日志发生在活动跨度内。

可以使用 `OTEL_DENO_CONSOLE` 环境变量配置 `console` 自动检测：

- `capture`: 日志会输出到 stdout/stderr，并且也会通过 OpenTelemetry
  导出。（默认）
- `replace`: 日志仅通过 OpenTelemetry 导出，不会输出到 stdout/stderr。
- `ignore`: 日志仅输出到 stdout/stderr，不会通过 OpenTelemetry 导出。

## 用户定义指标

除了自动收集的遥测数据外，您还可以使用 `npm:@opentelemetry/api`
包创建自己的指标和跟踪。

您无需配置 `npm:@opentelemetry/api` 包即可在 Deno 中使用它。Deno 在传递
`--unstable-otel` 标志时会自动设置 `npm:@opentelemetry/api` 包。无需调用
`metrics.setGlobalMeterProvider()`、`trace.setGlobalTracerProvider()` 或
`context.setGlobalContextManager()`。所有资源配置、导出器设置等均通过环境变量完成。

Deno 与 `npm:@opentelemetry/api` 包的 `1.x` 版本兼容。您可以直接从
`npm:@opentelemetry/api@1` 导入，也可以使用 `deno add` 在本地安装该包并从
`@opentelemetry/api` 导入。

```sh
deno add npm:@opentelemetry/api@1
```

对于跟踪和指标，您需要分别为跟踪器和仪表定义名称。如果您正在检测库，您应该以库的名称命名跟踪器或仪表（例如
`my-awesome-lib`）。如果您正在检测应用程序，您应该以应用程序的名称命名跟踪器或仪表（例如
`my-app`）。跟踪器或仪表的版本应设置为库或应用程序的版本。

### 跟踪

要创建新的跨度，首先从 `npm:@opentelemetry/api` 导入 `trace`
对象并创建新的跟踪器：

```ts
import { trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("my-app", "1.0.0");
```

然后，使用 `tracer.startActiveSpan`
方法创建新的跨度，并向其传递回调函数。您必须通过调用 `startActiveSpan`
返回的跨度对象上的 `end` 方法手动结束跨度。

```ts
function myFunction() {
  return tracer.startActiveSpan("myFunction", (span) => {
    try {
      // 执行 myFunction 的工作
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: trace.SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

`span.end()` 应在 `finally`
块中调用，以确保即使发生错误，跨度也会结束。`span.recordException` 和
`span.setStatus` 也应在 `catch` 块中调用，以记录发生的任何错误。

在回调函数内部，创建的跨度是“活动跨度”。您可以使用 `trace.getActiveSpan()`
获取活动跨度。“活动跨度”将用作在回调函数（或从回调函数调用的任何函数）内部创建的任何跨度（手动或由运行时自动创建）的父跨度。[了解更多关于上下文传播的信息](#context-propagation)。

`startActiveSpan` 方法返回回调函数的返回值。

跨度在其生命周期内可以添加属性。属性是表示跨度的结构化元数据的键值对。可以使用跨度对象上的
`setAttribute` 和 `setAttributes` 方法添加属性。

```ts
span.setAttribute("key", "value");
span.setAttributes({ success: true, "bar.count": 42n, "foo.duration": 123.45 });
```

属性的值可以是字符串、数字（浮点数）、大整数（限制为
u64）、布尔值或这些类型的数组。如果属性值不是这些类型之一，它将被忽略。

可以使用跨度对象上的 `updateName` 方法更新跨度的名称。

```ts
span.updateName("new name");
```

可以使用跨度对象上的 `setStatus` 方法设置跨度的状态。`recordException`
方法可用于记录跨度生命周期内发生的异常。`recordException`
创建一个带有异常堆栈跟踪和名称的事件，并将其附加到跨度。**`recordException`
不会将跨度状态设置为 `ERROR`，您必须手动执行此操作。**

```ts
import { SpanStatusCode } from "npm:@opentelemetry/api@1";

span.setStatus({
  code: SpanStatusCode.ERROR,
  message: "An error occurred",
});
span.recordException(new Error("An error occurred"));

// 或

span.setStatus({
  code: SpanStatusCode.OK,
});
```

跨度还可以添加[事件](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addEvent)和[链接](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addLink)。事件是与跨度关联的时间点。链接是对其他跨度的引用。

也可以使用 `tracer.startSpan`
手动创建跨度，该方法返回一个跨度对象。此方法不会将创建的跨度设置为活动跨度，因此它不会自动用作稍后创建的任何跨度或任何
`console.log` 调用的父跨度。可以使用[上下文传播 API](#context-propagation)
手动将跨度设置为回调的活动跨度。

`tracer.startActiveSpan` 和 `tracer.startSpan`
都可以接受一个可选的选项包，包含以下任何属性：

- `kind`: 跨度的类型。可以是
  `SpanKind.CLIENT`、`SpanKind.SERVER`、`SpanKind.PRODUCER`、`SpanKind.CONSUMER`
  或 `SpanKind.INTERNAL`。默认为 `SpanKind.INTERNAL`。
- `startTime` 表示跨度开始时间的 `Date` 对象，或表示自 Unix
  纪元以来的开始时间的数字（以毫秒为单位）。如果未提供，将使用当前时间。
- `attributes`: 包含要添加到跨度的属性的对象。
- `links`: 包含要添加到跨度的链接的数组。
- `root`: 指示跨度是否应为根跨度的布尔值。如果为
  `true`，跨度将没有父跨度（即使存在活动跨度）。

在选项包之后，`tracer.startActiveSpan` 和 `tracer.startSpan`
还可以接受来自[上下文传播 API](#context-propagation) 的 `context` 对象。

在
[OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.TraceAPI.html)
中了解更多关于完整跟踪 API 的信息。

### 指标

要创建指标，首先从 `npm:@opentelemetry/api` 导入 `metrics` 对象并创建新的仪表：

```ts
import { metrics } from "npm:@opentelemetry/api@1";

const meter = metrics.getMeter("my-app", "1.0.0");
```

然后，可以从仪表创建仪器，并用于记录值：

```ts
const counter = meter.createCounter("my_counter", {
  description: "A simple counter",
  unit: "1",
});

counter.add(1);
counter.add(2);
```

每次记录还可以具有关联的属性：

```ts
counter.add(1, { color: "red" });
counter.add(2, { color: "blue" });
```

:::tip

在 OpenTelemetry
中，指标属性通常应具有低基数。这意味着不应有太多唯一的属性值组合。例如，为用户所在的大陆设置属性可能是可以的，但为用户的确切纬度和经度设置属性则基数太高。高基数属性可能会导致指标存储和导出问题，应避免使用。对于高基数数据，请使用跨度和日志。

:::

可以使用仪表创建多种类型的仪器：

- **计数器**:
  计数器是单调递增的值。计数器只能为正数。它们可用于始终递增的值，例如处理的请求数量。

- **上下计数器**:
  上下计数器是可以增加和减少的值。上下计数器可用于可以增加和减少的值，例如活跃连接数或正在处理的请求数。

- **仪表**:
  仪表是可以设置为任何值的值。它们用于不随时间“累积”但在任何给定时间具有特定值的值，例如当前温度。

- **直方图**:
  直方图是记录为值分布的值。直方图可用于不仅仅是单个数字的值，而是数字分布的值，例如请求的响应时间（以毫秒为单位）。直方图可用于计算百分位数、平均值和其他统计信息。它们具有预定义的边界，用于定义值放入的桶。默认
