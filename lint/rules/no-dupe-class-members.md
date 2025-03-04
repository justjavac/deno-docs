---
tags: [recommended]
---

禁止在类中多次使用相同的成员函数名称。

在类中两次声明相同名称的函数会导致之前的声明被覆盖，从而引发意外行为。

**无效示例：**

```typescript
class Foo {
  bar() {}
  bar() {}
}
```

**有效示例：**

```typescript
class Foo {
  bar() {}
  fizz() {}
}
```
