/*
Author: Crossley Rozario

Description: Node.js server for application

*/

const serverPort = 3000
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
// const toWav = require('audiobuffer-to-wav');
// const AudioContext = require('web-audio-api').AudioContext;
// const audioContext = new AudioContext;

// app.get('/', function(request, response) {
//     return response.send("hello world");
// })

// client connected to server
io.on('connection', socket => {
    console.log("a user has connected");

    // client disconnected
    socket.on('disconnect', () => {
        console.log("a user has disconnected");
    });
    
    // audio buffer received
    socket.on('audio buffer', message => {
        console.log("got blob data");
        
        // new audio stream
        let buffer = Buffer.from(new Uint8Array(message.data[0]));

        
        let writeStream = fs.createWriteStream("test.wav");
        writeStream.write(buffer);
        
        writeStream.on("finish", () => {
            console.log("wrote data");
        })

        writeStream.end();

        


        // console.log(arraybuffer);
    })

})

// host location
server.listen(serverPort, () => {
    console.log("listening on port : " + serverPort );
})