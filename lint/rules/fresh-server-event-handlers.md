---
tags: [fresh]
---

禁止在 fresh 服务器组件中使用事件处理程序。

在 fresh 应用程序的 `routes/`
文件夹中的组件仅在服务器上渲染。它们不会在客户端渲染，因此设置事件处理程序将不会产生任何效果。

请注意，此规则仅适用于 `routes/` 文件夹中的服务器组件，不适用于 fresh islands
或任何其他组件。

**无效：**

```jsx
<button onClick={() => {}} />
<button onclick={() => {}} />
<my-custom-element foo={() => {}} />
```

**有效：**

```jsx
<button />
<my-custom-element />
```
