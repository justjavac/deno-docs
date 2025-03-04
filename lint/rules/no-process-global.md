---
tags: [recommended]
---

禁止使用 NodeJS 的 `process` 全局变量。

NodeJS 和 Deno 暴露了 `process`
全局变量，但它们很难被工具静态分析，因此代码不应假设它们可用。相反，应使用
`import process from "node:process"`。

**无效示例：**

```typescript
// foo.ts
const foo = process.env.FOO;
```

**有效示例：**

```typescript
// foo.ts
import process from "node:process";

const foo = process.env.FOO;
```
