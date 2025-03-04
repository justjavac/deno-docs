---
tags: [recommended]
---

禁止 case 语句的隐式贯穿。

没有 `break` 的 case 语句会执行其主体，然后贯穿到下一个 case 或 default
块并执行该块。虽然有时这是故意的，但很多时候开发者忘记添加 break
语句，原本只希望执行单个 case 语句。此规则强制要求你必须在每个 case
语句的末尾添加 break 语句或显式注释，表明贯穿是故意的。贯穿注释必须包含
`fallthrough`、`falls through` 或 `fall through` 之一。

**无效：**

```typescript
switch (myVar) {
  case 1:
    console.log("1");

  case 2:
    console.log("2");
}
// 如果 myVar = 1，输出 `1` 和 `2`。这是故意的吗？
```

**有效：**

```typescript
switch (myVar) {
  case 1:
    console.log("1");
    break;

  case 2:
    console.log("2");
    break;
}
// 如果 myVar = 1，仅输出 `1`

switch (myVar) {
  case 1:
    console.log("1");
    /* falls through */
  case 2:
    console.log("2");
}
// 如果 myVar = 1，故意输出 `1` 和 `2`
```
