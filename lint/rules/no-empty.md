---
tags: [recommended]
---

禁止使用空的块语句。

空的块语句是合法的，但通常表示遗漏了某些内容，并且可能使代码的可读性降低。此规则忽略仅包含注释的块语句。此规则还忽略空的构造函数和函数体（包括箭头函数）。

**无效示例：**

```typescript
if (foo) {}

while (foo) {}

switch (foo) {}

try {
  doSomething();
} catch (e) {
} finally {
}
```

**有效示例：**

```typescript
if (foo) {
  // empty
}

while (foo) {
  /* empty */
}

try {
  doSomething();
} catch (e) {
  // continue regardless of error
}

try {
  doSomething();
} finally {
  /* continue regardless of error */
}
```
