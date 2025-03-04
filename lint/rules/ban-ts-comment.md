---
tags: [recommended]
---

禁止在没有注释的情况下使用 Typescript 指令。

Typescript
指令会降低编译器的有效性，这种情况只应在特殊情况下使用。使用指令的原因应在注释中与指令一起记录。

**无效示例：**

```typescript
// @ts-expect-error
let a: number = "I am a string";
```

```typescript
// @ts-ignore
let a: number = "I am a string";
```

```typescript
// @ts-nocheck
let a: number = "I am a string";
```

**有效示例：**

```typescript
// @ts-expect-error: 临时解决方案（参见工单 #422）
let a: number = "I am a string";
```

```typescript
// @ts-ignore: 临时解决方案（参见工单 #422）
let a: number = "I am a string";
```

```typescript
// @ts-nocheck: 临时解决方案（参见工单 #422）
let a: number = "I am a string";
```
