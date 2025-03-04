---
tags: []
---

检查 `<button>` JSX 元素是否具有有效的 `type` 属性。默认值为
`"submit"`，这通常不是期望的行为。

**无效：**

```tsx
<button />
<button type="foo" />
<button type={condition ? "foo" : "bar"} />
<button type={foo} />
<button type={2} />
```

**有效：**

```tsx
<button type="submit" />
<button type="button" />
<button type="reset" />
<button type={condition ? "button" : "submit"} />
```
