---
tags: []
---

要求 TODOs 必须使用用户标签（`@user`）或问题引用（`#issue`）进行注释。

没有引用用户或问题的 TODOs 会变得陈旧，且无法轻松获取更多信息。

**无效：**

```typescript
// TODO Improve calc engine
export function calcValue(): number {}
```

```typescript
// TODO Improve calc engine (@djones)
export function calcValue(): number {}
```

```typescript
// TODO Improve calc engine (#332)
export function calcValue(): number {}
```

**有效：**

```typescript
// TODO(djones) Improve calc engine
export function calcValue(): number {}
```

```typescript
// TODO(@djones) Improve calc engine
export function calcValue(): number {}
```

```typescript
// TODO(#332)
export function calcValue(): number {}
```

```typescript
// TODO(#332) Improve calc engine
export function calcValue(): number {}
```
