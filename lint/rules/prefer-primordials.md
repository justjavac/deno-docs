---
tags: []
---

建议使用来自 `primordials` 的冻结内置对象，而不是默认的全局对象。

此 lint 规则专为 Deno 的内部代码设计。普通用户无需为其代码运行此规则。

Primordials 是运行时中所有内置对象的冻结集合，我们应在 Deno
内部使用它们以避免原型污染的风险。此规则检测直接使用全局内置对象的情况，并建议将其替换为
`primordials` 对象中的相应对象。

一个示例是：

```javascript
const arr = getSomeArrayOfNumbers();
const evens = arr.filter((val) => val % 2 === 0);
```

此示例的第二行应为：

```javascript
const evens = primordials.ArrayPrototypeFilter(arr, (val) => val % 2 === 0);
```

**无效：**

```javascript
const arr = new Array();

const s = JSON.stringify({});

const i = parseInt("42");

const { ownKeys } = Reflect;
```

**有效：**

```javascript
const { Array } = primordials;
const arr = new Array();

const { JSONStringify } = primordials;
const s = JSONStringify({});

const { NumberParseInt } = primordials;
const i = NumberParseInt("42");

const { ReflectOwnKeys } = primordials;
```
