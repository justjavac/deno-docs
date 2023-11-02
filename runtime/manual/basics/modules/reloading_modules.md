import { replacements } from "@site/src/components/Replacement";

# 重新加载模块

默认情况下，缓存中的模块将被重复使用，而无需获取或重新编译它。有时这是不希望的，您可以强制
deno 重新获取和重新编译模块到缓存中。您可以使用 `deno cache` 子命令的 `--reload`
标志来使您的本地 `DENO_DIR` 缓存失效。它的用法如下：

## 重新加载所有内容

```bash
deno cache --reload my_module.ts
```

## 重新加载特定模块

有时，我们只想升级一些模块。您可以通过向 `--reload` 标志传递参数来控制它。

<p>
  要重新加载所有标准模块 <code>{ replacements.STD_VERSION }</code>：
</p>

```bash
deno cache --reload=https://deno.land/std@$STD_VERSION my_module.ts
```

要重新加载特定模块（在此示例中为颜色和文件系统复制），请使用逗号分隔 URL。

```bash
deno cache --reload=https://deno.land/std@$STD_VERSION/fs/copy.ts,https://deno.land/std@$STD_VERSION/fmt/colors.ts my_module.ts
```

<!-- 是否应该作为示例的一部分？ -->
