---
tags: [recommended]
---

禁止未使用的标签。

声明但从未使用的标签很可能是开发者的错误。如果该标签旨在被使用，那么编写代码以确保它被使用。否则，请移除该标签。

**无效示例：**

```typescript
LABEL1:
while (true) {
  console.log(42);
}

LABEL2:
for (let i = 0; i < 5; i++) {
  console.log(42);
}

LABEL3:
for (const x of xs) {
  console.log(x);
}
```

**有效示例：**

```typescript
LABEL1:
while (true) {
  console.log(42);
  break LABEL1;
}

LABEL2:
for (let i = 0; i < 5; i++) {
  console.log(42);
  continue LABEL2;
}

for (const x of xs) {
  console.log(x);
}
```
