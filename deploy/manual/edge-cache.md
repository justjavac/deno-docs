---
title: "Edge Cache"
---

[Web Cache API](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache) 在 Deno
Deploy 上得到支持。该缓存旨在提供微秒级的读取延迟、多 GB/s
的写入吞吐量和无限制的存储空间，但代价是尽力而为的一致性和持久性。

```ts
const cache = await caches.open("my-cache");

Deno.serve(async (req) => {
  const cached = await cache.match(req);
  if (cached) {
    return cached;
  }

  const res = new Response("cached at " + new Date().toISOString());
  await cache.put(req, res.clone());
  return res;
});
```

缓存数据存储在运行您代码的同一 Deno Deploy 区域中。通常，您的 isolate
在同一区域内会观察到读后写（RAW）和写后写（WAW）一致性；然而，在极少数情况下，最近的写入可能会丢失、乱序或暂时不可见。

## 过期

默认情况下，缓存数据会无限期保存。虽然我们会定期扫描并删除不活跃的对象，但对象通常会在缓存中保留至少
30 天。

Edge Cache 理解标准的 HTTP 响应头 `Expires` 和
`Cache-Control`。您可以使用它们为每个缓存对象指定过期时间，例如：

```
Expires: Thu, 22 Aug 2024 01:22:31 GMT
```

或：

```
Cache-Control: max-age=86400
```

## 限制

- 如果响应不是从 `Uint8Array` 或 `string` 主体构建的，则需要手动设置
  `Content-Length` 头。
- 目前不支持删除。
