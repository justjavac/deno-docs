---
tags: [recommended]
---

禁止使用 `window` 对象。

在 Deno 中，`window` 全局变量不再可用。Deno 没有 `window`，并且
`typeof window === "undefined"` 通常用于判断代码是否在浏览器中运行。

**无效示例：**

```typescript
const a = await window.fetch("https://deno.land");

const b = window.Deno.metrics();
console.log(window);

window.addEventListener("load", () => {
  console.log("Loaded.");
});
```

**有效示例：**

```typescript
const a1 = await fetch("https://deno.land");
const a2 = await globalThis.fetch("https://deno.land");
const a3 = await self.fetch("https://deno.land");

const b1 = Deno.metrics();
const b2 = globalThis.Deno.metrics();
const b3 = self.Deno.metrics();
console.log(globalThis);

addEventListener("load", () => {
  console.log("Loaded.");
});
```
