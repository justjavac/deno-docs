# 开始一个新项目

使用 Deno
开始一个新项目一直非常简单：您只需要一个单个文件就可以开始。无需任何配置文件、依赖清单或构建脚本。

来自其他生态系统的用户通常不习惯这种简单性，他们经常寻找一个工具来生成一个基本的项目结构，以帮助他们走上正确的道路。`deno init`
子命令生成一个基本的 Deno 项目。

```sh
$ deno init
✅ 项目已初始化
运行以下命令开始

  // 运行程序
  deno run main.ts

  // 运行程序并监视文件更改
  deno task dev

  // 运行测试
  deno test

  // 运行基准测试
  deno bench

$ deno run main.ts
添加 2 + 3 = 5

$ deno test
检查文件:///dev/main_test.ts
从 main_test.ts 运行 1 个测试
addTest ... ok (6ms)

ok | 1 通过 | 0 失败 (29ms)
```

此子命令将创建两个文件（`main.ts` 和 `main_test.ts`）。这些文件提供了如何编写
Deno 程序以及如何为其编写测试的基本示例。`main.ts` 文件导出一个 `add`
函数，用于将两个数字相加，而 `main_test.ts` 文件包含了对该函数的测试。

您还可以在 `deno init` 中指定一个参数，以在特定目录中初始化一个项目：

```sh
$ deno init my_deno_project
✅ 项目已初始化

运行以下命令开始

  进入 my_deno_project 目录

  // 运行程序
  deno run main.ts

  // 运行程序并监视文件更改
  deno task dev

  // 运行测试
  deno test

  // 运行基准测试
  deno bench
```
