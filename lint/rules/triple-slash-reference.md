---
tags: []
---

禁止使用某些三斜杠指令，推荐使用 ES6 风格的 import 声明。

TypeScript 的 `///`
三斜杠引用是一种指示文件中可以使用另一个模块的类型的方式。通常不推荐使用三斜杠引用类型指令，而是推荐使用
ECMAScript 模块导入。此规则报告
`/// <reference path="..." />`、`/// <reference types="..." />` 或
`/// <reference lib="..." />` 指令的使用。

**无效：**

```typescript
/// <reference types="foo" />
import * as foo from "foo";
```

**有效：**

```typescript
import * as foo from "foo";
```
