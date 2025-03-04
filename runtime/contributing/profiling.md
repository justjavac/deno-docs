---
title: "性能分析"
oldUrl: /runtime/manual/references/contributing/profiling/
---

## Perf 性能分析：

可用于生成/可视化 perf 结果的工具：

- flamegraph-rs (https://github.com/flamegraph-rs/flamegraph)
- flamescope (https://github.com/Netflix/flamescope)

在 `micro_bench_ops` 上使用 perf 并使用 flamescope 进行可视化的示例：

```sh
# 构建 `examples/micro_bench_ops`
cargo build --release --example micro_bench_ops

# 使用 perf 运行 `examples/micro_bench_ops`
sudo perf record -F 49 -a -g -- ./target/release/examples/micro_bench_ops
sudo perf script --header > micro_bench_ops_perf

# 现在使用 flamescope 打开文件
```

结合 flamegraph 运行 `deno_tcp.ts` 的示例 (`script.sh`)：

```sh
sudo flamegraph -o flamegraph.svg target/debug/deno run --allow-net cli/bench/deno_tcp.ts &
sleep 1
./third_party/prebuilt/linux64/wrk http://localhost:4500/
sleep 1
kill `pgrep perf`
```

## v8 性能分析：

在 `micro_bench_ops` 上使用 v8 性能分析的示例：

```sh
# 构建 `examples/micro_bench_ops`
cargo build --release --example micro_bench_ops

# 运行 `examples/micro_bench_ops`
./target/release/examples/micro_bench_ops --prof
```

在 `deno_tcp.ts` 上使用 v8 性能分析的示例：

```sh
# 构建 `deno`
cargo build --release

# 运行 `deno_tcp.ts`
./target/release/deno --v8-flags=--prof --allow-net cli/bench/deno_tcp.ts &
sleep 1
./third_party/prebuilt/linux64/wrk http://localhost:4500/
sleep 1
kill `pgrep deno`
```

V8 将在当前目录中生成一个类似以下内容的文件：
`isolate-0x7fad98242400-v8.log`。要检查此文件：

```sh
node --prof-process isolate-0x7fad98242400-v8.log > prof.log
```

`prof.log` 将包含有关不同调用的 tick 分布的信息。

要使用 Web UI 查看日志，请生成日志的 JSON 文件：

在浏览器中打开 `rusty_v8/v8/tools/profview/index.html`，并选择 `prof.json`
以图形方式查看分布。

性能分析期间有用的 V8 标志：

- --prof
- --log-internal-timer-events
- --log-timer-events
- --track-gc
- --log-source-code
- --track-gc-object-stats

要了解更多关于性能分析的信息，请查看以下链接：

- [https://v8.dev/docs/profile](https://v8.dev/docs/profile)

## 使用 LLDB 进行调试

要调试 deno 二进制文件，我们可以使用 `rust-lldb`。它应该与 `rustc`
一起提供，并且是 LLDB 的封装。

```shell
$ rust-lldb -- ./target/debug/deno run --allow-net tests/http_bench.ts
# 在 macOS 上，你可能会收到类似
# `ImportError: cannot import name _remove_dead_weakref` 的警告
# 在这种情况下，通过设置 PATH 使用系统 python，例如
# PATH=/System/Library/Frameworks/Python.framework/Versions/2.7/bin:$PATH
(lldb) command script import "/Users/kevinqian/.rustup/toolchains/1.36.0-x86_64-apple-darwin/lib/rustlib/etc/lldb_rust_formatters.py"
(lldb) type summary add --no-value --python-function lldb_rust_formatters.print_val -x ".*" --category Rust
(lldb) type category enable Rust
(lldb) target create "../deno/target/debug/deno"
Current executable set to '../deno/target/debug/deno' (x86_64).
(lldb) settings set -- target.run-args  "tests/http_bench.ts" "--allow-net"
(lldb) b op_start
(lldb) r
```

## V8 标志

V8 有许多内部命令行标志：

```shell
$ deno run --v8-flags=--help _
SSE3=1 SSSE3=1 SSE4_1=1 SSE4_2=1 SAHF=1 AVX=1 FMA3=1 BMI1=1 BMI2=1 LZCNT=1 POPCNT=1 ATOM=0
Synopsis:
  shell [options] [--shell] [<file>...]
  d8 [options] [-e <string>] [--shell] [[--module] <file>...]

  -e        execute a string in V8
  --shell   run an interactive JavaScript shell
  --module  execute a file as a JavaScript module

Note: the --module option is implicitly enabled for *.mjs files.

The following syntax for options is accepted (both '-' and '--' are ok):
  --flag        (bool flags only)
  --no-flag     (bool flags only)
  --flag=value  (non-bool flags only, no spaces around '=')
  --flag value  (non-bool flags only)
  --            (captures all remaining args in JavaScript)

Options:
  --use-strict (enforce strict mode)
        type: bool  default: false
  --es-staging (enable test-worthy harmony features (for internal use only))
        type: bool  default: false
  --harmony (enable all completed harmony features)
        type: bool  default: false
  --harmony-shipping (enable all shipped harmony features)
        type: bool  default: true
  --harmony-regexp-sequence (enable "RegExp Unicode sequence properties" (in progress))
        type: bool  default: false
  --harmony-weak-refs-with-cleanup-some (enable "harmony weak references with FinalizationRegistry.prototype.cleanupSome" (in progress))
        type: bool  default: false
  --harmony-regexp-match-indices (enable "harmony regexp match indices" (in progress))
        type: bool  default: false
  --harmony-top-level-await (enable "harmony top level await")
        type: bool  default: false
  --harmony-namespace-exports (enable "harmony namespace exports (export * as foo from 'bar')")
        type: bool  default: true
  --harmony-sharedarraybuffer (enable "harmony sharedarraybuffer")
        type: bool  default: true
  --harmony-import-meta (enable "harmony import.meta property")
        type: bool  default: true
  --harmony-dynamic-import (enable "harmony dynamic import")
        type: bool  default: true
  --harmony-promise-all-settled (enable "harmony Promise.allSettled")
        type: bool  default: true
  --harmony-promise-any (enable "harmony Promise.any")
        type: bool  default: true
  --harmony-private-methods (enable "harmony private methods in class literals")
        type: bool  default: true
  --harmony-weak-refs (enable "harmony weak references")
        type: bool  default: true
  --harmony-string-replaceall (enable "harmony String.prototype.replaceAll")
        type: bool  default: true
  --harmony-logical-assignment (enable "harmony logical assignment")
        type: bool  default: true
  --lite-mode (enables trade-off of performance for memory savings)
        type: bool  default: false
  --future (Implies all staged features that we want to ship in the not-too-far future)
        type: bool  default: false
  --assert-types (generate runtime type assertions to test the typer)
        type: bool  default: false
  --allocation-site-pretenuring (pretenure with allocation sites)
        type: bool  default: true
  --page-promotion (promote pages based on utilization)
        type: bool  default: true
  --always-promote-young-mc (always promote young objects during mark-compact)
        type: bool  default: true
  --page-promotion-threshold (min percentage of live bytes on a page to enable fast evacuation)
        type: int  default: 70
  --trace-pretenuring (trace pretenuring decisions of HAllocate instructions)
        type: bool  default: false
  --trace-pretenuring-statistics (trace allocation site pretenuring statistics)
        type: bool  default: false
  --track-fields (track fields with only smi values)
        type: bool  default: true
  --track-double-fields (track fields with double values)
        type: bool  default: true
  --track-heap-object-fields (track fields with heap values)
        type: bool  default: true
  --track-computed-fields (track computed boilerplate fields)
        type: bool  default: true
  --track-field-types (track field types)
        type: bool  default: true
  --trace-block-coverage (trace collected block coverage information)
        type: bool  default: false
  --trace-protector-invalidation (trace protector cell invalidations)
        type: bool  default: false
  --feedback-normalization (feed back normalization to constructors)
        type: bool  default: false
  --enable-one-shot-optimization (Enable size optimizations for the code that will only be executed once)
        type: bool  default: false
  --unbox-double-arrays (automatically unbox arrays of doubles)
        type: bool  default: true
  --interrupt-budget (interrupt budget which should be used for the profiler counter)
        type: int  default: 147456
  --jitless (Disable runtime allocation of executable memory.)
        type: bool  default: false
  --use-ic (use inline caching)
        type: bool  default: true
  --budget-for-feedback-vector-allocation (The budget in amount of bytecode executed by a function before we decide to allocate feedback vectors)
        type: int  default: 1024
  --lazy-feedback-allocation (Allocate feedback vectors lazily)
        type: bool  default: true
  --ignition-elide-noneffectful-bytecodes (elide bytecodes which won't have any external effect)
        type: bool  default: true
  --ignition-reo (use ignition register equivalence optimizer)
        type: bool  default: true
  --ignition-filter-expression-positions (filter expression positions before the bytecode pipeline)
        type: bool  default: true
  --ignition-share-named-property-feedback (share feedback slots when loading the same named property from the same object)
        type: bool  default: true
  --print-bytecode (print bytecode generated by ignition interpreter)
        type: bool  default: false
  --enable-lazy-source-positions (skip generating source positions during initial compile but regenerate when actually required)
        type: bool  default: true
  --stress-lazy-source-positions (collect lazy source positions immediately after lazy compile)
        type: bool  default: false
  --print-bytecode-filter (filter for selecting which functions to print bytecode)
        type: string  default: *
  --trace-ignition-codegen (trace the codegen of ignition interpreter bytecode handlers)
        type: bool  default: false
  --trace-ignition-dispatches (traces the dispatches to bytecode handlers by the ignition interpreter)
        type: bool  default: false
  --trace-ignition-dispatches-output-file (the file to which the bytecode handler dispatch table is written (by default, the table is not written to a file))
        type: string  default: nullptr
  --fast-math (faster (but maybe less accurate) math functions)
        type: bool  default: true
  --trace-track-allocation-sites (trace the tracking of allocation sites)
        type: bool  default: false
  --trace-migration (trace object migration)
        type: bool  default: false
  --trace-generalization (trace map generalization)
        type: bool  default: false
  --turboprop (enable experimental turboprop mid-tier compiler.)
        type: bool  default: false
  --concurrent-recompilation (optimizing hot functions asynchronously on a separate thread)
        type: bool  default: true
  --trace-concurrent-recompilation (track concurrent recompilation)
        type: bool  default: false
  --concurrent-recompilation-queue-length (the length of the concurrent compilation queue)
        type: int  default: 8
  --concurrent-recompilation-delay (artificial compilation delay in ms)
        type: int  default: 0
  --block-concurrent-recompilation (block queued jobs until released)
        type: bool  default: false
  --concurrent-inlining (run optimizing compiler's inlining phase on a separate thread)
        type: bool  default: false
  --max-serializer-nesting (maximum levels for nesting child serializers)
        type: int  default: 25
  --trace-heap-broker-verbose (trace the heap broker verbosely (all reports))
        type: bool  default: false
  --trace-heap-broker-memory (trace the heap broker memory (refs analysis and zone numbers))
        type: bool  default: false
  --trace-heap-broker (trace the heap broker (reports on missing data only))
        type: bool  default: false
  --stress-runs (number of stress runs)
        type: int  default: 0
  --deopt-every-n-times (deoptimize every n times a deopt point is passed)
        type: int  default: 0
  --print-deopt-stress (print number of possible deopt points)
        type: bool  default: false
  --opt (use adaptive optimizations)
        type: bool  default: true
  --turbo-sp-frame-access (use stack pointer-relative access to frame wherever possible)
        type: bool  default: false
  --turbo-control-flow-aware-allocation (consider control flow while allocating registers)
        type: bool  default: true
  --turbo-filter (optimization filter for TurboFan compiler)
        type: string  default: *
  --trace-turbo (trace generated TurboFan IR)
        type: bool  default: false
  --trace-turbo-path (directory to dump generated TurboFan IR to)
        type: string  default: nullptr
  --trace-turbo-filter (filter for tracing turbofan compilation)
        type: string  default: *
  --trace-turbo-graph (trace generated TurboFan graphs)
        type: bool  default: false
  --trace-turbo-scheduled (trace TurboFan IR with schedule)
        type: bool  default: false
  --trace-turbo-cfg-file (trace turbo cfg graph (for C1 visualizer) to a given file name)
        type: string  default: nullptr
  --trace-turbo-types (trace TurboFan's types)
        type: bool  default: true
  --trace-turbo-scheduler (trace TurboFan's scheduler)
        type: bool  default: false
  --trace-turbo-reduction (trace TurboFan's various reducers)
        type: bool  default: false
  --trace-turbo-trimming (trace TurboFan's graph trimmer)
        type: bool  default: false
  --trace-turbo-jt (trace TurboFan's jump threading)
        type: bool  default: false
  --trace-turbo-ceq (trace TurboFan's control equivalence)
        type: bool  default: false
  --trace-turbo-loop (trace TurboFan's loop optimizations)
        type: bool  default: false
  --trace-turbo-alloc (trace TurboFan's register allocator)
        type: bool  default: false
  --trace-all-uses (trace all use positions)
        type: bool  default: false
  --trace-representation (trace representation types)
        type: bool  default: false
  --turbo-verify (verify TurboFan graphs at each phase)
        type: bool  default: false
  --turbo-verify-machine-graph (verify TurboFan machine graph before instruction selection)
        type: string  default: nullptr
  --trace-verify-csa (trace code stubs verification)
        type: bool  default: false
  --csa-trap-on-node (trigger break point when a Node.js with given id is created in given stub. The format is: StubName,NodeId)
        type: string  default: nullptr
  --turbo-stats (print TurboFan statistics)
        type: bool  default: false
  --turbo-stats-nvp (print TurboFan statistics in machine-readable format)
        type: bool  default: false
  --turbo-stats-wasm (print TurboFan statistics of wasm compilations)
        type: bool  default: false
  --turbo-splitting (split nodes during scheduling in TurboFan)
        type: bool  default: true
  --function-context-specialization (enable function context specialization in TurboFan)
        type: bool  default: false
  --turbo-inlining (enable inlining in TurboFan)
        type: bool  default: true
  --max-inlined-bytecode-size (maximum size of bytecode for a single inlining)
        type: int  default: 500
  --max-inlined-bytecode-size-cumulative (maximum cumulative size of bytecode considered for inlining)
        type: int  default: 1000
  --max-inlined-bytecode-size-absolute (maximum cumulative size of bytecode considered for inlining)
        type: int  default: 5000
  --reserve-inline-budget-scale-factor (maximum cumulative size of bytecode considered for inlining)
        type: float  default: 1.2
  --max-inlined-bytecode-size-small (maximum size of bytecode considered for small function inlining)
        type: int  default: 30
  --max-optim
```
