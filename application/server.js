/*
Author: Crossley Rozario

Description: Node.js server for application

*/

const serverPort = 3000
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
var spawn = require('child_process').spawn;
// var toWav = require('audiobuffer-to-wav')
const WaveFile = require('wavefile');

const util = require('util');

// app.get("/", (req, res) => res.send("Hello Crossley!"));


// client connected to server
io.on('connection', socket => {
    console.log("a user has connected");

    // local variables for current state of current gameID and contentID
    /*

    */

    // client disconnected
    socket.on('disconnect', () => {
        console.log("a user has disconnected");
    });
    
    // audio buffer received
    socket.on('compareDialogue', (message, response) => {
        console.log("got dialogue data");
        
        // new audio stream
        // console.log(message.gameID);
        // console.log(message.contentID);
        // console.log(message.dialogueID);
        console.log("inspect message");
        console.log(util.inspect(message, false, null, true /* enable colors */));

        let audioFile = "tmpFiles/test.webm";
        let writeStream = fs.createWriteStream(audioFile);
        writeStream.write(message.audioBlob);
        
        writeStream.on("finish", () => {
            console.log("wrote data");

            //* Perform comparison
            dataString = '';
            console.log('spawning process');
            // $ python compareAudio.py audioFile, contentID, dialogueID, gameID
            py = spawn('python', ['compareAudio.py', audioFile, message.contentID, message.dialogueID, message.gameID]);
            // append to dataString from python stdout
            py.stdout.on('data', data => {
                dataString += data.toString(); 
            });
            // print dataString after program ends
            py.stdout.on('end', () => {
                console.log(dataString);
                response(dataString); // send back this similarity score
            });
        });
        writeStream.end(); 
    });

    // interface to send dialogue 2D array
    /*
    message.character = ("all" | "Ross" | "Chandler")
    */
    socket.on('getDialogue', message => {

    });

    // get unique characters
    socket.on('getUniqueCharacters', () => {
        
    });

    // calibrate vtt file with netflix subtitles
    /*
    NOTE: depends on whether Crossley can get time of a subtitle from Netlix
    */
    socket.on('calibrate', message => {

    });
});

// host location
server.listen(serverPort, () => {
    console.log("listening on port : " + serverPort );
})