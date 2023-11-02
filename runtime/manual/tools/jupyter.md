# Deno 的 Jupyter 内核

<p>
<span class="theme-doc-version-badge badge badge--secondary">
自 <b> 1.37.0 </b> 版本开始提供
</span>
</p>

Deno 自带了一个内置的 Jupyter 内核，允许您编写 JavaScript 和 TypeScript；使用
Web 和 Deno API 并直接在互动笔记本中导入 `npm` 包。

::: caution `deno jupyter` 目前不稳定

`deno jupyter` 目前是一个不稳定的功能，因此需要使用 `--unstable`
标志。我们打算在即将发布的版本中稳定此功能。

:::

## 快速开始

运行 `deno jupyter --unstable` 并按照说明进行操作。

您可以运行 `deno jupyter --unstable --install` 来强制安装内核。Deno 假定您的
`PATH` 中有 `jupyter` 命令。

完成安装过程后，Deno 内核将在 JupyterLab 和经典笔记本的笔记本创建对话框中可用：

![Jupyter 笔记本内核选择](../images/jupyter_notebook.png)

您可以在支持 Jupyter 笔记本的任何编辑器中使用 Deno Jupyter 内核。

### VS Code

- 安装
  [VSCode Jupyter 扩展](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)
- 在新建或现有笔记本上，单击创建新的 Jupyter 笔记本，选择 "Jupyter
  内核"，然后选择 Deno

![在 VS Code 中选择 Deno](https://github.com/denoland/deno-docs/assets/836375/32f0ccc3-35f7-47e5-84f4-17c20a5b5732)

### JetBrains IDEs

Jupyter 笔记本已经预先安装好。

## 丰富的内容输出

Deno Jupyter 内核允许您在笔记本中显示富内容
[使用 Jupyter 支持的 MIME 类型](https://docs.jupyter.org/en/latest/reference/mimetype.html)。

为此，您需要返回具有 `[Symbol.for("Jupyter.display")]` 方法的任何 JavaScript
对象。此方法应返回将 MIME 类型映射到应显示的值的字典。

```ts
{
  [Symbol.for("Jupyter.display")]() {
    return {
      // 纯文本内容
      "text/plain": "你好，世界！",

      // HTML 输出
      "text/html": "<h1>你好，世界！</h1>",
    }
  }
}
```

由于它只是一个函数，您可以使用任何您想要的库来格式化输出。这与 Deno
本身没有任何关系，因为我们使用了一个常规的 JavaScript 符号索引。

## `jupyter console` 集成

您还可以在 `jupyter console` REPL 中使用 Deno Jupyter 内核。要做到这一点，
您应该使用 `jupyter console --kernel deno` 启动您的控制台。

![在 CLI 中使用 Deno 内核](../images/jupyter-cli.gif)
