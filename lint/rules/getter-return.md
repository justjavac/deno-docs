---
tags: [recommended]
---

要求所有属性 getter 函数必须返回一个值。

Getter 函数用于返回属性的值。如果函数没有返回值，则违反了此约定。

**无效示例：**

```typescript
let foo = {
  get bar() {},
};

class Person {
  get name() {}
}
```

**有效示例：**

```typescript
let foo = {
  get bar() {
    return true;
  },
};

class Person {
  get name() {
    return "alice";
  }
}
```
