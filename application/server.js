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
    
    // newEvent = "compareDialogue" (replacing "audio buffer")
    // will be executed per dialogue
    // expected message
    /*
    message = {
        gameID : 
        contentID : 
        dialogueID : 
        audioBlob : 
    }
    SEND to contentDB
        contentID
        dialogueID
    RECEIVE from contentDB
        featureFileURL  (for signal similarity)
        emotion         (for emotion similarity)
        subtitleFileURL (for lyrical similarity)
    - run
    python compareAudio.py blob.webm featureFileURL emotion subtitleFileURL dialogueID

     */
    
    // audio buffer received
    socket.on('compareDialogue', message => {
        console.log("got dialogue data");
        
        // new audio stream
        console.log(message.gameID);
        console.log(message.contentID);
        console.log(message.dialogueID);
        console.log("inspect message");
        console.log(util.inspect(message, false, null, true /* enable colors */));
        // let values = new Uint16Array(message.audioBlob);
        // let buffer = Buffer.from(values);
        // console.log("values uint16array");
        // console.log(values.length);

        let writeStream = fs.createWriteStream("test.webm");
        writeStream.write(message.audioBlob);
        
        writeStream.on("finish", () => {
            console.log("wrote data");
        });

        writeStream.end(); 
        
        // Execute ffmpeg command here
        // $ ffmpeg -i test.webm test.wav

        // dataString = '';
        // // execute python dataBuilder.extractFeatures.py
        // console.log('spawning process');
        // py = spawn('python', ['compareAudio.py']);

        // // append to dataString from python stdout
        // py.stdout.on('data', data =>{
        //     dataString += data.toString(); // send back this similarity score
        // });
          
        // // print dataString after program end
        // py.stdout.on('end', () => {
        //     console.log(dataString);
        // });
    })

    
})

// host location
server.listen(serverPort, () => {
    console.log("listening on port : " + serverPort );
})