# 内部详情

## Deno 和 Linux 的类比

|                       **Linux** | **Deno**                |
| ------------------------------: | :---------------------- |
|                            进程 | Web Workers             |
|                        系统调用 | Ops                     |
|                 文件描述符 (fd) | [资源标识 (rid)](#资源) |
|                          调度器 | Tokio                   |
| 用户空间: libc++ / glib / boost | https://deno.land/std/  |
|                 /proc/\$\$/stat | [Deno.metrics()](#指标) |
|                          手册页 | Deno 类型               |

### 资源

资源 (也称为 `rid`) 是 Deno
的文件描述符版本。它们是用于引用打开文件、套接字和其他概念的整数值。为了进行测试，可以查询系统中有多少个打开资源。

```ts
console.log(Deno.resources());
// { 0: "stdin", 1: "stdout", 2: "stderr" }
Deno.close(0);
console.log(Deno.resources());
// { 1: "stdout", 2: "stderr" }
```

### 指标

指标是 Deno 的各种统计数据的内部计数器。

```shell
> console.table(Deno.metrics())
┌─────────────────────────┬───────────┐
│          (idx)          │  Values   │
├─────────────────────────┼───────────┤
│      opsDispatched      │    9      │
│    opsDispatchedSync    │    0      │
│   opsDispatchedAsync    │    0      │
│ opsDispatchedAsyncUnref │    0      │
│      opsCompleted       │    9      │
│    opsCompletedSync     │    0      │
│    opsCompletedAsync    │    0      │
│ opsCompletedAsyncUnref  │    0      │
│    bytesSentControl     │   504     │
│      bytesSentData      │    0      │
│      bytesReceived      │   856     │
└─────────────────────────┴───────────┘
```

## 会议

- Ryan Dahl. (2020 年 5 月 27 日).
  [Deno 的一个有趣案例](https://www.youtube.com/watch?v=1b7FoBwxc7E). Deno
  以色列.
- Bartek Iwa ń czuk. (2020 年 10 月 6 日).
  [Deno 内部 - 现代 JS/TS 运行时的构建方式](https://www.youtube.com/watch?v=AOvg_GbnsbA&t=35m13s).
  巴黎 Deno.
