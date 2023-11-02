# 测试清洁器

测试运行器提供了多个清洁器，以确保测试行为合理且符合预期。

## 资源清洁器

Deno 中的某些操作会在资源表中创建资源
([在此了解更多](../../references/contributing/architecture.md))。

在使用完这些资源后，应该关闭它们。

对于每个测试定义，测试运行器会检查在该测试中创建的所有资源是否已关闭。这是为了防止资源泄漏。这对所有测试默认启用，但可以通过在测试定义中将
`sanitizeResources` 布尔值设置为 false 来禁用。

```ts
Deno.test({
  name: "资源泄漏测试",
  async fn() {
    await Deno.open("hello.txt");
  },
  sanitizeResources: false,
});
```

## 操作清洁器

对于异步操作，如与文件系统交互，情况也是如此。测试运行器会检查测试中启动的每个操作是否在测试结束之前完成。这对所有测试默认启用，但可以通过在测试定义中将
`sanitizeOps` 布尔值设置为 false 来禁用。

```ts
Deno.test({
  name: "操作泄漏测试",
  fn() {
    crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode("a".repeat(100000000)),
    );
  },
  sanitizeOps: false,
});
```

## 退出清洁器

还有退出清洁器，它确保被测试的代码不会调用 `Deno.exit()` 以信号虚假的测试成功。

这对所有测试默认启用，但可以通过在测试定义中将 `sanitizeExit` 布尔值设置为 false
来禁用。

```ts
Deno.test({
  name: "虚假成功",
  fn() {
    Deno.exit(0);
  },
  sanitizeExit: false,
});

// 这个测试永远不会运行，因为进程在 "虚假成功" 测试期间退出
Deno.test({
  name: "失败的测试",
  fn() {
    throw new Error("这个测试失败");
  },
});
```
