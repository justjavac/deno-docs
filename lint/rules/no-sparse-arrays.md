---
tags: []
---

禁止使用稀疏数组。

稀疏数组是指包含 _空槽_ 的数组，这些空槽可能会被处理为 `undefined`
值或被数组方法跳过，这可能导致意外的行为：

```typescript
[1, , 2].join(); // => '1,,2'
[1, undefined, 2].join(); // => '1,,2'

[1, , 2].flatMap((item) => item); // => [1, 2]
[1, undefined, 2].flatMap((item) => item); // => [1, undefined, 2]
```

**无效：**

```typescript
const items = ["foo", , "bar"];
```

**有效：**

```typescript
const items = ["foo", "bar"];
```
