---
title: "deno completions"
oldUrl: /runtime/manual/tools/completions/
command: completions
---

## 示例

### 配置 Bash shell 自动补全

```bash
deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
source /usr/local/etc/bash_completion.d/deno.bash
```

### 配置 PowerShell shell 自动补全

```bash
deno completions powershell | Out-String | Invoke-Expression
```

### 配置 zsh shell 自动补全

首先将以下内容添加到你的 `.zshrc` 文件中：

```bash
fpath=(~/.zsh/completion $fpath)
autoload -U compinit
compinit
```

然后运行以下命令：

```bash
deno completions zsh > _deno
mv _deno ~/.zsh/completion/_deno
autoload -U compinit && compinit
```

### 配置 fish shell 自动补全

```bash
deno completions fish > completions.fish
chmod +x ./completions.fish
```
