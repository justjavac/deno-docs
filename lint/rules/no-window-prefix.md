---
tags: [recommended]
---

禁止通过 `window` 对象使用 Web API。

在大多数情况下，全局变量 `window` 的行为与 `globalThis` 类似。例如，你可以通过
`window.fetch(..)` 调用 `fetch` API，而不是 `fetch(..)` 或
`globalThis.fetch(..)`。然而，在 Web Workers 中，`window` 不可用，但
`self`、`globalThis` 或无前缀都可以正常工作。因此，为了确保 Web Workers
和其他环境之间的兼容性，强烈建议不要通过 `window` 访问全局属性。

某些 API，包括 `window.alert`、`window.location` 和 `window.history`，允许通过
`window` 调用，因为这些 API 在 Workers
中不受支持或具有不同的含义。换句话说，只有当 `window` 完全可以被
`self`、`globalThis` 或无前缀替代时，此 lint 规则才会对 `window`
的使用发出警告。

**无效示例：**

```typescript
const a = await window.fetch("https://deno.land");

const b = window.Deno.metrics();
```

**有效示例：**

```typescript
const a1 = await fetch("https://deno.land");
const a2 = await globalThis.fetch("https://deno.land");
const a3 = await self.fetch("https://deno.land");

const b1 = Deno.metrics();
const b2 = globalThis.Deno.metrics();
const b3 = self.Deno.metrics();

// `alert` 允许通过 `window` 调用，因为它在 Workers 中不受支持
window.alert("🍣");

// `location` 也允许
window.location.host;
```
