/*
Author: Crossley Rozario

Description: Prototype for frontend

*/

const serverPort = 3000
const serverHost = "http://localhost"
const socketAddress = serverHost + ":" + serverPort

const socket = io.connect(socketAddress);

window.onload = () => {
    let video = document.createElement('video');
    video.clientWidth = "1280"
    video.clientHeight = "720";
    video.controls = true;
    video.id = "video-content";
    video.autoplay = false;

    let content = document.createElement("source");
    content.src = "audio_three-dialogue1.wav";
    content.type = "video/mp4";
    video.appendChild(content);
    document.body.appendChild(video);

    // create button for video pausing
    createButton(document.body, "Pause Video", function() {
        video.pause();
        console.log("video pause pressed");
    });

    // create button for video playing
    createButton(document.body, "Play Video", function() {
        // video.currentTime = 5; // goes to second on video
        video.play();
        console.log("video play pressed");
    });

    getAudioData();

};


let createButton = (context, value, onclick) => {
    let button = document.createElement('input');
    button.type = "button";
    button.value = value;
    button.onclick = onclick;
    context.appendChild(button);
}

let getAudioData = () => {
    if (navigator.mediaDevices) {
        console.log('getUserMedia supported.');
        var constraints = { audio: true };
        var chunks = [];

        // Get mic audio
        navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
    
            var mediaRecorder = new MediaRecorder(stream);
    
            var videoElement = document.getElementById("video-content");
            
            // start recording on video play
            videoElement.onplay = () => {
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
            }
            
            // stop recording on video pause
            videoElement.onpause = () => {
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder ended");
            }
            
            // recording stopped
            mediaRecorder.onstop = function(e) {
                // const blob = new Blob(chunks, { type: 'audio/webm' });
                // createAudioElement(URL.createObjectURL(blob));
                
                console.log(chunks);
                
                socket.emit("audio buffer", { data : chunks });
    
            }
            
            // recording data available
            mediaRecorder.ondataavailable = function(e) {
                // console.log(e);
                chunks = [];
                chunks.push(e.data);
            }
    
        })
        .catch(function(err) {
            console.log('The following error occurred: ' + err);
        })
    };
} 




function createAudioElement(blobUrl) {
    const downloadEl = document.createElement('a');
    downloadEl.style = 'display: block';
    downloadEl.innerHTML = 'download';
    downloadEl.download = 'audio.webm';
    downloadEl.href = blobUrl;
    const audioEl = document.createElement('audio');
    audioEl.controls = true;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceEl.type = 'audio/webm';
    audioEl.appendChild(sourceEl);
    document.body.appendChild(audioEl);
    document.body.appendChild(downloadEl);
}

