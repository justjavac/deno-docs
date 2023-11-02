# 权限 API

在运行 `deno` 命令时，权限是从 CLI
授予的。用户代码通常会假设自己需要的权限集，但不能保证在执行期间授予的权限集与其一致。

在某些情况下，确保容错程序需要在运行时与权限系统交互的方式。

## 权限描述符

在 CLI 上，`/foo/bar` 的读权限表示为 `--allow-read=/foo/bar`。在运行时的 JS
中，它表示如下：

```ts
const desc = { name: "read", path: "/foo/bar" } as const;
```

其他示例：

```ts
// 全局写权限。
const desc1 = { name: "write" } as const;

// 对 `$PWD/foo/bar` 的写权限。
const desc2 = { name: "write", path: "foo/bar" } as const;

// 全局网络权限。
const desc3 = { name: "net" } as const;

// 对 127.0.0.1: 8000 的网络权限。
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;

// 高分辨率时间权限。
const desc5 = { name: "hrtime" } as const;
```

> ⚠️ 请参见
> [`PermissionDescriptor`](https://deno.land/api?s=Deno.PermissionDescriptor)
> 获取 更多详细信息的 API 参考。

> ⚠️ 在 1.30 及更高版本中，同步 API 对应项（例如
> `Deno.permissions.querySync`）适用于下面描述的所有 API。

## 查询权限

按描述符检查是否授予了权限。

```ts
// deno run --allow-read =/foo main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "granted", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

如果使用 `--deny-read` 标志限制了某些文件路径，结果将包含
`partial: true`，说明并非所有子路径都有授予的权限：

```ts
// deno run --allow-read =/foo --deny-read =/foo/bar main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: true }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "denied", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

## 权限状态

权限状态可以是“granted”、“prompt”或“denied”。从 CLI 授予的权限将查询为
`{ state: "granted" }`。尚未授予的权限默认查询为 `{ state: "prompt" }`，而
`{ state: "denied" }` 则保留给明确拒绝的权限。这将在
[请求权限](#request-permissions) 中出现。

## 权限强度

在 [查询权限](#query-permissions) 中第二个查询的结果背后的直观理解是已授予
`/foo` 的读取权限，并且 `/foo/bar` 在 `/foo` 内，因此允许读取 `/foo/bar`。除非
CLI 授予的权限是查询的权限的一部分（因为使用了 `--deny-*` 标志），这一点成立。

我们还可以说 `desc1` 比 `desc2`
_[更强](https://www.w3.org/TR/permissions/#ref-for-permissiondescriptor-stronger-than)_。这意味着对于任何一组
CLI 授予的权限：

1. 如果 `desc1` 查询为 `{ state: "granted", partial: false }`，那么 `desc2`
   也必须如此。
2. 如果 `desc2` 查询为 `{ state: "denied", partial: false }`，那么 `desc1`
   也必须如此。

更多示例：

```ts
const desc1 = { name: "write" } as const;
// 比
const desc2 = { name: "write", path: "/foo" } as const;

const desc3 = { name: "net", host: "127.0.0.1" } as const;
// 比
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;
```

## 请求权限

通过 CLI 提示向用户请求未授予的权限。

```ts
// deno run main.ts

const desc1 = { name: "read", path: "/foo" } as const;
const status1 = await Deno.permissions.request(desc1);
// ⚠️ Deno 请求读取 "/foo" 的权限。授予？[y/n（y = 允许，n = 拒绝）] y
console.log(status1);
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/bar" } as const;
const status2 = await Deno.permissions.request(desc2);
// ⚠️ Deno 请求读取 "/bar" 的权限。授予？[y/n（y = 允许，n = 拒绝）] n
consolelog(status2);
// PermissionStatus { state: "denied", partial: false }
```

如果当前的权限状态为“prompt”，则将在用户的终端上出现提示，询问他们是否要授予请求。对于
`desc1` 的请求已经被授予，因此其新状态将被返回，执行将继续，就好像在 CLI
上指定了 `--allow-read=/foo` 一样。对于 `desc2` 的请求被拒绝，因此其权限

状态从“prompt”降级为“denied”。

如果当前的权限状态已经是“granted”或“denied”，请求将像查询一样工作，并返回当前的状态。这可以阻止对已经授予的权限和先前拒绝的请求发出提示。

## 撤销权限

将权限从“granted”降级为“prompt”。

```ts
// deno run --allow-read =/foo main.ts

const desc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
```

当尝试撤销与 CLI 授予的权限_部分_的权限时会发生什么？

```ts
// deno run --allow-read =/foo main.ts

const desc = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
const cliDesc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(cliDesc));
// PermissionStatus { state: "prompt", partial: false }
```

意味着已经被撤销的权限是 CLI 授予的权限。

要理解这种行为，可以想象 Deno 存储一组_明确授予的权限描述符_的内部集合。在 CLI
上指定 `--allow-read=/foo,/bar` 会将该集合初始化为：

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
];
```

授予对 `{ name: "write", path: "/foo" }` 的运行时请求会更新该集合：

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
  { name: "write", path: "/foo" },
];
```

Deno 的权限撤销算法通过删除与参数权限描述符_强于_的每个元素来工作。

Deno
不允许“分割”的权限状态，其中一些强权限被授予，其中包括被它隐含的弱权限的排除。随着更多用例和“denied”状态的引入，这样的系统将变得越来越复杂和不可预测。这是安全性的粒度和可预测性的有计划的权衡。
