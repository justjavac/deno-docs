---
tags: []
---

禁止使用 `console` 全局对象。

通常情况下，开发者在调试后会不小心提交 `console.log`/`console.error`
语句。此外，在代码中使用这些语句可能会将敏感信息泄露到输出中，或者用不必要的信息污染控制台。此规则通过禁止使用
`console` 来帮助保持代码的整洁和安全。

此规则在几乎从不希望输出到控制台的库中尤其有用。

**无效示例：**

```typescript
console.log("调试信息");
console.error("调试信息");
console.debug(obj);

if (debug) console.log("调试中");

function log() {
  console.log("日志");
}
```

**有效示例：**

建议通过 `deno-lint-ignore` 注释显式启用
`console`，以便在确实需要使用它的地方进行调用。

```typescript
function logWarning(message: string) {
  // deno-lint-ignore no-console
  console.warn(message);
}
```
