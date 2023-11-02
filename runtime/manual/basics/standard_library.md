# 标准库

Deno 提供一组由核心团队审核并保证与 Deno 兼容的标准模块。

标准库可在以下网址获取：https://deno.land/std

## 版本和稳定性

标准库尚不稳定，因此其版本控制方式与 Deno 不同。有关最新版本，请查阅
https://deno.land/std 或 https://deno.land/std/version.ts。标准库在每次 Deno
发布时一同发布。

我们强烈建议始终使用固定版本的标准库进行导入，以避免意外更改。例如，不要链接到代码的默认分支，因为它可能随时更改，可能导致编译错误或意外行为：

```typescript
// 导入最新版本，应避免此做法
import { copy } from "https://deno.land/std/fs/copy.ts";
```

而是使用不变的 std 库版本：

```typescript
// 从 std 的 v$STD_VERSION 版本导入，永不更改
import { copy } from "https://deno.land/std@$STD_VERSION/fs/copy.ts";
```
