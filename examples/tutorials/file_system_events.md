---
title: "文件系统事件"
url: /examples/file_system_events_tutorial/
oldUrl:
  - /runtime/manual/examples/file_system_events/
  - /runtime/tutorials/file_system_events/
---

## 概念

- 使用 [Deno.watchFs](https://docs.denohub.com/api/deno/~/Deno.watchFs)
  来监听文件系统事件。
- 结果可能因操作系统而异。

## 示例

要轮询当前目录中的文件系统事件：

```ts title="watcher.ts"
const watcher = Deno.watchFs(".");
for await (const event of watcher) {
  console.log(">>>> event", event);
  // 示例事件: { kind: "create", paths: [ "/home/alice/deno/foo.txt" ] }
}
```

运行命令：

```shell
deno run --allow-read watcher.ts
```

现在尝试在 `watcher.ts` 所在的目录中添加、删除和修改文件。

请注意，事件的确切顺序可能因操作系统而异。此功能根据平台使用不同的系统调用：

- Linux: [inotify](https://man7.org/linux/man-pages/man7/inotify.7.html)
- macOS:
  [FSEvents](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/FSEvents_ProgGuide/Introduction/Introduction.html)
- Windows:
  [ReadDirectoryChangesW](https://docs.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-readdirectorychangesw)
