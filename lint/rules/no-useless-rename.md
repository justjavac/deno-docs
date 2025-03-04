---
tags: []
---

禁止无用的重命名操作，其中原始名称和新名称完全相同。这通常是重构过程中的遗留物，可以安全地移除。

**无效示例：**

```ts
import { foo as foo } from "foo";
const { foo: foo } = obj;
export { foo as foo };
```

**有效示例：**

```ts
import { foo as bar } from "foo";
const { foo: bar } = obj;
export { foo as bar };
```
