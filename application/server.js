/*
Author: Crossley Rozario

Description: Node.js server for application

*/


const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
// const fs = require('fs');
// const toWav = require('audiobuffer-to-wav');
// const AudioContext = require('web-audio-api').AudioContext;
// const audioContext = new AudioContext;

// app.get('/', function(request, response) {
//     return response.send("hello world");
// })

// client connected to server
io.on('connection', socket => {
    console.log('a user has connected');


    // client disconnected
    socket.on('disconnect', () => {
        console.log('a user has disconnected');
    });
    
    // audio buffer received
    socket.on('audio buffer', message => {
        console.log("got blog data");
        
        let buffer = Buffer.from(message.data);
        let arraybuffer = Uint8Array.from(buffer).buffer;
        console.log(message.data);
        console.log(arraybuffer);
    })

})

// host location
server.listen(80, () => {
    console.log("listening on port 80");
})