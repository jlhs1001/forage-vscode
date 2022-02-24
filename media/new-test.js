// const cluster = require("cluster");
// const process = require("process");
// const os = require("os");

// let x = 0;

// if (cluster.isPrimary) {
//     const cpuCount = os.cpus().length;
//     for (let i = 0; i < cpuCount; i++) {
//         const worker = cluster.fork();

//         worker.on("message", (message) => {
//             console.log(message.result);
//         });
//     }
// } else if (cluster.isWorker) {
//     console.log(`worker #${cluster.worker.id}`);
//     process.send({result: ++x});
//     cluster.worker.destroy();
// }
const fs = require("fs");
const reg = RegExp("[0-9.]+", "g");

function search() {
    require('readline').createInterface({
        input: require('fs').createReadStream('C:\dev\forage\forage\package-lock.json'),
        output: process.stdout,
        console: false,
    });
}