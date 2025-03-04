---
title: "调度 cron 任务"
oldUrl:
  - /kv/manual/cron/
---

<deno-admonition></deno-admonition>

[`Deno.cron`](https://docs.denohub.com/api/deno/~/Deno.cron) 接口允许你使用
[cron 语法](https://en.wikipedia.org/wiki/Cron) 配置 JavaScript 或 TypeScript
代码，使其在可配置的时间表上执行。在下面的示例中，我们配置了一段 JavaScript
代码，它将每分钟执行一次。

```ts
Deno.cron("Log a message", "* * * * *", () => {
  console.log("This will print once a minute.");
});
```

也可以使用 JavaScript 对象来定义 cron 时间表。在下面的示例中，我们配置了一段
JavaScript 代码，它将每小时执行一次。

```ts
Deno.cron("Log a message", { hour: { every: 1 } }, () => {
  console.log("This will print once an hour.");
});
```

`Deno.cron` 接受三个参数：

- 一个人类可读的 cron 任务名称
- 一个 cron 时间表字符串或 JavaScript 对象，用于定义 cron 任务运行的时间表
- 一个在给定时间表上执行的函数

如果你不熟悉 cron 语法，可以使用一些第三方模块
[比如这个](https://www.npmjs.com/package/cron-time-generator) 来帮助你生成 cron
时间表字符串。

## 重试失败的运行

失败的 cron
调用会自动使用默认的重试策略进行重试。如果你想指定自定义的重试策略，可以使用
`backoffSchedule`
属性来指定一个等待时间数组（以毫秒为单位），在重试函数调用之前等待。在下面的示例中，我们将尝试重试失败的回调三次——分别在一秒、五秒和十秒后。

```ts
Deno.cron("Retry example", "* * * * *", () => {
  throw new Error("Deno.cron will retry this three times, to no avail!");
}, {
  backoffSchedule: [1000, 5000, 10000],
});
```

## 设计和限制

以下是一些在使用 `Deno.cron` 时需要注意的设计细节和限制。

### 任务必须在模块的顶层作用域中定义

[`Deno.cron`](https://docs.denohub.com/api/deno/~/Deno.cron)
接口旨在支持基于预定义时间表的静态 cron 任务定义。所有 `Deno.cron`
任务必须在模块的顶层定义。任何嵌套的 `Deno.cron` 定义（例如在
[`Deno.serve`](https://docs.denohub.com/api/deno/~/Deno.serve)
处理程序中）将导致错误或被忽略。

如果你需要在 Deno 程序执行期间动态调度任务，可以使用
[Deno Queues](./queue_overview) API。

### 时区

`Deno.cron` 时间表使用 UTC 时区指定。这有助于避免与观察夏令时的时区相关的问题。

### 重叠执行

你的 cron
任务的下一次计划调用可能会与上一次调用重叠。如果发生这种情况，`Deno.cron`
将跳过下一次计划调用，以避免重叠执行。

### 星期几的数字表示

`Deno.cron` 不使用基于 0 的星期几数字表示。相反，它使用 1-7（或
SUN-SAT）来表示星期日到星期六。这可能与其他使用 0-6 表示的 cron 引擎不同。

## 在 Deno Deploy 上的使用

通过 [Deno Deploy](https://deno.com/deploy)，你可以在云端的 V8
隔离环境中运行后台任务。这样做时，有几个注意事项需要牢记。

### 与 Deno CLI 的区别

与其他 Deno 运行时内置功能（如队列和 Deno KV）一样，`Deno.cron` 在 Deno Deploy
上的实现略有不同。

#### 默认情况下 cron 的工作原理

Deno 运行时中的 `Deno.cron` 实现将执行状态保存在内存中。如果你运行多个使用
`Deno.cron` 的 Deno 程序，每个程序都将拥有自己独立的 cron 任务集。

#### 在 Deno Deploy 上 cron 的工作原理

Deno Deploy 提供了一个为高可用性和扩展性设计的 `Deno.cron` 无服务器实现。Deno
Deploy 在部署时自动提取你的 `Deno.cron`
定义，并使用按需隔离环境调度它们执行。你最新的生产部署定义了计划执行的活跃 cron
任务集。要添加、删除或修改 cron 任务，只需修改你的代码并创建新的生产部署。

Deno Deploy 保证你的 cron 任务在每个计划时间间隔内至少执行一次。这通常意味着你的
cron
处理程序将在每个计划时间被调用一次。在某些故障情况下，处理程序可能会在同一计划时间被多次调用。

### Cron 仪表板

当你进行包含 cron 任务的生产部署时，你可以在
[Deploy 仪表板](https://dash.deno.com/projects) 中项目的 `Cron` 选项卡下查看所有
cron 任务的列表。

![Deno 仪表板中的 cron 任务列表](./images/cron-tasks.png)

### 定价

`Deno.cron` 调用的计费方式与部署的入站 HTTP 请求相同。了解更多关于定价的信息
[这里](https://deno.com/deploy/pricing)。

### Deploy 特定的限制

- `Deno.cron` 仅适用于生产部署（不适用于预览部署）
- 你的 `Deno.cron` 处理程序的确切调用时间可能与计划时间相差最多一分钟

## Cron 配置示例

以下是一些常见的 cron 配置，供你参考。

```ts title="每分钟运行一次"
Deno.cron("Run once a minute", "* * * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="每十五分钟运行一次"
Deno.cron("Run every fifteen minutes", "*/15 * * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="每小时整点运行一次"
Deno.cron("Run once an hour, on the hour", "0 * * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="每三小时运行一次"
Deno.cron("Run every three hours", "0 */3 * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="每天凌晨 1 点运行一次"
Deno.cron("Run every day at 1am", "0 1 * * *", () => {
  console.log("Hello, cron!");
});
```

```ts title="每周三午夜运行一次"
Deno.cron("Run every Wednesday at midnight", "0 0 * * WED", () => {
  console.log("Hello, cron!");
});
```

```ts title="每月第一天午夜运行一次"
Deno.cron("Run on the first of the month at midnight", "0 0 1 * *", () => {
  console.log("Hello, cron!");
});
```
