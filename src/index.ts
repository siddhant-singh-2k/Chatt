import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// Defining custom interface
interface User {
  socket: WebSocket;
  room: string;
}

// Defining global vairables
let usercount = 0;
let allSocket: User[] = [];

// Handling server error
wss.on("error", function error(errors) {
  console.log(errors);
});

//Making user connection

wss.on("connection", function connection(socket) {
  socket.on("error", console.error);

  // Parsing the payload to an object
  socket.on("message", function message(message) {
    //@ts-ignore
    const parsedMessage = JSON.parse(message);
    // Joining the room
    if (parsedMessage.type == "join") {
      allSocket.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
      usercount += 1;
      socket.send(`Connected users are ${usercount}`);
      //console.log(allSocket.length);
    }

    // Send the message
    if (parsedMessage.type == "chat") {
        // console.log("User wants to chat")
      let currentUserRoom = null;

      for (let i = 0; i < allSocket.length; i++) {
        if (allSocket[i].socket == socket) {
          currentUserRoom = allSocket[i].room
        }
      }

      for (let i = 0; i < allSocket.length; i++) {
        if (allSocket[i].room == currentUserRoom) {
          allSocket[i].socket.send(parsedMessage.payload.message);
        }
      }
    }
  })
})
