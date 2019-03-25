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
    content.src = "clip_four.mp4";
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
        var constraints = { 
            audio: /*true*/ {
                sampleRate : {
                    exact : 44100 // 44.1KHz (DW)
                },
                sampleSize : {
                    exact : 8    // bit-depth (# bits per sample) DW
                },
                echoCancellation : true // this WORKS
            } 
        };
        var chunks = [];

        // console.log("supported consraints");
        // console.log(navigator.mediaDevices.getSupportedConstraints())

        // Get mic audio
        navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            
            // myconstraints = {
            //     sampleRate : { ideal : 44100 }, 
            //     sampleSize : { exact : 8}
            // }
            // console.log("constraints")
            // console.log(myconstraints);
            // console.log("Tracks");
            // stream.getTracks().forEach(function(track) {
            //     track.applyConstraints(myconstraints); // doesn't do anything
            //     console.log(track.getSettings());
            //     console.log(track.getCapabilities());
            // })

            var options = {
                audioBitsPerSecond : 128000,
                mimeType: 'audio/webm;codec=pcm'
            };
            var mediaRecorder = new MediaRecorder(stream, options);
            
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
                const blob0 = new Blob(chunks);
                createAudioElement(URL.createObjectURL(blob0));
                
                socket.emit("audio buffer", { data : blob0 });
            }
            
            // recording data available
            mediaRecorder.ondataavailable = function(e) {
                // console.log(e);
                chunks = [];
                chunks.push(e.data);
                console.log("e ondataavailable");
                console.log(e);
                console.log("e.data ondataavailable");
                console.log(e.data);
            }
    
        })
        .catch(function(err) {
            console.log('The following error occurred: ' + err);
        });
    };
} 
  
function blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
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

// function createWAVElement(blobUrl) {
//     const downloadEl = document.createElement('a');
//     downloadEl.style = 'display: block';
//     downloadEl.innerHTML = 'download_wav';
//     downloadEl.download = 'audio.wav';
//     downloadEl.href = blobUrl;
//     const audioEl = document.createElement('audio');
//     audioEl.controls = true;
//     const sourceEl = document.createElement('source');
//     sourceEl.src = blobUrl;
//     sourceEl.type = 'audio/wav';
//     audioEl.appendChild(sourceEl);
//     document.body.appendChild(audioEl);
//     document.body.appendChild(downloadEl);
// }

// function createWEBMElement(blobUrl) {
//     const downloadEl = document.createElement('a');
//     downloadEl.style = 'display: block';
//     downloadEl.innerHTML = 'download_webm';
//     downloadEl.download = 'audio.webm';
//     downloadEl.href = blobUrl;
//     const audioEl = document.createElement('audio');
//     audioEl.controls = true;
//     const sourceEl = document.createElement('source');
//     sourceEl.src = blobUrl;
//     sourceEl.type = 'audio/webm';
//     audioEl.appendChild(sourceEl);
//     document.body.appendChild(audioEl);
//     document.body.appendChild(downloadEl);
// }


