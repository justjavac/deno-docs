# Web 平台兼容性测试

Deno 使用自定义测试运行器来运行网页平台测试。您可以在 `./tools/wpt.ts`
中找到它。

## 运行测试

> 如果您使用的是 Windows，或者您的系统不支持 hashbangs，请在所有
> `./tools/wpt.ts` 命令之前加上
> `deno run --unstable --allow-write --allow-read --allow-net --allow-env --allow-run`。

在首次尝试运行 WPT 测试之前，请运行 WPT 设置。每当 `./test_util/wpt`
子模块更新时，您也必须运行此命令：

```shell
./tools/wpt.ts setup
```

要运行所有可用的网页平台测试，请运行以下命令：

```shell
./tools/wpt.ts run

# 您还可以通过指定过滤器来筛选要运行的测试文件：
./tools/wpt.ts run -- streams/piping/general hr-time
```

测试运行器将运行每个网页平台测试，并记录其状态（失败或
ok）。然后，它将将此输出与每个测试的预期输出进行比较，如
`./tools/wpt/expectation.json` 文件中指定的那样。该文件是一个嵌套的 JSON
结构，镜像了 `./test_utils/wpt` 目录。它描述了每个
测试文件，如果它应该作为整体通过（所有测试都通过，`true`），如果它应该
作为整体失败（测试运行器在测试之外遇到异常或所有测试都失败，`false`），或它期望失败的测试（测试案例名称的字符串数组）。

## 更新已启用的测试或期望

您可以通过手动更改 JSON 结构中的每个测试文件条目的值来手动更新
`./tools/wpt/expectation.json` 文件。另一个备选且首选的选项是让 WPT
运行器运行所有测试或筛选的子集，然后自动更新 `expectation.json`
文件以匹配当前情况。您可以使用 `./wpt.ts update` 命令执行此操作。例如：

```shell
./tools/wpt.ts update -- hr-time
```

运行此命令后，`expectation.json`
文件将与已运行测试的当前输出匹配。这意味着在运行 `wpt.ts run` 之前运行
`wpt.ts update` 应该始终成功。

## 子命令

### `setup`

验证您的环境是否已正确配置，或帮助您进行配置。

这将检查 python3（或 Windows 上的 `python.exe`）是否实际上是 Python 3。

您可以指定以下标志以自定义行为：

```
--rebuild
重新生成清单，而不是下载。这可能需要高达3分钟。

--auto-config
如果未配置/etc/hosts，则自动配置它（将不显示提示）。
```

### `run`

运行 `expectation.json` 中指定的所有测试。

您可以指定以下标志以自定义行为：

```
--release
使用./target/release/deno二进制文件，而不是./target/debug/deno

--quiet
禁用`ok`测试用例的打印。

--json=<file>
将测试结果输出为指定文件的JSON。
```

您还可以通过在 `--` 后指定一个或多个筛选器来明确指定要运行哪些测试：

```
./tools/wpt.ts run -- hr-time streams/piping/general
```

### `update`

更新 `expectation.json` 以匹配当前情况。

您可以指定以下标志以自定义行为：

```
--release
使用./target/release/deno二进制文件，而不是./target/debug/deno

--quiet
禁用`ok`测试用例的打印。

--json=<file>
将测试结果输出为指定文件的JSON。
```

您还可以通过在 `--` 后指定一个或多个筛选器来明确指定要运行哪些测试：

```
./tools/wpt.ts update -- hr-time streams/piping/general
```

## 常见问题

### 升级 wpt 子模块：

```shell
cd test_util/wpt/
git fetch origin
git checkout origin/epochs/daily
cd ../../
git add ./test_util/wpt
```

所有贡献者都需要在此之后重新运行 `./tools/wpt.ts setup`。

由于升级 WPT 通常需要更新期望以覆盖各种上游更改，最好将其作为一个单独的 PR
来执行，而不是作为实施修复或功能的 PR 的一部分。
