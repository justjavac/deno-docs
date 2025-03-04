---
title: "deno test"
oldUrl: /runtime/manual/tools/test/
command: test
---

## 附加信息

它可以在监视模式下执行（`--watch`），支持并行执行（`--parallel`），并且可以配置为以随机顺序运行测试（`--shuffle`）。此外，还内置了对代码覆盖率（`--coverage`）和内存泄漏检测（`--trace-leaks`）的支持。

## 示例

运行测试

```bash
deno test
```

运行特定文件中的测试

```bash
deno test src/fetch_test.ts src/signal_test.ts
```

运行匹配 glob 模式的测试

```bash
deno test src/*.test.ts
```

运行测试并跳过类型检查

```bash
deno test --no-check
```

运行测试，并在文件更改时重新运行

```bash
deno test --watch
```
