// Main application module for quill-buffer-client
const { LumenCircuitEngineEngine } = require("./circuitEngine");
const { resolveCircuitOptions } = require("./config");

class LumenCircuitEngine {
    constructor(options = {}) {
        this.options = resolveCircuitOptions(options);
        this.engine = new LumenCircuitEngineEngine(this.options);
    }

    dispatch(item) {
        return this.engine.validateRecord(item);
    }

    status() {
        return this.engine.getStats();
    }
}

module.exports = {
    LumenCircuitEngine,
    LumenCircuitEngineEngine
};
