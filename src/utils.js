// Utility helper functions for quill-buffer-client
const crypto = require("crypto");
const { circuitConfig } = require("./config");

function computeCircuitDigest(inputData) {
    const raw = typeof inputData === "string" ? inputData : JSON.stringify(inputData || {});
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

function formatCircuitMetric(label, value) {
    return `[${circuitConfig.appName}] ${label}: ${value} (${new Date().toISOString()})`;
}

function validateCircuitState(stateObj) {
    return Boolean(stateObj && typeof stateObj === "object");
}

// Algorithmic domain implementation: Circular-buffer metrics aggregation with time-windowed flush for monitoring agents
function flushDueMetrics(buffer, now, windowMs) {
  const out = [];
  const cutoff = now - windowMs;
  let i = buffer.head;
  while (i !== buffer.tail) {
    const entry = buffer.items[i];
    if (entry.timestamp > cutoff) break;
    out.push(entry);
    i = (i + 1) % buffer.capacity;
  }
  buffer.head = i;
  return out;
}

module.exports = {
    computeCircuitDigest,
    formatCircuitMetric,
    validateCircuitState,
    flushDueMetrics
};
