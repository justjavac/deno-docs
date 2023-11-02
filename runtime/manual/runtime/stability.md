# 稳定性

截至 Deno 1.0.0 版本，`Deno` 命名空间的 API 已经稳定。这意味着我们将努力确保在
1.0.0 版本之后仍然能够运行在未来版本中。

然而，并不是所有 Deno
的功能都已经准备好用于生产。尚未准备好的功能，因为它们仍处于草案阶段，被锁定在
`--unstable` 命令行标志之后。

```shell
deno run --unstable mod_which_uses_unstable_stuff.ts
```

传递此标志会执行以下操作：

- 它在运行时启用不稳定的 API 的使用。
- 它将
  [`lib.deno.unstable.d.ts`](https://doc.deno.land/https://raw.githubusercontent.com/denoland/deno/main/cli/tsc/dts/lib.deno.unstable.d.ts)
  文件添加到用于类型检查的 TypeScript 定义列表中。这包括 `deno types` 的输出。

您应该知道，许多不稳定的 API **尚未经过安全性审查**，很可能在将来会发生
**破坏性的 API 更改**，并且 **不适用于生产**。

## 标准模块

Deno 的标准模块 (https://deno.land/std)
尚未稳定。我们目前以不同的版本号管理标准模块，以反映这一点。请注意，与 `Deno`
命名空间不同，标准模块的使用不需要 `--unstable`
标志（除非标准模块本身使用了不稳定的 Deno 功能）。
