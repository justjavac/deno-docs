# 通过 Hashbang 使脚本可执行

## 概念

- [Deno.env] 提供了环境变量。
- [env] 在修改后的环境中运行程序。

## 概述

使 Deno 脚本可执行在创建小工具时非常有用。

注意：Hashbang 在 Windows 上不起作用。

## 示例

在此程序中，我们授予上下文权限以访问环境变量并打印 Deno 安装路径。

```ts, ignore
#!/usr/bin/env -S deno run --allow-env

/**
 *  hashbang.ts
 */

const path = Deno.env.get("DENO_INSTALL");

console.log("Deno 安装路径:", path);
```

### 权限

您可能需要授予脚本执行权限。

#### Unix

```shell
chmod +x hashbang.ts
```

### 执行

通过像调用其他命令一样调用脚本来启动它：

```shell
./hashbang.ts
```

## 详细信息

- Hashbang 必须放在第一行。

- `-S` 将命令拆分为参数。

- 以 `.ts` 结尾的文件名，脚本将被解释为 TypeScript。

## 在没有扩展名的文件中使用 Hashbang

您可能希望不为脚本的文件名使用扩展名。在这种情况下，您可以使用 `--ext`
标志来提供一个：

```shell, ignore
$ cat my_script
#!/usr/bin/env -S deno run --allow-env --ext=js
console.log("Hello!");
$ ./my_script
Hello!
```

[Deno.env]: https://deno.land/api?s=Deno.env
[env]: https://www.man7.org/linux/man-pages/man1/env.1.html
