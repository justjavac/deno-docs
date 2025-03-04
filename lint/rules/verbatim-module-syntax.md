---
tags: [jsr]
---

强制将类型导入声明为类型导入。

此规则确保在启用 `verbatimModuleSyntax` TypeScript
编译器选项时代码能够正常工作。这对于分发 TypeScript
代码的库非常有用，以便在更多场景中工作。

**无效示例：**

```typescript
import { Person } from "./person.ts";

const person: Person = {
  name: "David",
};
console.log(person);
```

```typescript
import { output, Person } from "./person.ts";

const person: Person = {
  name: "David",
};
output(person);
```

**有效示例：**

```typescript
import type { Person } from "./person.ts";

const person: Person = {
  name: "David",
};
console.log(person);
```

```typescript
import { output, type Person } from "./person.ts";

const person: Person = {
  name: "David",
};
output(person);
```
