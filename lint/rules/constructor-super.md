---
tags: [recommended]
---

验证构造函数和 `super()` 调用的正确使用。

派生类的定义构造函数（例如 `class A extends B`）必须始终调用
`super()`。继承非构造函数的类（例如 `class A extends null`）不能有构造函数。

**无效示例：**

```typescript
class A {}
class Z {
  constructor() {}
}

class B extends Z {
  constructor() {} // 缺少 super() 调用
}
class C {
  constructor() {
    super(); // 语法错误
  }
}
class D extends null {
  constructor() {} // 非法构造函数
}
class E extends null {
  constructor() { // 非法构造函数
    super();
  }
}
```

**有效示例：**

```typescript
class A {}
class B extends A {}
class C extends A {
  constructor() {
    super();
  }
}
class D extends null {}
```
