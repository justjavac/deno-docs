---
tags: [fresh]
---

检查命名正确的 fresh middleware 导出。

`routes/` 文件夹中的文件可以导出在渲染之前运行的中间件。它们应作为名为 `handler`
的命名导出可用。此规则检查导出是否错误地命名为 `handlers` 而不是 `handler`。

**无效:**

```js
export const handlers = {
  GET() {},
  POST() {},
};
export function handlers() {}
export async function handlers() {}
```

**有效:**

```jsx
export const handler = {
  GET() {},
  POST() {},
};
export function handler() {}
export async function handler() {}
```
