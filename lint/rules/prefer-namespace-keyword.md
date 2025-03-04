---
tags: [recommended]
---

建议在声明 TypeScript 模块时使用 `namespace` 关键字而非 `module` 关键字。

TypeScript 支持使用 `module` 关键字来组织代码，但这种表述可能会与 ECMAScript
的模块概念产生混淆。自 TypeScript v1.5 起，它为我们提供了替代关键字
`namespace`，鼓励我们在编写 TypeScript 时始终使用 `namespace`。更多详情请参阅
[TypeScript v1.5 发布说明](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-5.html#namespace-keyword)。

**无效示例：**

```typescript
module modA {}

declare module modB {}
```

**有效示例：**

```typescript
namespace modA {}

// "ambient modules" 是允许的
// https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules
declare module "modB";
declare module "modC" {}
```
