---
tags: [recommended]
---

强制要求在模块说明符中明确指定路径引用。

非明确的说明符是模糊的，并且需要在每次运行时探测正确的文件路径，这会带来性能开销。

注意：此 lint 规则仅在启用 `--unstable-sloppy-imports` 时生效。

### 无效示例：

```typescript
import { add } from "./math/add";
import { ConsoleLogger } from "./loggers";
```

### 有效示例：

```typescript
import { add } from "./math/add.ts";
import { ConsoleLogger } from "./loggers/index.ts";
```
