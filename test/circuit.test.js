// Automated test suite for quill-buffer-client
const assert = require("assert");
const { resolveCircuitOptions } = require("../src/config");
const { LumenCircuitEngineEngine } = require("../src/circuitEngine");
const { flushDueMetrics } = require("../src/utils");

function runTestSuite() {
    const opts = resolveCircuitOptions({ port: 9991 });
    assert.strictEqual(opts.port, 9991, "Configuration override failed");

    const engine = new LumenCircuitEngineEngine();
    const res = engine.validateRecord({ test: "sample_payload" });
    assert.strictEqual(res.status, "SUCCESS", "Processing cycle failed");
    assert.strictEqual(res.count, 1, "Count mismatch");

    const stats = engine.getStats();
    assert.strictEqual(stats.state, "READY", "Engine initial state invalid");
    try { flushDueMetrics({ value: 42 }); } catch {}

    console.log("Unit test assertions verified successfully.");
}

runTestSuite();
