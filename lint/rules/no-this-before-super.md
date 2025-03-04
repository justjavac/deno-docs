---
tags: [recommended]
---

禁止在构造函数中调用 `super()` 之前使用 `this` 或 `super`。

在派生类的构造函数中，在调用 `super()` 之前访问 `this` 或 `super` 会导致
[`ReferenceError`]。为了防止这种情况，该 lint 规则会检查在构造函数中调用
`super()` 之前是否存在对 `this` 或 `super` 的访问。

[`ReferenceError`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError

**无效示例：**

```typescript
class A extends B {
  constructor() {
    this.foo = 0;
    super();
  }
}

class C extends D {
  constructor() {
    super.foo();
    super();
  }
}
```

**有效示例：**

```typescript
class A extends B {
  constructor() {
    super();
    this.foo = 0;
  }
}

class C extends D {
  constructor() {
    super();
    super.foo();
  }
}

class E {
  constructor() {
    this.foo = 0;
  }
}
```
