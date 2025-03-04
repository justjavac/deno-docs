---
tags: [recommended]
---

禁止像函数一样调用内置的全局对象。

以下内置对象不应像函数一样被调用，即使它们看起来像构造函数：

- `Math`
- `JSON`
- `Reflect`
- `Atomics`

像函数一样调用这些对象会导致运行时错误。此规则静态地防止了这种错误的使用方式。

**无效：**

```typescript
const math = Math();
const newMath = new Math();

const json = JSON();
const newJSON = new JSON();

const reflect = Reflect();
const newReflect = new Reflect();

const atomics = Atomics();
const newAtomics = new Atomics();
```

**有效：**

```typescript
const area = (radius: number): number => Math.PI * radius * radius;

const parsed = JSON.parse("{ foo: 42 }");

const x = Reflect.get({ x: 1, y: 2 }, "x");

const first = Atomics.load(foo, 0);
```
