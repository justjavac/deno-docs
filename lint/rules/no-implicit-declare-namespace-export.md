---
tags: []
---

禁止在 ["ambient" 命名空间] 中使用隐式导出。

TypeScript 会隐式导出 ["ambient" 命名空间] 中的所有成员，除非存在命名导出。

["ambient" 命名空间]: https://www.typescriptlang.org/docs/handbook/namespaces.html#ambient-namespaces

**无效示例:**

```ts
// foo.ts 或 foo.d.ts
declare namespace ns {
  interface ImplicitlyExported {}
  export type Exported = true;
}
```

**有效示例:**

```ts
// foo.ts 或 foo.d.ts
declare namespace ns {
  interface NonExported {}
  export {};
}

declare namespace ns {
  interface Exported {}
  export { Exported };
}

declare namespace ns {
  export interface Exported {}
}
```
