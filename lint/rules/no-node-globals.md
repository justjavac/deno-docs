---
tags: [recommended]
---

禁止使用 NodeJS 全局对象。

NodeJS 暴露了一组与 deno（以及
web）不同的全局对象，因此代码不应假设它们可用。相反，根据需要从定义它们的模块中导入这些对象。

**无效示例：**

```typescript
// foo.ts
const buf = Buffer.from("foo", "utf-8"); // Buffer 在 deno 中不是全局对象
```

**有效示例：**

```typescript
// foo.ts
import { Buffer } from "node:buffer";

const foo = Buffer.from("foo", "utf-8");
```
