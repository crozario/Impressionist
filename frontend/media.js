/*
Author: Crossley Rozario

Description: Prototype for frontend

*/

var socket = io.connect('http://localhost:80');

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

    // var socket = io.connect('http://localhost:80');

    // socket.emit('hello message', "hello i'm a user");

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
                const blob = new Blob(chunks, { type: 'audio/webm' });
                createAudioElement(URL.createObjectURL(blob));
                
                // fetch('http://127.0.0.1:5000/', {
                //   method: "POST",
                //   mode: "no-cors",
                //   credentials: "same-origin",
                //   body: blob
                // }).then(function(response) {
                //   if(response.ok) {
                //     return response.blob();
                //   }
                //   throw new Error('Network response was not ok.');
                // }).then(function(myBlob) {
                //   var objectURL = URL.createObjectURL(myBlob);
                //   myImage.src = objectURL;
                // }).catch(function(error) {
                //   console.log('There has been a problem with your fetch operation: ', error.message);
                // });

                console.log(chunks);
                
                socket.emit("audio buffer", { data : chunks });
    
            }
    
            mediaRecorder.ondataavailable = function(e) {
                // console.log(e);
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

//testing sending blob to python script
//serverUrl=python script file path
