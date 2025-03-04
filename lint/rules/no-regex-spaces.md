---
tags: [recommended]
---

禁止在正则表达式字面量中使用多个空格。

当正则表达式变得复杂时，正则表达式字面量中的多个空格通常难以阅读。相反，最好只使用一个空格字符，并通过
`{n}` 语法指定空格应出现的次数，例如：

```typescript
// 正则表达式字面量中的多个空格难以理解需要匹配多少个空格
const re = /foo   bar/;

// 为了提高可读性，使用 `{n}` 语法
const re = /foo {3}var/;
```

**无效：**

```typescript
const re1 = /  /;
const re2 = /foo  bar/;
const re3 = / a b  c d /;
const re4 = /foo  {3}bar/;

const re5 = new RegExp("  ");
const re6 = new RegExp("foo  bar");
const re7 = new RegExp(" a b  c d ");
const re8 = new RegExp("foo  {3}bar");
```

**有效：**

```typescript
const re1 = /foo/;
const re2 = / /;
const re3 = / {3}/;
const re4 = / +/;
const re5 = / ?/;
const re6 = / */;

const re7 = new RegExp("foo");
const re8 = new RegExp(" ");
const re9 = new RegExp(" {3}");
const re10 = new RegExp(" +");
const re11 = new RegExp(" ?");
const re12 = new RegExp(" *");
```
