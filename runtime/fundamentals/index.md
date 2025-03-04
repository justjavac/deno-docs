---
title: 基础
---

Deno
的设计以开发者为中心，旨在提供流畅且愉快的开发体验。其简洁性和高效性使得即使对于后端开发新手来说，也能快速轻松上手。

## 内置工具

Deno
的内置工具极大地简化了入门过程。通过一个单一的可执行文件，您可以立即开始，而无需担心复杂的设置或依赖关系。这使您能够专注于编写代码，而不是配置环境。

- [配置您的项目](/runtime/fundamentals/configuration/)
- [TypeScript 支持](/runtime/fundamentals/typescript/)
- [代码检查和格式化](/runtime/fundamentals/linting_and_formatting/)
- [测试](/runtime/fundamentals/testing/)
- [调试](/runtime/fundamentals/debugging/)
- [HTTP 服务器](/runtime/fundamentals/http_server/)

## Node 和 npm 支持

Deno 支持 Node.js 和 npm
包，使您能够利用现有库和工具的庞大生态系统。这种兼容性确保您可以无缝地将 Deno
集成到您的项目中。

- [Node.js 兼容性](/runtime/fundamentals/node/)
- [npm 兼容性](/runtime/fundamentals/node/#using-npm-packages)

## 标准库

Deno 附带了一个用 TypeScript 编写的全面标准库。该库包括用于常见任务的模块，如
HTTP
服务器、文件系统操作等，使您能够避免“重新发明轮子”，并专注于应用程序的功能。

- [标准库](/runtime/fundamentals/standard_library/)

## 默认安全

安全性是 Deno
的首要任务。默认情况下，它需要明确的权限才能访问文件、网络和环境，从而降低安全漏洞的风险。这种默认安全的方法有助于保护您的应用程序免受潜在威胁。

- [安全性和权限](/runtime/fundamentals/security/)

## 现代语言特性

Deno 拥抱现代 JavaScript 特性，包括
ESModules。这意味着您可以使用语言的最新语法和功能，确保您的代码是最新的，并利用行业中的最佳实践。

- [使用 ESModules](/runtime/fundamentals/modules/)
- [从 CJS 迁移到 ESM](/runtime/tutorials/cjs_to_esm/)
