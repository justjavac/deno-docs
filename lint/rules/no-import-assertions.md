---
tags: [recommended]
---

禁止在导入属性中使用 `assert` 关键字。

ES 导入属性（之前称为导入断言）已更改为使用 `with` 关键字。仍支持使用 `assert`
的旧语法，但已弃用。

**无效：**

```typescript
import obj from "./obj.json" assert { type: "json" };
import("./obj2.json", { assert: { type: "json" } });
```

**有效：**

```typescript
import obj from "./obj.json" with { type: "json" };
import("./obj2.json", { with: { type: "json" } });
```
