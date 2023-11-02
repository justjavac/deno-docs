# repl

# 读取-求值-打印-循环

`deno repl`
启动一个读取-求值-打印-循环，允许您以全局上下文的方式交互地构建程序状态，特别适用于快速原型设计和检查代码片段。

> ⚠️ Deno REPL 支持 JavaScript 和 TypeScript，但不对 TypeScript
> 代码进行类型检查，而是在幕后将其转译为 JavaScript。

> ⚠️ 为了更容易复制粘贴代码示例，Deno REPL
> 支持导入和导出声明。这意味着您可以粘贴包含
> `import ... from ...;`、`export class ...` 或 `export function ...`
> 的代码，它将像执行常规 ES 模块一样工作。

## 特殊变量

REPL 提供了一些始终可用的特殊变量：

| 标识符 | 描述                 |
| ------ | -------------------- |
| _      | 返回上次求值的表达式 |
| _error | 返回上次抛出的错误   |

```
Deno 1.14.3
exit using ctrl+d or close()
> "hello world!"
"hello world!"
> _
"hello world!"
> const foo = "bar";
undefined
> _
undefined
```

## 特殊函数

REPL 在全局范围内提供了多个函数：

| 函数    | 描述                 |
| ------- | -------------------- |
| clear() | 清除整个终端屏幕     |
| close() | 关闭当前的 REPL 会话 |

## `--eval` 标志

`--eval` 标志允许您在进入 REPL 之前在运行时运行一些代码。这对于导入常用于 REPL
中的代码或以某种方式修改运行时非常有用：

```
$ deno repl --allow-net --eval 'import { assert } from "https://deno.land/std/assert/mod.ts"'
Deno 1.36.0
exit using ctrl+d, ctrl+c, or close()
> assert(true)
undefined
> assert(false)
Uncaught AssertionError
    at assert (https://deno.land/std@0.197.0/assert/assert.ts:7:11)
    at <anonymous>:2:1
```

## `--eval-file` 标志

`--eval-file` 标志允许您在进入 REPL 之前运行指定文件中的代码。与 `--eval`
标志类似，这对于导入常用于 REPL 中的代码或以某种方式修改运行时非常有用。

文件可以指定为路径或 URL。URL 文件会被缓存，并可以通过 `--reload` 标志重新加载。

如果同时指定了 `--eval`，则 `--eval-file` 文件将在 `--eval` 代码之前运行。

```
$ deno repl --eval-file=https://examples.deno.land/hello-world.ts,https://deno.land/std/encoding/ascii85.ts
Download https://examples.deno.land/hello-world.ts
Hello, World!
Download https://deno.land/std/encoding/ascii85.ts
Deno 1.20.5
exit using ctrl+d or close()
> rfc1924 // 在 ascii85.ts 中定义的本地（未导出）变量
"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~"
```

### 相对导入路径解析

如果 `--eval-file`
指定了包含相对导入的代码文件，那么运行时将尝试相对于当前工作目录解析导入。它不会尝试相对于代码文件的位置解析导入。当
`--eval-file` 与模块文件一起使用时，这可能会导致“模块未找到”的错误：

```
$ deno repl --eval-file=https://deno.land/std/hash/md5.ts
error in --eval-file file https://deno.land/std/hash/md5.ts. Uncaught TypeError: Module not found "file:///home/encoding/hex.ts".
    at async <anonymous>:2:13
Deno 1.20.5
exit using ctrl+d or close()
> close()
$ deno repl --eval-file=https://deno.land/std/encoding/hex.ts
Download https://deno.land/std/encoding/hex.ts
Deno 1.20.5
exit using ctrl+d or close()
>
```

## 制表完成

制表完成是 REPL 中快速导航的关键功能。按下 `tab` 键后，Deno
现在将显示所有可能的完成列表。

```
$ deno repl
Deno 1.14.3
exit using ctrl+d or close()
> Deno.read
readTextFile      readFile          readDirSync       readLinkSync      readAll           read
readTextFileSync  readFileSync      readDir           readLink          readAllSync       readSync
```

## 键盘快捷键

| 按键                  | 动作                                         |
| --------------------- | -------------------------------------------- |
| Ctrl-A, Home          | 移动光标到行首                               |
| Ctrl-B, Left          | 将光标左移一个字符                           |
| Ctrl-C                | 中断并取消当前编辑                           |
| Ctrl-D                | 如果行为空，则表示行尾                       |
| Ctrl-D, Del           | 如果行不为空，则删除光标下的字符             |
| Ctrl-E, End           | 将光标移动到行尾                             |
| Ctrl-F, Right         | 将光标右移一个字符                           |
| Ctrl-H, Backspace     | 删除光标前的字符                             |
| Ctrl-I, Tab           | 下一个完成                                   |
| Ctrl-J, Ctrl-M, Enter | 完成行输入                                   |
| Ctrl-K                | 删除从光标到行尾的内容                       |
| Ctrl-L                | 清除屏幕                                     |
| Ctrl-N, Down          | 从历史记录中获取下一个匹配                   |
| Ctrl-P, Up            | 从历史记录中获取上一个匹配                   |
| Ctrl-R                | 反向搜索历史记录（Ctrl-S 前进，Ctrl-G 取消） |
| Ctrl-T                | 与前一个字符交换当前字符                     |
| Ctrl-U                | 删除从行首到光标的内容                       |
| Ctrl-V                | 插入任何特殊字符，而不执行其相关操作         |

| ----------------- |
------------------------------------------------------------------ | | Ctrl-W |
删除光标之前的单词（使用空格作为单词边界） | | Ctrl-X Ctrl-U | 撤销 | | Ctrl-Y |
从拷贝缓冲区粘贴 | | Ctrl-Y | 从拷贝缓冲区粘贴（使用 Meta-Y 粘贴下一个拷贝） | |
Ctrl-Z | 挂起（仅适用于 Unix） | | Ctrl-_ | 撤销 | | Meta-0, 1, ..., - |
指定参数的数字。`–` 开始一个负参数。 | | Meta-< | 移动到历史记录的第一个条目 | |
Meta-> | 移动到历史记录的最后一个条目 | | Meta-B, Alt-Left |
移动光标到前一个单词 | | Meta-Backspace |
从当前单词的开头删除，或者如果在单词之间，则从前一个单词的开头删除 | | Meta-C |
大写下一个单词 | | Meta-D | 删除下一个单词 | | Meta-F, Alt-Right |
移动光标到下一个单词 | | Meta-L | 下一个单词小写 | | Meta-T | 交换单词 | |
Meta-U | 大写下一个单词 | | Meta-Y | 参见 Ctrl-Y | | Ctrl-S | 插入新行 |

## `DENO_REPL_HISTORY`

您可以使用 `DENO_REPL_HISTORY` 环境变量来控制 Deno 存储 REPL
历史文件的位置。您可以将其设置为空值，Deno 将不会存储历史文件。
