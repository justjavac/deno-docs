---
tags: []
---

要求所有模块导出都具有完全类型化的声明。

拥有完全类型化的函数参数和返回值可以明确定义模块的输入和输出（称为模块边界）。这将使模块的任何用户非常清楚地了解如何以类型安全的方式提供输入和处理输出。

**无效示例：**

```typescript
// 缺少返回类型（例如 void）
export function printDoc(doc: string, doubleSided: boolean) {
  return;
}

// 缺少参数类型（例如 `arg` 是 string 类型）
export const arrowFn = (arg): string => `hello ${arg}`;

// 缺少返回类型（例如 boolean）
export function isValid() {
  return true;
}
```

**有效示例：**

```typescript
// 类型化的输入参数和返回值
export function printDoc(doc: string, doubleSided: boolean): void {
  return;
}

// 输入为 string 类型，返回值为 string 类型
export const arrowFn = (arg: string): string => `hello ${arg}`;

// 虽然缺少返回类型，但由于未导出，因此有效
function isValid() {
  return true;
}
```
