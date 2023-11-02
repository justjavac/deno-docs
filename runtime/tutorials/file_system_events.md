# 文件系统事件

## 概念

- 使用 [Deno.watchFs](https://deno.land/api?s=Deno.watchFs) 来监视文件系统事件。
- 不同操作系统之间的结果可能会有所不同。

## 示例

要轮询当前目录中的文件系统事件：

```ts
/**
 * watcher.ts
 */
const watcher = Deno.watchFs(".");
for await (const event of watcher) {
  console.log(">>>> 事件", event);
  // 示例事件: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
}
```

运行命令：

```shell
deno run --allow-read watcher.ts
```

现在尝试在与 `watcher.ts` 相同的目录中添加、删除和修改文件。

请注意，事件的精确排序可能因操作系统而异。此功能根据平台使用不同的系统调用：

- Linux: [inotify](https://man7.org/linux/man-pages/man7/inotify.7.html)
- macOS:
  [FSEvents](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/FSEvents_Progmanual/Introduction/Introduction.html)
- Windows:
  [ReadDirectoryChangesW](https://docs.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-readdirectorychangesw)
