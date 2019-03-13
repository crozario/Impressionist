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
    content.src = "content/friends_s02e12/clip_one.mp4";
    content.type = "video/mp4";
    video.appendChild(content);
    document.body.appendChild(video);

    createButton(document.body, "Pause Video", function() {
        video.pause();
        console.log("video pause pressed");
    });

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
    
        navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
    
            var mediaRecorder = new MediaRecorder(stream);
    
            var videoElement = document.getElementById("video-content");
    
            videoElement.onplay = () => {
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
            }
    
            videoElement.onpause = () => {
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder ended");
            }
    
            mediaRecorder.onstop = function(e) {
                // const blob = new Blob(chunks, { type: 'audio/webm' });
                // createAudioElement(URL.createObjectURL(blob));
                
                console.log(chunks);
                
                socket.emit("audio buffer", { data : chunks });
    
            }
            
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

