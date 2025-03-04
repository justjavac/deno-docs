---
tags: [react, fresh]
---

确保在 React/Preact 组件中正确调用
hooks。它们必须在组件的顶层调用，而不是在条件语句或循环内部。

**无效示例：**

```tsx
// 错误：在条件内部调用
function MyComponent() {
  if (condition) {
    const [count, setCount] = useState(0);
  }
}

// 错误：在 for 循环内部调用
function MyComponent() {
  for (const item of items) {
    const [count, setCount] = useState(0);
  }
}

// 错误：在 while 循环内部调用
function MyComponent() {
  while (condition) {
    const [count, setCount] = useState(0);
  }
}

// 错误：在条件之后调用
function MyComponent() {
  if (condition) {
    // ...
  }

  const [count, setCount] = useState(0);
}
```

**有效示例：**

```tsx
function MyComponent() {
  const [count, setCount] = useState(0);
}
```
