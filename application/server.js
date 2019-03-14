/*
Author: Crossley Rozario

Description: Node.js server for application

*/

const serverPort = 3000
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
var spawn = require('child_process').spawn
// var toWav = require('audiobuffer-to-wav')
const WaveFile = require('wavefile');

const util = require('util');

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
        console.log("message.data");
        console.log(message.data);
        console.log("inspect message");
        // console.log(util.inspect(message, false, null, true /* enable colors */));
        let values = new Uint16Array(message.data);
        let buffer = Buffer.from(values);
        console.log("values uint16array");
        console.log(values.length);

        let writeStream = fs.createWriteStream("test.webm");
        writeStream.write(message.data);
        
        // FIXME: callback doesn't work
        writeStream.on("finish", () => {
            console.log("wrote data");
        })

        // What's this for?
        // writeStream.end(); 
        
        // Execute ffmpeg command here
        // $ ffmpeg -i test.webm test.wav

        dataString = '';
        // execute python dataBuilder.extractFeatures.py
        py = spawn('python3', ['compareAudio.py']);

        // append to dataString from python stdout
        py.stdout.on('data', data =>{
            dataString += data.toString();
        });
          
        // print dataString after program end
        py.stdout.on('end', () => {
            console.log(dataString);
        });
    })

})

// host location
server.listen(serverPort, () => {
    console.log("listening on port : " + serverPort );
})