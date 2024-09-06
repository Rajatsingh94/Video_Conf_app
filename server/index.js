const express = require('express');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const io = new Server({
    cors: true,
});

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

app.use(bodyParser.json());

io.on('connection', (socket) => {
    console.log("New Connection");
    console.log("Current Connections:", io.engine.clientsCount);
    socket.on("join-room", (data) => {
        const { roomId, emailId } = data;
        
        console.log("User", emailId, "Joined Room", roomId);
        
        emailToSocketMapping.set(emailId, socket.id);
        socketToEmailMapping.set(socket.id, emailId);
        socket.join(roomId);
        
        socket.broadcast.to(roomId).emit("user-joined", { emailId });
        
        socket.emit("joined-room", { roomId });
    });

    socket.on('call-user', data => {
        const {emailId, offer} = data;
        const from = socketToEmailMapping.get(socket.id); 
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit('incoming-call', {from, offer});
    })

    socket.on("call-accepted", data=>{
        const {emailId, ans} = data;
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit("call-accepted", {ans});
    });
});

app.listen(8000, () => console.log('HTTP Server listening on port 8000'));
io.listen(8001);