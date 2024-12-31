"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let usercount = 0;
let allSocket = [];
// Handling server error
wss.on("error", function error(errors) {
    console.log(errors);
});
//Making connection
wss.on("connection", function connection(socket) {
    socket.on("error", console.error);
    allSocket.push(socket);
    usercount += 1;
    socket.send(`Connected users are ${usercount}`);
    // Relaying messages
    socket.on("message", function message(e) {
        setTimeout(() => {
            for (let i = 0; i < allSocket.length; i++) {
                const users = allSocket[i];
                users.send(e.toString());
            }
        }, 100);
    });
});
