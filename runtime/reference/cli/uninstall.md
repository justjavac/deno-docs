---
title: "deno uninstall"
oldUrl: /runtime/manual/tools/uninstall/
command: uninstall
---

## `deno uninstall [PACKAGES]`

移除 `deno.json` 或 `package.json` 中指定的依赖项：

```shell
$ deno add npm:express
Add npm:express@5.0.0

$ cat deno.json
{
  "imports": {
    "express": "npm:express@5.0.0"
  }
}
```

```shell
$ deno uninstall express
Removed express

$ cat deno.json
{
  "imports": {}
}
```

:::tip

你也可以使用 `deno remove`，它是 `deno uninstall [PACKAGES]` 的别名。

:::

你可以一次性移除多个依赖项：

```shell
$ deno add npm:express jsr:@std/http
Added npm:express@5.0.0
Added jsr:@std/http@1.0.7

$ cat deno.json
{
  "imports": {
    "@std/http": "jsr:@std/http@^1.0.7",
    "express": "npm:express@^5.0.0",
  }
}
```

```shell
$ deno remove express @std/http
Removed express
Removed @std/http

$ cat deno.json
{
  "imports": {}
}
```

:::info

虽然依赖项已从 `deno.json` 和 `package.json`
中移除，但它们仍然会保留在全局缓存中以供将来使用。

:::

如果你的项目包含 `package.json`，`deno uninstall` 也可以处理它：

```shell
$ cat package.json
{
  "dependencies": {
    "express": "^5.0.0"
  }
}

$ deno remove express
Removed express

$ cat package.json
{
  "dependencies": {}
}
```

## `deno uninstall --global [SCRIPT_NAME]`

卸载 `serve`

```bash
deno uninstall --global serve
```

从指定的安装根目录卸载 `serve`

```bash
deno uninstall -g --root /usr/local/bin serve
```
