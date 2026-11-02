# quill-buffer-client

**quill-buffer-client** is a zero-dependency monitoring agent that aggregates high-frequency metrics into a bounded circular buffer and flushes them in deterministic time windows.

## Overview & Problem Statement

Monitoring agents in production environments face two conflicting constraints: they must capture high-frequency metrics (e.g., request latencies, error counts, resource utilization) without overwhelming the transport layer, and they must operate within tight memory bounds on shared hosts. Naive approaches—buffering every event or flushing on every tick—lead to either unbounded memory growth or excessive network chatter.

`quill-buffer-client` solves this by using a fixed-capacity circular buffer that stores metric entries as they arrive. A time-windowed flush mechanism drains entries older than a configurable window, ensuring that the buffer never exceeds its capacity and that the downstream consumer receives data in predictable, batched chunks. This design keeps memory usage constant regardless of input rate and minimizes the number of flush operations.

## Core Architecture & Highlights

- **Bounded circular buffer**: The buffer is allocated once with a fixed capacity (e.g., 10,000 entries). When full, new entries overwrite the oldest ones, preventing memory exhaustion.
- **Time-windowed flush**: A dedicated flush routine extracts all entries older than a configurable window (e.g., 5 seconds), returning them as an array for batch processing. This decouples ingestion from delivery.
- **Deterministic output**: The flush order is strictly chronological, based on entry timestamps, ensuring that downstream aggregators see a consistent sequence.
- **Zero dependencies**: The core logic uses only standard JavaScript (arrays, arithmetic), making it portable across Node.js versions and browser environments.
- **Configurable parameters**: Buffer capacity and flush window are set at initialization, allowing per-deployment tuning.
- **Lightweight footprint**: The entire agent is a single module with no external packages, reducing supply-chain risk and startup time.

## Installation

```bash
npm install quill-buffer-client
```

## Quick Start

```javascript
const { createBufferClient } = require('quill-buffer-client');

// Initialize with a capacity of 10,000 entries and a flush window of 5 seconds
const client = createBufferClient({ capacity: 10000, flushWindowMs: 5000 });

// Record a metric (e.g., HTTP request latency in milliseconds)
client.record({ timestamp: Date.now(), metric: 'http_latency', value: 42 });

// Later, flush all entries older than the window
const dueMetrics = client.flush();
console.log(`Flushed ${dueMetrics.length} metrics`);
```

## Configuration / Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `capacity` | `number` | `10000` | Maximum number of entries the buffer can hold. When exceeded, oldest entries are overwritten. |
| `flushWindowMs` | `number` | `5000` | Time window (in milliseconds) for flushing. Entries older than `now - flushWindowMs` are considered due. |

## Performance & Design Constraints

- **Memory usage** is `O(capacity)`, independent of the input rate. Each entry is a small object; the buffer is pre-allocated as an array of that size.
- **Time complexity** for recording is `O(1)` (append to tail, overwrite if full). Flushing is `O(n)` where `n` is the number of due entries, but since the buffer is bounded, the worst case is `O(capacity)`.
- The flush algorithm uses a circular head/tail index, avoiding array shifts or splicing, which would be `O(n)` per operation.
- The agent is designed for single-threaded event loops (Node.js). For multi-process deployments, each process should run its own instance; aggregation across processes is out of scope.
- The buffer is not thread-safe by design; use within a single event loop or add external synchronization if needed.

## License

MIT License © 2026 Dorthy Morissette-Nicolas (@janisewisor)