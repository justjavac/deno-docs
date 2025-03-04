---
tags: []
---

禁止使用外部导入。

- 这条 lint 规则的动机是什么？
  - 如果通过 URL 导入外部模块，此规则会发出警告。"deps.ts" 和导入映射是例外。
- 为什么被 lint 的代码被认为是不好的？
  - 导入外部模块虽然可以正常工作，但如果你想升级这些模块，并且它们在项目中的多个地方被导入，将会花费时间和精力。
- 什么时候应该使用它？
  - 为了避免这种情况，你可以使用 "deps.ts 约定" 或
    [导入映射](https://docs.denohub.com/runtime/manual/basics/import_maps)，在其中导入所有外部模块，然后重新导出它们或为它们分配别名。
  - 如果你想遵循 "deps.ts 约定" 或使用导入映射。

**无效：**

```typescript
import { assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";
```

**有效：**

```typescript
import { assertEquals } from "./deps.ts";
```

```typescript
// deps.ts

export {
  assert,
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.126.0/testing/asserts.ts";
```

你可以在这里参考此约定的解释
https://docs.denohub.com/runtime/manual/basics/modules/#it-seems-unwieldy-to-import-urls-everywhere
