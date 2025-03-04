---
title: "deno check"
oldUrl: /runtime/manual/tools/check/
command: check
---

## 示例

不执行代码，仅进行类型检查。

```ts title="example.ts"
const x: string = 1 + 1n;
```

```bash
deno check example.ts
```
