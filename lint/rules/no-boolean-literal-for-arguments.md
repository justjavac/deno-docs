---
tags: []
---

要求所有使用任意数量的 `boolean` 字面量作为参数的函数，使用自解释的常量来代替。

定义可以接受 `boolean` 作为参数的函数是很常见的。然而，将 `boolean`
字面量作为参数传递可能会导致在函数内部缺乏关于参数作用的上下文。

对于上述问题的一个简单修复方法是使用自解释的常量，这些常量最终将作为“命名的布尔值”使用，从而更好地理解函数调用中参数的含义。

**无效示例：**

```typescript
function redraw(allViews: boolean, inline: boolean) {
  // redraw 逻辑。
}
redraw(true, true);

function executeCommand(recursive: boolean, executionMode: EXECUTION_MODES) {
  // executeCommand 逻辑。
}
executeCommand(true, EXECUTION_MODES.ONE);

function enableLogs(enable: boolean) {
  // enabledLogs 逻辑。
}
enableLogs(true);
```

**有效示例：**

```typescript
function redraw(allViews: boolean, inline: boolean) {
  // redraw 逻辑。
}
const ALL_VIEWS = true, INLINE = true;
redraw(ALL_VIEWS, INLINE);

function executeCommand(recursive: boolean, executionMode: EXECUTION_MODES) {
  // executeCommand 逻辑。
}
const RECURSIVE = true;
executeCommand(RECURSIVE, EXECUTION_MODES.ONE);

function enableLogs(enable: boolean) {
  // enabledLogs 逻辑。
}
const ENABLE = true;
enableLogs(ENABLE);
```
