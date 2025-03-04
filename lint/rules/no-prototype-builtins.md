---
tags: [recommended]
---

禁止直接使用 `Object.prototype` 内置方法。

如果对象是通过 `Object.create(null)`
创建的，它们没有指定的原型。当你假设对象具有 `Object.prototype`
的属性并尝试调用以下方法时，这可能会导致运行时错误：

- `hasOwnProperty`
- `isPrototypeOf`
- `propertyIsEnumerable`

相反，始终鼓励从 `Object.prototype` 显式调用这些方法。

**无效：**

```typescript
const a = foo.hasOwnProperty("bar");
const b = foo.isPrototypeOf("bar");
const c = foo.propertyIsEnumerable("bar");
```

**有效：**

```typescript
const a = Object.prototype.hasOwnProperty.call(foo, "bar");
const b = Object.prototype.isPrototypeOf.call(foo, "bar");
const c = Object.prototype.propertyIsEnumerable.call(foo, "bar");
```
