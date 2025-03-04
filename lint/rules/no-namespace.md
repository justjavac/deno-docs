---
tags: [recommended]
---

禁止在 TypeScript 代码中使用 `namespace` 和 `module` 关键字。

`namespace` 和 `module` 都被认为是过时的关键字来组织代码。相反，通常更推荐使用
ES2015 模块语法（例如 `import`/`export`）。

然而，此规则仍然允许在以下两种情况下使用这些关键字：

- 它们与 `declare` 关键字一起用于定义 ["ambient" 命名空间]
- 它们写在 TypeScript 的类型定义文件中：`.d.ts`

["ambient" 命名空间]: https://www.typescriptlang.org/docs/handbook/namespaces.html#ambient-namespaces

**无效：**

```typescript
// foo.ts
module mod {}
namespace ns {}
```

```dts
// bar.d.ts
// 在 `.d.ts` 中允许使用 `module` 和 `namespace` 关键字
```

**有效：**

```typescript
// foo.ts
declare global {}
declare module mod1 {}
declare module "mod2" {}
declare namespace ns {}
```

```dts
// bar.d.ts
module mod1 {}
namespace ns1 {}
declare global {}
declare module mod2 {}
declare module "mod3" {}
declare namespace ns2 {}
```
