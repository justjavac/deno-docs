# Mocking

测试间谍是函数替身，用于断言函数的内部行为是否符合期望。方法的测试间谍保留原始行为，但允许你测试方法的调用方式和返回值。测试存根是测试间谍的扩展，还替换了原始方法的行为。

## Spying

假设我们有两个函数，`square` 和 `multiply`，如果我们想要断言在执行 `square`
函数时 `multiply` 函数被调用，我们需要一种方法来监视 `multiply`
函数。有几种方法可以实现这一点，其中一种是让 `square` 函数将 `multiply`
作为参数。

```ts
// https://deno.land/std/testing/mock_examples/parameter_injection.ts
export function multiply(a: number, b: number): number {
  return a * b;
}

export function square(
  multiplyFn: (a: number, b: number) => number,
  value: number,
): number {
  return multiplyFn(value, value);
}
```

这样，我们可以在应用程序代码中调用
`square(multiply, value)`，或者在测试代码中包装一个监视函数，然后调用
`square(multiplySpy, value)`。

```ts
// https://deno.land/std/testing/mock_examples/parameter_injection_test.ts
import {
  assertSpyCall,
  assertSpyCalls,
  spy,
} from "https://deno.land/std@$STD_VERSION/testing/mock.ts";
import { assertEquals } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import {
  multiply,
  square,
} from "https://deno.land/std@$STD_VERSION/testing/mock_examples/parameter_injection.ts";

Deno.test("square calls multiply and returns results", () => {
  const multiplySpy = spy(multiply);

  assertEquals(square(multiplySpy, 5), 25);

  // 断言 multiplySpy 至少被调用一次，以及有关第一次调用的详细信息。
  assertSpyCall(multiplySpy, 0, {
    args: [5, 5],
    returned: 25,
  });

  // 断言 multiplySpy 只被调用一次。
  assertSpyCalls(multiplySpy, 1);
});
```

如果你不想为测试目的添加额外的参数，你可以使用监视函数来包装对象上的方法。在以下示例中，导出的
`_internals` 对象具有我们想要作为方法调用的 `multiply` 函数，而 `square`
函数调用 `_internals.multiply` 而不是 `multiply`。

```ts
// https://deno.land/std/testing/mock_examples/internals_injection.ts
export function multiply(a: number, b: number): number {
  return a * b;
}

export function square(value: number): number {
  return _internals.multiply(value, value);
}

export const _internals = { multiply };
```

这样，我们可以在应用程序代码和测试代码中都调用
`square(value)`。然后，在测试代码中监视 `_internals` 对象上的 `multiply`
方法，以便监视 `square` 函数如何调用 `multiply` 函数。

```ts
// https://deno.land/std/testing/mock_examples/internals_injection_test.ts
import {
  assertSpyCall,
  assertSpyCalls,
  spy,
} from "https://deno.land/std@$STD_VERSION/testing/mock.ts";
import { assertEquals } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import {
  _internals,
  square,
} from "https://deno.land/std@$STD_VERSION/testing/mock_examples/internals_injection.ts";

Deno.test("square calls multiply and returns results", () => {
  const multiplySpy = spy(_internals, "multiply");

  try {
    assertEquals(square(5), 25);
  } finally {
    // 解除 _internals 对象上的 multiply 方法的监视包装
    multiplySpy.restore();
  }

  // 断言 multiplySpy 至少被调用一次，以及有关第一次调用的详细信息。
  assertSpyCall(multiplySpy, 0, {
    args: [5, 5],
    returned: 25,
  });

  // 断言 multiplySpy 只被调用一次。
  assertSpyCalls(multiplySpy, 1);
});
```

你可能已经注意到这两个示例之间的一个区别是，在第二个示例中，我们调用
`multiplySpy` 函数上的 `restore` 方法。这是为了从 `_internals` 对象的 `multiply`
方法中移除监视包装所需的。`restore` 方法在 finally 块中被调用，以确保无论 try
块中的断言是否成功，都会被还原。在第一个示例中不需要调用 `restore` 方法，因为
`multiply` 函数没有像第二个示例中的 `_internals` 对象那样被修改。

## 存根

假设我们有两个函数，`randomMultiple` 和 `randomInt`，如果我们想要断言在执行
`randomMultiple` 时 `randomInt` 被调用，我们需要一种方法来监视 `randomInt`
函数。这可以用前面提到的任一监视技术来实现。为了能够验证 `randomMultiple`
函数是否返回我们期望的值，我们最简单的方法是替换 `randomInt`
函数的行为，使其更可预测。

你可以使用第一个监视技术来做到这一点，但这需要向 `randomMultiple` 函数添加一个
`randomInt` 参数。

你也可以使用第二个监视技术来做到这一点，但由于 `randomInt`
函数返回随机值，你的断言可能不够可预测。

假设我们希望验证它对负数和正数随机整数都返回正确的值。我们可以使用存根轻松实现这一点。下面的示例类似于第二个监视技术示例，但不是将调用传递给原始的
`randomInt` 函数，而是将 `randomInt` 替换为返回预定义值的函数。

```ts
// https://deno.land/std/testing/mock_examples/random.ts
export function randomInt(lowerBound: number, upperBound: number): number {
  return lowerBound + Math.floor(Math.random() * (upperBound - lowerBound));
}

export function random

Multiple(value: number): number {
  return value * _internals.randomInt(-10, 10);
}

export const _internals = { randomInt };
```

模拟模块包括一些辅助函数，以便轻松创建常见的存根。`returnsNext`
函数接受一个要在连续调用中返回的值数组。

```ts
// https://deno.land/std/testing/mock_examples/random_test.ts
import {
  assertSpyCall,
  assertSpyCalls,
  returnsNext,
  stub,
} from "https://deno.land/std@$STD_VERSION/testing/mock.ts";
import { assertEquals } from "https://deno.land/std@$STD_VERSION/assert/mod.ts";
import {
  _internals,
  randomMultiple,
} from "https://deno.land/std@$STD_VERSION/testing/mock_examples/random.ts";

Deno.test("randomMultiple uses randomInt to generate random multiples between -10 and 10 times the value", () => {
  const randomIntStub = stub(_internals, "randomInt", returnsNext([-3, 3]));

  try {
    assertEquals(randomMultiple(5), -15);
    assertEquals(randomMultiple(5), 15);
  } finally {
    // 解除 _internals 对象上的 randomInt 方法的监视包装
    randomIntStub.restore();
  }

  // 断言 randomIntStub 至少被调用一次，以及有关第一次调用的详细信息。
  assertSpyCall(randomIntStub, 0, {
    args: [-10, 10],
    returned: -3,
  });
  // 断言 randomIntStub 至少被调用两次，以及有关第二次调用的详细信息。
  assertSpyCall(randomIntStub, 1, {
    args: [-10, 10],
    returned: 3,
  });

  // 断言 randomIntStub 只被调用两次。
  assertSpyCalls(randomIntStub, 2);
});
```

## 伪造时间

假设我们有一个具有基于时间的行为的函数，我们想要进行测试。在真实时间下，这可能导致测试花费比应该更长的时间。如果你伪造时间，你可以模拟从任何时间点开始函数将如何随着时间的推移而行为。下面是一个示例，我们想要测试回调是否每秒被调用一次。

```ts
// https://deno.land/std/testing/mock_examples/interval.ts
export function secondInterval(cb: () => void): number {
  return setInterval(cb, 1000);
}
```

使用 `FakeTime`，我们可以做到这一点。当创建 `FakeTime`
实例时，它会从真实时间中分离出来。`Date`、`setTimeout`、`clearTimeout`、`setInterval`
和 `clearInterval`
全局函数被替换为使用伪时间的版本，直到还原真实时间为止。你可以使用 `FakeTime`
实例上的 `tick` 方法来控制时间的前进。

```ts
// https://deno.land/std/testing/mock_examples/interval_test.ts
import {
  assertSpyCalls,
  spy,
} from "https://deno.land/std@$STD_VERSION/testing/mock.ts";
import { FakeTime } from "https://deno.land/std@$STD_VERSION/testing/time.ts";
import { secondInterval } from "https://deno.land/std@$STD_VERSION/testing/mock_examples/interval.ts";

Deno.test("secondInterval calls callback every second and stops after being cleared", () => {
  const time = new FakeTime();

  try {
    const cb = spy();
    const intervalId = secondInterval(cb);
    assertSpyCalls(cb, 0);
    time.tick(500);
    assertSpyCalls(cb, 0);
    time.tick(500);
    assertSpyCalls(cb, 1);
    time.tick(3500);
    assertSpyCalls(cb, 4);

    clearInterval(intervalId);
    time.tick(1000);
    assertSpyCalls(cb, 4);
  } finally {
    time.restore();
  }
});
```
