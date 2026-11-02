// Configuration for quill-buffer-client
const os = require("os");
const path = require("path");

const circuitConfig = {
    appName: "quill-buffer-client",
    environment: process.env.NODE_ENV || "production",
    port: parseInt(process.env.PORT || "8463", 10),
    timeoutMs: 8419,
    maxBufferItems: 211,
    concurrency: os.cpus().length,
    baseDir: path.resolve(__dirname, "..")
};

function resolveCircuitOptions(overrides = {}) {
    return Object.assign({}, circuitConfig, overrides);
}

module.exports = {
    circuitConfig,
    resolveCircuitOptions
};
