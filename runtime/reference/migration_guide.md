---
title: "Deno 1.x 到 2.x 迁移指南"
oldUrl:
  - /runtime/manual/advanced/migrate_deprecations/
  - /runtime/reference/migrate_deprecations/
---

虽然我们在 Deno 1.x 中取得了许多成就，但下一个主要版本的重点是 **大规模** 使用
Deno。这意味着与 Node.js 和 npm JavaScript
基础设施的无缝互操作性，并支持更广泛的项目和开发团队，同时不牺牲开发者喜爱的简单性、安全性和“开箱即用”的特性。

## 与 Node.js 和 npm 的向后兼容性

Deno 2 与 Node.js 和 npm 向后兼容。这不仅允许你在当前的 Node.js 项目中运行
Deno，还可以逐步采用 Deno 的一体化工具链。

例如，你可以在 Node.js 项目中使用 `deno install` 来安装依赖项，运行 `deno fmt`
来格式化代码而无需 Prettier，或使用 `deno lint` 来检查常见问题，而无需使用
ESLint。

Deno 2 理解 `package.json`、`node_modules` 目录，甚至 npm
工作区，允许你以最小的努力迁移现有的 ESM 项目。

为了更好的 Node 兼容性，当存在 package.json 时，npm 包不再默认安装，而是建议运行
`deno install`。要获得 Deno 1.x 的自动安装行为，请在 deno.json 中添加以下内容：

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

[阅读更多关于 `Node.js 支持` 的页面](/runtime/fundamentals/node/)

### 长期支持版本

从 Deno v2.1.0（将于 2024 年 11 月发布）开始，Deno 将提供 LTS（长期支持）渠道。

LTS 版本将支持 6
个月，在此期间会收到错误修复和关键性能修复，然后新版本将被提升为 LTS。

[阅读更多关于 `稳定性和发布` 的页面](/runtime/fundamentals/stability_and_releases/#long-term-support-(lts))

## 管理依赖项

Deno 2 通过以下工具大大改善了 npm 和 JSR 包的依赖管理：

- [`deno install`](/runtime/reference/cli/install/)
- [`deno add`](/runtime/reference/cli/add/)
- [`deno remove`](/runtime/reference/cli/remove/)

你可以期待在使用 `deno.json` 的 Deno 优先项目、使用 `package.json` 的 Node.js
优先项目以及同时使用 `deno.json` 和 `package.json`
的混合项目中获得无缝体验，从而实现轻松的迁移路径。

## Monorepo、工作区和私有注册表支持

Deno 2
是为处理关键任务的开发团队而构建的。这些团队处理复杂的代码库，共享内部代码，通常使用私有注册表。

使用 Deno 2，你的团队可以像使用 Node.js 和 npm 一样利用私有 npm 注册表，使用
`.npmrc` 文件：

```js title=".npmrc"
@mycompany:registry=http://mycompany.com:8111/
mycompany.com:8111/:_authToken=token
```

了解更多关于私有注册表配置的信息，请访问
[`npm 包` 页面](/runtime/fundamentals/node/#private-registries)。

Deno 2 支持工作区，允许你在同一个 monorepo 中混合使用 Deno 优先和 Node
优先的包，使增量迁移变得快速且易于实现。

阅读更多关于 [`工作区和 Monorepo` 的页面](/runtime/fundamentals/workspaces/)。

## 框架支持

随着 Node.js 和 npm 兼容性的改进，Deno 2 支持大量用户喜爱的框架，例如：

- Next.js
- SvelteKit
- Remix
- Nuxt
- TanStack
- Qwik
- 以及更多

大多数现有项目只需进行最小改动或无需改动；只需将 `npm run dev` 替换为
`deno task dev` 即可继续工作。

Deno 将提供有用的错误消息和建议，引导你找到可行的解决方案。

你还可以使用 `deno lint --fix` 自动修复常见的不兼容问题。

---

以下部分概述了 Deno 1.x 和 Deno 2 之间的配置、CLI 和 API 变化。

## 配置变化

- `nodeModulesDir`

使用布尔值配置 `nodeModulesDir` 和 `--node-modules-dir`
选项已被弃用，取而代之的是从多个行为选项中选择。因此，未设置该选项时的默认值已更改。

```diff
- "nodeModulesDir": false | true
+ "nodeModulesDir": "none" | "auto" | "manual"

- 没有 package.json 时的默认值：false（对应 "none"）
+ 没有 package.json 时的默认值："none"

- 有 package.json 时的默认值：true（对应 "auto"）
+ 有 package.json 时的默认值："manual"
```

如果你的项目不包含 `package.json` 文件，默认行为将保持不变。

如果你的项目包含 `package.json` 文件且未指定 `nodeModulesDir`
选项，则必须将其设置为 `auto` 以保持 Deno 1.x 的自动安装行为。Deno 2
中的新默认值是 `manual`，它期望用户手动保持该目录的最新状态。

请参考
[Node 模块目录](https://docs.denohub.com/runtime/fundamentals/configuration/#node-modules-directory)
了解更多信息。

## CLI 变化

- `deno bundle`

`deno bundle` 命令已被移除。我们建议使用 [`esbuild`](https://esbuild.github.io/)
和 [`esbuild-deno-loader`](https://jsr.io/@luca/esbuild-deno-loader)。

```ts
import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

const result = await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["https://deno.land/std@0.185.0/bytes/mod.ts"],
  outfile: "./dist/bytes.esm.js",
  bundle: true,
  format: "esm",
});

esbuild.stop();
```

- `deno cache`

`deno cache` 命令已合并到 `deno install` 命令中，作为 `--entrypoint` 选项。

```diff
- deno cache main.ts
+ deno install --entrypoint main.ts
```

- `deno vendor`

`deno vendor` 命令已被 `deno.json` 中的 `"vendor": true` 配置选项取代。

```json title="deno.json"
{
  "vendor": true
}
```

- `--allow-none`

使用 `--permit-no-files` CLI 标志代替。

```diff
- deno test --allow-none
+ deno test --permit-no-files
```

- `--jobs`

使用
[`DENO_JOBS`](https://docs.denohub.com/runtime/manual/basics/env_variables/#special-environment-variables)
环境变量代替。

```diff
- deno test --jobs=4 --parallel
+ DENO_JOBS=4 deno test --parallel
```

- `--ts`

使用 `--ext=ts` CLI 标志代替。

```diff
- deno run --ts script.ts
+ deno run --ext=ts script.ts
```

```diff
- deno run -T script.ts
+ deno run --ext=ts script.ts
```

- `--trace-ops`

使用 `--trace-leaks` CLI 标志代替。

```diff
- deno test --trace-ops
+ deno test --trace-leaks
```

- `--unstable`

使用细粒度的不稳定标志（`--unstable-*`）或配置选项代替。请参考
[不稳定功能标志](https://docs.denohub.com/runtime/reference/cli/unstable_flags/)
了解更多信息。

```ts
// kv.ts
const kv = await Deno.openKv();

// ...
```

```diff
- deno run --unstable kv.ts
+ deno run --unstable-kv kv.ts
```

或

```diff
{
+ "unstable": ["kv"]
}
```

请参阅
[Deno 1.40 博客文章](https://deno.com/blog/v1.40#changes-to-how-we-handle-unstable-features)
了解更多细节。

## API 变化

- `Deno.Buffer`

使用标准库中的 [`Buffer`](https://jsr.io/@std/io/doc/buffer/~/Buffer) 代替。

```diff
+ import { Buffer } from "jsr:@std/io/buffer";

- const buffer = new Deno.Buffer();
+ const buffer = new Buffer();

  // ...
```

请参阅 [deno#9795][deno#9795] 了解更多细节。

- `Deno.Closer`

使用标准库中的 [`Closer`](https://jsr.io/@std/io/doc/types/~/Closer) 代替。

```diff
+ import type { Closer } from "jsr:@std/io/types";

- function foo(closer: Deno.Closer) {
+ function foo(closer: Closer) {
  // ...  
}
```

请参阅 [deno#9795][deno#9795] 了解更多细节。

- `Deno.close()`

使用资源上的 `.close()` 方法代替。

<a href="#" id="rid">test</a>

```diff
  const conn = await Deno.connect({ port: 80 });

  // ...


- Deno.close(conn.rid);
+ conn.close();
```

```diff
  const file = await Deno.open("/foo/bar.txt");

  // ...

- Deno.close(file.rid);
+ file.close();
```

请参阅 [Deno 1.40 博客文章][Deno 1.40 blog post] 了解更多细节。

- `Deno.Conn.prototype.rid`

使用 [`Deno.Conn`](https://docs.denohub.com/api/deno/~/Deno.Conn) 实例方法代替。

```diff
  const conn = await Deno.connect({ port: 80 });

  const buffer = new Uint8Array(1_024);
- await Deno.read(conn.rid, buffer);
+ await conn.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(conn.rid, data);
+ await conn.write(data);

- await Deno.shutdown(conn.rid);
+ await conn.closeWrite();

- Deno.close(conn.rid);
+ conn.close();
```

请参阅 [Deno 1.40 博客文章][Deno 1.40 blog post] 了解更多细节。

- `Deno.ConnectTlsOptions.certChain`

使用
[`cert`](https://docs.denohub.com/api/deno/~/Deno.TlsCertifiedKeyPem#property_cert)
选项代替。

```diff
const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
using conn = await Deno.connectTls({
  hostname: "192.0.2.1",
  port: 80,
  caCerts: [caCert],
- certChain: Deno.readTextFileSync("./server.crt"),
+ cert: Deno.readTextFileSync("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});
```

请参阅 [deno#22274](https://github.com/denoland/deno/pull/22274) 了解更多细节。

- `Deno.ConnectTlsOptions.certFile`

使用
[`cert`](https://docs.denohub.com/api/deno/~/Deno.TlsCertifiedKeyPem#property_cert)
选项代替。

```diff
const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
using conn = await Deno.connectTls({
  hostname: "192.0.2.1",
  port: 80,
  caCerts: [caCert],
- certFile: "./server.crt",
+ cert: Deno.readTextFileSync("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});
```

请参阅 [deno#22274](https://github.com/denoland/deno/pull/22274) 了解更多细节。

- `Deno.ConnectTlsOptions.privateKey`

使用
[`key`](https://docs.denohub.com/api/deno/~/Deno.TlsCertifiedKeyPem#property_key)
选项代替。

```diff
const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
using conn = await Deno.connectTls({
  hostname: "192.0.2.1",
  port: 80,
  caCerts: [caCert],
  cert: Deno.readTextFileSync("./server.crt"),
- keyFile: "./server.key",
+ key: Deno.readTextFileSync("./server.key"),
});
```

请参阅 [deno#22274](https://github.com/denoland/deno/pull/22274) 了解更多细节。

- `Deno.copy()`

使用标准库中的 [`copy()`](https://jsr.io/@std/io/doc/copy/~/copy) 代替。

```diff
+ import { copy } from "jsr:@std/io/copy";

  using file = await Deno.open("/foo/bar.txt");

- await Deno.copy(file, Deno.stdout);
+ await copy(file, Deno.stdout);
```

请参阅 [deno#9795][deno#9795] 了解更多细节。

- `Deno.customInspect`

使用 `Symbol.for("Deno.customInspect")` 代替。

```diff
class Foo {
- [Deno.customInspect]() {
+ [Symbol.for("Deno.customInspect")] {
  }
}
```

请参阅 [deno#9294](https://github.com/denoland/deno/issues/9294) 了解更多细节。

- `Deno.fdatasync()`

使用
[`Deno.FsFile.prototype.syncData()`](https://docs.denohub.com/api/deno/~/Deno.FsFile.prototype.syncData)
代替。

```diff
  using file = await Deno.open("/foo/bar.txt", { read: true, write: true });

  await file.write(new TextEncoder().encode("Hello, world!"));
- await Deno.fdatasync(file.rid);
+ await file.syncData();
```

- `Deno.fdatasyncSync()`

使用
[`Deno.FsFile.prototype.syncDataSync()`](https://docs.denohub.com/api/deno/~/Deno.FsFile.prototype.syncDataSync)
代替。

```diff
  using file = Deno.openSync("/foo/bar.txt", { read: true, write: true });

  file.writeSync(new TextEncoder().encode("Hello, world!"));
- Deno.fdatasyncSync(file.rid);
+ file.syncDataSync();
```

- `Deno.File`

使用 [`Deno.FsFile`](https://docs.denohub.com/api/deno/~/Deno.FsFile) 代替。

```diff
- function foo(file: Deno.File) {
+ function foo(file: Deno.FsFile) {
  // ...
}
```

请参阅 [deno#13661](https://github.com/denoland/deno/issues/13661)
了解更多细节。

- `Deno.flock()`

使用
[`Deno.FsFile.prototype.lock()`](https://docs.denohub.com/api/deno/~/Deno.FsFile.prototype.lock)
代替。

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.flock(file.rid);
+ await file.lock();
```

请参阅 [deno#22178](https://github.com/denoland/deno/issues/22178)
了解更多细节。

- `Deno.flockSync()`

使用
[`Deno.FsFile.prototype.lockSync()`](https://docs.denohub.com/api/deno/~/Deno.FsFile.prototype.lockSync)
代替。

```diff
  using file = Deno.openSync("/foo/bar.txt");

- Deno.flockSync(file.rid);
+ file.lockSync();
```

请参阅 [deno#22178](https://github.com/denoland/deno/issues/22178)
了解更多细节。

- `Deno.FsFile.prototype.rid`

使用 [`Deno.FsFile`](https://docs.denohub.com/api/deno/~/Deno.FsFile)
实例方法代替。

```diff
  const file = await Deno.open("/foo/bar.txt");

  const buffer = new Uint8Array(1_024);
- await Deno.read(file.rid, buffer);
+ await file.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(file.rid, data);
+ await file.write(data);

- Deno.close(file.rid);
+ file.close();
```

- `Deno.fstatSync()`

使用
[`Deno.FsFile.prototype.statSync()`](https://docs.denohub.com/api/deno/~/Deno.FsFile.prototype.statSync)
代替。

```diff
  using file = Deno.openSync("/foo/bar.txt");

- const fileInfo = Deno.fstatSync(file.rid);
+ const fileInfo = file.statSync();
```

请参阅 [Deno 1.40 博客文章][Deno 1.40 blog post] 了解更多细节。

- `Deno.fstat()`

使用
[`Deno.FsFile.prototype.stat()`](https://docs.denohub.com/api/deno/~/Deno.FsFile.prototype.stat)
代替。

```diff
  using file = await Deno.open("/foo/bar.txt");

- const fileInfo = await Deno.fstat(file.rid);
+ const fileInfo = await file.stat();
```

请参阅 [Deno 1.40 博客文章][Deno 1.40 blog post] 了解更多细节。

- `Deno.FsWatcher.prototype.rid`

使用 [`Deno.FsWatcher`](https://docs.denohub.com/api/deno/~/Deno.FsWatcher)
实例方法代替。

```diff
  using watcher = Deno.watchFs("/dir");

  // ...

- Deno.close(watcher.rid);
+ watcher.close();
```

请参阅 [Deno 1.40 博客文章][Deno 1.40 blog post] 了解更多细节。

- `Deno.fsync()`

使用 [`Den
