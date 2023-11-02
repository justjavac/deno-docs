# 测试覆盖率

Deno 将在启动 `deno test` 时，如果指定 `--coverage`
标志，将测试覆盖率收集到一个目录中。

这些覆盖信息直接从 JavaScript 引擎 (V8) 中获取，非常准确。

然后，可以使用 `deno coverage` 工具将其从内部格式进一步处理成众所周知的格式。

> ⚠️
> 为了确保一致的覆盖结果，请确保在运行测试后立即处理覆盖数据。否则，源代码和收集的覆盖数据可能不同步，并可能显示未覆盖的行。

```bash
# 进入项目的工作目录
git clone https://github.com/oakserver/oak && cd oak

# 使用 deno test --coverage=<output_directory> 收集覆盖率概要
deno test --coverage=cov_profile

# 从中可以获取未覆盖行的漂亮差异输出
deno coverage cov_profile

# 或生成一个 lcov 报告
deno coverage cov_profile --lcov --output=cov_profile.lcov

# 然后可以进一步由 genhtml 等工具处理
genhtml -o cov_profile/html cov_profile.lcov
```

默认情况下，`deno coverage` 将排除与正则表达式
`test\.(ts|tsx|mts|js|mjs|jsx|cjs|cts)` 匹配的文件，并仅考虑包括匹配正则表达式
`^file:` 的模块规范 - 即，远程文件将不包括在覆盖报告中。

可以使用 `--exclude` 和 `--include` 标志来覆盖这些过滤器。模块规范必须与
`include` 正则表达式匹配，并且不能与 `exclude`
正则表达式匹配，才会包括在报告中。
