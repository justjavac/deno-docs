---
title: "deno publish"
oldUrl: /runtime/manual/tools/publish/
command: publish
---

## 包要求

你的包必须在 `deno.json` 或 `jsr.json` 文件中包含 `name`、`version` 和 `exports`
字段。

- `name` 字段必须唯一，并遵循 `@<scope_name>/<package_name>` 的命名规范。
- `version` 字段必须是一个有效的 semver 版本。
- `exports` 字段必须指向包的主入口点。

示例：

```json title="deno.json"
{
  "name": "@scope_name/package_name",
  "version": "1.0.0",
  "exports": "./main.ts"
}
```

在发布你的包之前，你必须通过访问 [JSR - 发布一个包](https://jsr.io/new)
在注册表中创建它。

## 示例

发布当前工作区

```bash
deno publish
```

使用特定令牌发布当前工作区，绕过交互式身份验证

```bash
deno publish --token c00921b1-0d4f-4d18-b8c8-ac98227f9275
```

发布并检查远程模块中的错误

```bash
deno publish --check=all
```

执行试运行以模拟发布

```bash
deno publish --dry-run
```

使用特定配置文件中的设置进行发布

```bash
deno publish --config custom-config.json
```
