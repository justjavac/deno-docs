---
title: "deno outdated"
command: outdated
---

## 检查过时的依赖项

`outdated` 子命令会检查 `deno.json` 或 `package.json` 文件中列出的 NPM 和 JSR
依赖项的新版本，并显示可以更新的依赖项。完全支持工作区，包括某些成员使用
`package.json` 而其他成员使用 `deno.json` 的工作区。

例如，一个带有 `deno.json` 文件的项目：

```json
{
  "imports": {
    "@std/fmt": "jsr:@std/fmt@^1.0.0",
    "@std/async": "jsr:@std/async@1.0.1",
    "chalk": "npm:chalk@4"
  }
}
```

以及一个锁定文件中 `@std/fmt` 的版本为 `1.0.0`。

```bash
$ deno outdated
┌────────────────┬─────────┬────────┬────────┐
│ Package        │ Current │ Update │ Latest │
├────────────────┼─────────┼────────┼────────┤
│ jsr:@std/fmt   │ 1.0.0   │ 1.0.3  │ 1.0.3  │
├────────────────┼─────────┼────────┼────────┤
│ jsr:@std/async │ 1.0.1   │ 1.0.1  │ 1.0.8  │
├────────────────┼─────────┼────────┼────────┤
│ npm:chalk      │ 4.1.2   │ 4.1.2  │ 5.3.0  │
└────────────────┴─────────┴────────┴────────┘
```

`Update` 列列出了最新的 semver 兼容版本，而 `Latest` 列列出了最新版本。

请注意，`jsr:@std/async` 被列出，即使没有 semver
兼容的版本可以更新。如果您希望仅显示具有新兼容版本的包，可以传递 `--compatible`
标志。

```bash
$ deno outdated --compatible
┌────────────────┬─────────┬────────┬────────┐
│ Package        │ Current │ Update │ Latest │
├────────────────┼─────────┼────────┼────────┤
│ jsr:@std/fmt   │ 1.0.0   │ 1.0.3  │ 1.0.3  │
└────────────────┴─────────┴────────┴────────┘
```

`jsr:@std/fmt` 仍然被列出，因为它可以兼容地更新到 `1.0.3`，但 `jsr:@std/async`
不再显示。

## 更新依赖项

`outdated` 子命令还可以通过 `--update`
标志更新依赖项。默认情况下，它只会将依赖项更新到 semver
兼容的版本（即不会更新到破坏性版本）。

```bash
$ deno outdated --update
Updated 1 dependency:
 - jsr:@std/fmt 1.0.0 -> 1.0.3
```

要更新到最新版本（无论是否 semver 兼容），请传递 `--latest` 标志。

```bash
$ deno outdated --update --latest
Updated 3 dependencies:
 - jsr:@std/async 1.0.1 -> 1.0.8
 - jsr:@std/fmt   1.0.0 -> 1.0.3
 - npm:chalk      4.1.2 -> 5.3.0
```

## 选择包

`outdated` 子命令还支持选择要操作的包。无论是否使用 `--update`
标志，此功能都有效。

```bash
$ deno outdated --update --latest chalk
Updated 1 dependency:
 - npm:chalk 4.1.2 -> 5.3.0
```

可以传递多个选择器，并且还支持通配符 (`*`) 或排除 (`!`)。

例如，要更新所有带有 `@std` 作用域的包，除了 `@std/fmt`：

```bash
$ deno outdated --update --latest "@std/*" "!@std/fmt"
Updated 1 dependency:
 - jsr:@std/async 1.0.1 -> 1.0.8
```

请注意，如果使用通配符，可能需要将参数用引号括起来，以防止 shell 尝试扩展它们。

### 更新到特定版本

除了选择要更新的包外，`--update` 标志还支持通过 `@` 后指定版本来选择新版本。

```bash
❯ deno outdated --update chalk@5.2 @std/async@1.0.6
Updated 2 dependencies:
 - jsr:@std/async 1.0.1 -> 1.0.6
 - npm:chalk      4.1.2 -> 5.2.0
```

## 工作区

在工作区设置中，默认情况下 `outdated` 只会操作当前工作区成员。

例如，给定一个工作区：

```json
{
  "workspace": ["./member-a", "./member-b"]
}
```

从 `./member-a` 目录运行

```bash
deno outdated
```

将仅检查 `./member-a/deno.json` 或 `./member-a/package.json`
中列出的过时依赖项。

要包含所有工作区成员，请传递 `--recursive` 标志（也接受 `-r` 简写）

```bash
deno outdated --recursive
deno outdated --update --latest -r
```
