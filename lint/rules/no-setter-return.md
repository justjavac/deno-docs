---
tags: [recommended]
---

禁止从 setter 中返回值。

Setter 应该用于为属性设置某个值，这意味着从 setter
中返回值是没有意义的。事实上，尽管从 setter
中返回值不会产生错误，但返回值会被忽略且无法使用。这就是为什么通过 linter
进行静态检查来发现这种错误是非常有益的。

请注意，允许不带值的返回；这是一种从函数中提前返回的有用技术。

**无效示例：**

```typescript
const a = {
  set foo(x: number) {
    return "something";
  },
};

class B {
  private set foo(x: number) {
    return "something";
  }
}

const c = {
  set foo(x: boolean) {
    if (x) {
      return 42;
    }
  },
};
```

**有效示例：**

```typescript
// 允许不带值的返回，因为它用于提前返回
const a = {
  set foo(x: number) {
    if (x % 2 == 0) {
      return;
    }
  },
};

// 不是 setter，而是 getter
class B {
  get foo() {
    return 42;
  }
}

// 不是 setter
const c = {
  set(x: number) {
    return "something";
  },
};
```
