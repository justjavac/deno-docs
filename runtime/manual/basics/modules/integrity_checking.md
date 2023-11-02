# 完整性检查和锁定文件

## 介绍

假设您的模块依赖于远程模块
`https://some.url/a.ts`。当您首次编译您的模块时，`a.ts`
将被检索、编译和缓存。它将保持这种状态，直到您在新的机器上运行您的模块（例如在生产环境中）或重新加载缓存（例如通过
`deno cache --reload`）。但是，如果远程 URL `https://some.url/a.ts`
中的内容发生了变化，这可能导致您的生产模块与您的本地模块的依赖代码不同。Deno
避免这种情况的解决方案是使用完整性检查和锁定文件。

## 缓存和锁定文件

Deno 可以使用一个小的 JSON
文件来存储和检查模块的子资源完整性。要选择使用锁定文件，可以选择以下两种方式：

1. 在当前目录或父目录中创建一个 `deno.json` 文件，这将自动创建一个增量锁定文件
   `deno.lock`。
2. 使用 `--lock=deno.lock`
   以启用并指定锁定文件检查。要更新或创建锁定文件，请使用
   `--lock=deno.lock --lock-write`。`--lock=deno.lock` 告诉 Deno
   要使用的锁定文件，而 `--lock-write`
   用于将依赖哈希输出到锁定文件（`--lock-write` 必须与 `--lock` 结合使用）。

`deno.lock` 可能如下所示，存储文件的哈希值与依赖关系：

```json
{
  "https://deno.land/std@$STD_VERSION/textproto/mod.ts": "3118d7a42c03c242c5a49c2ad91c8396110e14acca1324e7aaefd31a999b71a4",
  "https://deno.land/std@$STD_VERSION/io/util.ts": "ae133d310a0fdcf298cea7bc09a599c49acb616d34e148e263bcb02976f80dee",
  "https://deno.land/std@$STD_VERSION/async/delay.ts": "35957d585a6e3dd87706858fb1d6b551cb278271b03f52c5a2cb70e65e00c26a",
   ...
}
```

### 自动生成的锁定文件

如上所述，当解析 Deno 配置文件（例如
`deno.json`）时，将自动生成增量锁定文件。默认情况下，此锁定文件的路径将是
`deno.lock`。您可以通过更新您的 `deno.json` 来指定此路径：

```jsonc
{
  "lock": "./lock.file"
}
```

或者通过指定以下方式来禁用自动创建和验证锁定文件：

```jsonc
{
  "lock": false
}
```

### 使用 `--lock` 和 `--lock-write` 标志

典型的工作流程如下：

**src/deps.ts**

```ts, ignore
// 在 "src/deps.ts" 中添加一个新的依赖，用于其他地方使用。
export { xyz } from "https://unpkg.com/xyz-lib@v0.9.0/lib.ts";
```

然后：

```shell
创建/更新锁定文件 "deno.lock"。
deno cache --lock=deno.lock --lock-write src/deps.ts

# 在提交到源代码控制时包含它。
git add -u deno.lock
git commit -m "feat: Add support for xyz using xyz-lib"
git push
```

另一台机器上的合作者 - 在新克隆的项目树中：

```shell
下载项目的依赖项到机器的缓存中，检查每个资源的完整性。
deno cache --reload --lock=deno.lock src/deps.ts

# 完成！您可以安全地继续。
deno test --allow-read src
```

## 运行时验证

与上述缓存类似，您还可以在使用 `deno run`
子命令时使用锁定文件，验证运行期间已锁定模块的完整性。请记住，这仅对先前添加到锁定文件的依赖关系进行验证。

您还可以进一步使用 `--cached-only` 标志，要求远程依赖已经被缓存。

```shell
deno run --lock=deno.lock --cached-only mod.ts
```

如果 mod.ts 的依赖树中有任何尚未缓存的依赖项，将会失败。
