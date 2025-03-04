---
title: Node API
templateEngine: [vto, md]
oldUrl:
- /runtime/manual/node/compatibility/
- /runtime/manual/npm_nodejs/compatibility_mode/
---

Deno 为许多内置的 Node.js 模块和全局对象提供了 polyfills。

<a href="/api/node/" class="docs-cta runtime-cta">探索内置的 Node API</a>

Node 兼容性是一个持续进行的项目——帮助我们识别缺失的部分，并通过
[在 GitHub 上提交问题](https://github.com/denoland/deno) 告诉我们你需要的模块。

{{ await generateNodeCompatability() }}

## 全局对象

以下是 Deno 支持的 Node 全局对象列表。这些全局对象仅在 `npm`
包范围内可用。在你自己的代码中，你可以通过从相应的 `node:` 模块导入来使用它们。

| 全局对象名称                                                                                                   | 状态                               |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [`AbortController`](https://nodejs.org/api/globals.html#class-abortcontroller)                                 | ✅                                 |
| [`AbortSignal`](https://nodejs.org/api/globals.html#class-abortsignal)                                         | ✅                                 |
| [`Blob`](https://nodejs.org/api/globals.html#class-blob)                                                       | ✅                                 |
| [`Buffer`](https://nodejs.org/api/globals.html#class-buffer)                                                   | ✅                                 |
| [`ByteLengthQueuingStrategy`](https://nodejs.org/api/globals.html#class-bytelengthqueuingstrategy)             | ✅                                 |
| [`__dirname`](https://nodejs.org/api/globals.html#__dirname)                                                   | ⚠️ [信息](#node.js-global-objects) |
| [`__filename`](https://nodejs.org/api/globals.html#__filename)                                                 | ⚠️ [信息](#nodejs-global-objects)  |
| [`atob`](https://nodejs.org/api/globals.html#atobdata)                                                         | ✅                                 |
| [`BroadcastChannel`](https://nodejs.org/api/globals.html#broadcastchannel)                                     | ✅                                 |
| [`btoa`](https://nodejs.org/api/globals.html#btoadata)                                                         | ✅                                 |
| [`clearImmediate`](https://nodejs.org/api/globals.html#clearimmediateimmediateobject)                          | ✅                                 |
| [`clearInterval`](https://nodejs.org/api/globals.html#clearintervalintervalobject)                             | ✅                                 |
| [`clearTimeout`](https://nodejs.org/api/globals.html#cleartimeouttimeoutobject)                                | ✅                                 |
| [`CompressionStream`](https://nodejs.org/api/globals.html#class-compressionstream)                             | ✅                                 |
| [`console`](https://nodejs.org/api/globals.html#console)                                                       | ✅                                 |
| [`CountQueuingStrategy`](https://nodejs.org/api/globals.html#class-countqueuingstrategy)                       | ✅                                 |
| [`Crypto`](https://nodejs.org/api/globals.html#crypto)                                                         | ✅                                 |
| [`CryptoKey`](https://nodejs.org/api/globals.html#cryptokey)                                                   | ✅                                 |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                               | ✅                                 |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                               | ✅                                 |
| [`DecompressionStream`](https://nodejs.org/api/globals.html#class-decompressionstream)                         | ✅                                 |
| [`Event`](https://nodejs.org/api/globals.html#event)                                                           | ✅                                 |
| [`EventTarget`](https://nodejs.org/api/globals.html#eventtarget)                                               | ✅                                 |
| [`exports`](https://nodejs.org/api/globals.html#exports)                                                       | ✅                                 |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                           | ✅                                 |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                       | ✅                                 |
| [`FormData`](https://nodejs.org/api/globals.html#class-formdata)                                               | ✅                                 |
| [`global`](https://nodejs.org/api/globals.html#global)                                                         | ✅                                 |
| [`Headers`](https://nodejs.org/api/globals.html#class-headers)                                                 | ✅                                 |
| [`MessageChannel`](https://nodejs.org/api/globals.html#messagechannel)                                         | ✅                                 |
| [`MessageEvent`](https://nodejs.org/api/globals.html#messageevent)                                             | ✅                                 |
| [`MessagePort`](https://nodejs.org/api/globals.html#messageport)                                               | ✅                                 |
| [`module`](https://nodejs.org/api/globals.html#module)                                                         | ✅                                 |
| [`PerformanceEntry`](https://nodejs.org/api/globals.html#performanceentry)                                     | ✅                                 |
| [`PerformanceMark`](https://nodejs.org/api/globals.html#performancemark)                                       | ✅                                 |
| [`PerformanceMeasure`](https://nodejs.org/api/globals.html#performancemeasure)                                 | ✅                                 |
| [`PerformanceObserver`](https://nodejs.org/api/globals.html#performanceobserver)                               | ✅                                 |
| [`PerformanceObserverEntryList`](https://nodejs.org/api/globals.html#performanceobserverentrylist)             | ❌                                 |
| [`PerformanceResourceTiming`](https://nodejs.org/api/globals.html#performanceresourcetiming)                   | ❌                                 |
| [`performance`](https://nodejs.org/api/globals.html#performance)                                               | ✅                                 |
| [`process`](https://nodejs.org/api/globals.html#process)                                                       | ✅                                 |
| [`queueMicrotask`](https://nodejs.org/api/globals.html#queuemicrotaskcallback)                                 | ✅                                 |
| [`ReadableByteStreamController`](https://nodejs.org/api/globals.html#class-readablebytestreamcontroller)       | ✅                                 |
| [`ReadableStream`](https://nodejs.org/api/globals.html#class-readablestream)                                   | ✅                                 |
| [`ReadableStreamBYOBReader`](https://nodejs.org/api/globals.html#class-readablestreambyobreader)               | ✅                                 |
| [`ReadableStreamBYOBRequest`](https://nodejs.org/api/globals.html#class-readablestreambyobrequest)             | ✅                                 |
| [`ReadableStreamDefaultController`](https://nodejs.org/api/globals.html#class-readablestreamdefaultcontroller) | ✅                                 |
| [`ReadableStreamDefaultReader`](https://nodejs.org/api/globals.html#class-readablestreamdefaultreader)         | ✅                                 |
| [`require`](https://nodejs.org/api/globals.html#require)                                                       | ✅                                 |
| [`Response`](https://nodejs.org/api/globals.html#response)                                                     | ✅                                 |
| [`Request`](https://nodejs.org/api/globals.html#request)                                                       | ✅                                 |
| [`setImmediate`](https://nodejs.org/api/globals.html#setimmediatecallback-args)                                | ✅                                 |
| [`setInterval`](https://nodejs.org/api/globals.html#setintervalcallback-delay-args)                            | ✅                                 |
| [`setTimeout`](https://nodejs.org/api/globals.html#settimeoutcallback-delay-args)                              | ✅                                 |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                          | ✅                                 |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                          | ✅                                 |
| [`SubtleCrypto`](https://nodejs.org/api/globals.html#subtlecrypto)                                             | ✅                                 |
| [`DOMException`](https://nodejs.org/api/globals.html#domexception)                                             | ✅                                 |
| [`TextDecoder`](https://nodejs.org/api/globals.html#textdecoder)                                               | ✅                                 |
| [`TextDecoderStream`](https://nodejs.org/api/globals.html#class-textdecoderstream)                             | ✅                                 |
| [`TextEncoder`](https://nodejs.org/api/globals.html#textencoder)                                               | ✅                                 |
| [`TextEncoderStream                                                                                            |                                    |
