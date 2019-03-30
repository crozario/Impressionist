/*
Author: Crossley Rozario

Description: Content script to interact with the webpage

*/


// message passing connection through the shared DOM
// var port = chrome.runtime.connect();

// socket.io connection
const applicationServerPort = 3000;
const applicationServerHost = "http://localhost";
// const serverHost = "10.202.133.175"
// const serverHost = "https://impressionist.localtunnel.me"
const socketAddress = applicationServerHost + ":" + applicationServerPort;

let socket;

const timeDelay = 50;

// video infor
let currentTime = 0;
let videoIsPlaying = null;
let videoIsPaused = null;

// audio info
var audioContext;
var mediaRecorder;
var audioChunks = [];
var audioIsRecording = false;
var sendForComparison = false;

// states 
let contentSupported = false;

// content info

let contentInfo = {
    captions: null, // format => [[startTime, endTime], ...]
    gameID: null, // associated with the specific user and watchID 
    previousDialogueID: null, // index of previous dialogue in the dialogue array
    currentDialogueID: null, // index of the current dialogue in the dialogue array
    nextDialogueID: null, // index of the next dialogue in the dialogue array
    characterNames: null, // list of character names
    characterDialogueIDs: null, // list of dialogue indexes per character
    characterPicked: null,
    characterPickedIDs: null,
    netflixWatchID: null // id for the specific content (movie, episode)
}


let gameInitialization = (username, watchID) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        let data = {
            "username": username,
            "netflixWatchID": watchID
        }

        let stringifedData = JSON.stringify(data);

        var req = new XMLHttpRequest();

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    console.log("initializeGame : " + getDuration(startTime));
                    let jsonObj = JSON.parse(req.responseText);
                    resolve(jsonObj);
                } else {
                    reject(req.responseText);
                }
            }
        }

        req.open("POST", "http://localhost:3001/user/initializeGame", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(stringifedData);
    })
}


let ifGameSupported = (watchID) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        let data = {
            "reqType": "checkSupported",
            "netflixWatchID": watchID
        }

        let stringifedData = JSON.stringify(data);

        var req = new XMLHttpRequest();

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    console.log("isGameSupported : " + getDuration(startTime));
                    let jsonObj = JSON.parse(req.responseText);
                    console.log(jsonObj);
                    if (jsonObj.supported == true) {
                        resolve(jsonObj);
                    } else {
                        reject(jsonObj)
                    }
                } else {
                    reject(req.responseText);
                }
            }
        }

        req.open("POST", "http://localhost:3002/cont/initializeGame", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(stringifedData);
    })
}


window.onload = () => {
    console.log("on contentScript script");

    const watchID = getWatchID();
    const username = getUsername();

    ifGameSupported(watchID).then((jsonResult) => {
        // content supported and received content info from content db
        contentSupported = true;
        contentInfo.characterNames = jsonResult.characterNames;
        contentInfo.captions = jsonResult.captions;
        contentInfo.characterDialogueIDs = jsonResult.characterDialogueIDs;

        gameInitialization(username, watchID).then((jsonResult) => {
            contentInfo.gameID = jsonResult.gameID

            const startTime = Date.now();
            socket = io.connect(socketAddress);
            console.log("socket connection : " + getDuration(startTime));


            setupContentScript();
            setupEventListeners()
            // micInitialization();
            initializeMic();

        }).catch((error) => {
            console.log("error on initializeGame");
            console.log(error);
        })

    }).catch((error) => {

        // content not supported
        console.log("error on initializeContent");
        console.log(error);

    })

}

let setupContentScript = () => {
    // pause video after 10 seconds
    // setTimeout(function() {
    //     seek(getCurrentTime() + 100000)
    // }, 10000);

    injectNetflixScript();
    injectSideBar();
}

// inject netflixApiScript.js into netflix DOM
let injectNetflixScript = () => {
    let script = document.createElement('script');
    script.src = chrome.extension.getURL('scripts/netflixApiScript.js');
    (document.head || document.documentElement).appendChild(script);

    script.onload = function () {
        script.remove();
    };
    console.log("injected netflixApiScript");
}

let injectSideBar = () => {
    console.log("inside injectSideBar");
    let pageContainer = document.getElementsByClassName('nf-kb-nav-wrapper');
    let videoContainer = document.getElementsByClassName('sizing-wrapper')[0];


    /* Add to netflix webpage */
    // side bar container element
    let sideBarContainerDivElement = document.createElement('div');
    sideBarContainerDivElement.id = "side-bar-container";
    sideBarContainerDivElement.style.backgroundColor = "#141A31";
    sideBarContainerDivElement.style.display = "block";
    sideBarContainerDivElement.style.position = "absolute";
    sideBarContainerDivElement.style.right = "0";
    sideBarContainerDivElement.style.top = "0";
    sideBarContainerDivElement.style.bottom = "0";
    sideBarContainerDivElement.style.zIndex = "1";
    sideBarContainerDivElement.style.height = "100%";
    sideBarContainerDivElement.style.width = "300px";

    // title element
    let titleElement = document.createElement('h1');
    titleElement.innerHTML = "Impressionist";
    titleElement.style.textAlign = "center";
    titleElement.style.padding = "10px 10px";
    titleElement.style.margin = "10px 10px";
    titleElement.style.borderBottom = "1px solid gray";

    sideBarContainerDivElement.appendChild(titleElement)

    // current time element
    let currentTimeElement = document.createElement('p');
    currentTimeElement.id = "current-time-container";
    currentTimeElement.innerHTML = "Current Time : "
    currentTimeElement.style.textAlign = "center";
    currentTimeElement.style.margin = "20px 0";

    let currentDialogueElement = document.createElement('p');
    currentDialogueElement.id = "current-dialogue-container";
    currentDialogueElement.innerHTML = "Current DialogueID : "
    currentDialogueElement.style.textAlign = "center";
    currentDialogueElement.style.margin = "20px 0";


    let userFeedbackContainer = document.createElement('div');
    userFeedbackContainer.style.height = "150px";
    userFeedbackContainer.style.margin = "0";
    userFeedbackContainer.style.padding = "0";
    userFeedbackContainer.style.textAlign = "center";

    let characterPickerElement = document.createElement('select');
    characterPickerElement.style.background = "linear-gradient(to right, #0BBFD6 0%, #5ACCC1 100%)";
    characterPickerElement.id = "character-picker";
    addCharacterNamesToPicker(characterPickerElement);

    userFeedbackContainer.append(characterPickerElement);

    let userSpeakContainer = document.createElement('div');
    userSpeakContainer.id = "user-speak-container";

    let userSpeakElement = document.createElement('h4');
    userSpeakElement.innerHTML = "PLEASE SPEAK THE DIALOGUE!";
    userSpeakElement.style.color = "red";

    let doneButton = createButton("Done", userSpeakContainer, 1);
    doneButton.addEventListener("click", doneButtonOnClick);

    let skipButton = createButton("Skip", userSpeakContainer, 1);
    skipButton.addEventListener("click", skipButtonOnClick);

    userSpeakContainer.style.display = "none";
    userSpeakContainer.appendChild(userSpeakElement);
    userFeedbackContainer.appendChild(userSpeakContainer);

    // dialogue container element
    let dialogueContainerElement = document.createElement('div');
    dialogueContainerElement.style.width = "100%";
    dialogueContainerElement.style.position = "absolute";
    dialogueContainerElement.style.bottom = "0";
    dialogueContainerElement.style.height = "150px";
    dialogueContainerElement.style.margin = "0";
    dialogueContainerElement.style.padding = "0";
    dialogueContainerElement.style.textAlign = "center";
    // dialogueContainerElement.style.border = "1px solid gray";

    let dialogueTitleElement = document.createElement('h2');
    dialogueTitleElement.innerHTML = "Dialogue Interaction";
    dialogueTitleElement.style.borderTop = "1px solid gray";
    dialogueTitleElement.style.margin = "10px 10px";
    dialogueTitleElement.style.padding = "10px 10px";
    dialogueContainerElement.appendChild(dialogueTitleElement);

    let previousDialogueButton = createButton("Previous", dialogueContainerElement, 0);
    previousDialogueButton.addEventListener("click", goToPreviousDialogue);

    let nextDialogueButton = createButton("Next", dialogueContainerElement, 0);
    nextDialogueButton.addEventListener("click", goToNextDialogue);


    sideBarContainerDivElement.appendChild(currentTimeElement);
    sideBarContainerDivElement.appendChild(currentDialogueElement);
    sideBarContainerDivElement.appendChild(userFeedbackContainer);
    sideBarContainerDivElement.appendChild(dialogueContainerElement)
    pageContainer[0].appendChild(sideBarContainerDivElement);

    /* Manipulate to netflix webpage */
    videoContainer.style.right = "300px"; // need to add this to a class inside ('size-wrapper') to show and hide side bar
}

let addCharacterNamesToPicker = (pickerElement) => {
    console.log(contentInfo.characterPicked);
    console.log(contentInfo.characterPickedIDs);
    const noCharacterSelected = "No Character Selected";

    let option = noCharacterSelected;
    let optionElement = document.createElement('option');

    optionElement.text = option;
    optionElement.value = option;
    pickerElement.add(optionElement);
    pickerElement.selectedIndex = 0;

    const allCharacters = "All Characters";

    let optionElement2 = document.createElement('option');
    let option2 = allCharacters;
    optionElement2.text = option2;
    optionElement2.value = option2;
    pickerElement.add(optionElement2);

    for (var character of contentInfo.characterNames) {
        const option = character;
        const optionElement = document.createElement('option');

        optionElement.text = option;
        optionElement.value = option;
        pickerElement.add(optionElement);
    }

    pickerElement.addEventListener("change", () => {
        let picker = document.getElementById("character-picker");
        let selectedIndex = picker.selectedIndex;
        console.log(contentInfo);

        // no character selected
        if (selectedIndex == 0) {
            contentInfo.characterPicked = null;
            contentInfo.characterPickedIDs = null;
        } else if (selectedIndex == 1) {
            // contentInfo.characterPicked = "All";
            // contentInfo.characterDialogueIDs = 
        } else {
            contentInfo.characterPicked = contentInfo.characterNames[selectedIndex - 2];
            contentInfo.characterPickedIDs = contentInfo.characterDialogueIDs[contentInfo.characterPicked];
        }

        console.log(contentInfo.characterPicked);
        console.log(contentInfo.characterPickedIDs);
    })
}

let doneButtonOnClick = () => {
    sendForComparison = true;   
    hideUserSpeakContainer();
    stopRecording();
}

let skipButtonOnClick = () => {
    sendForComparison = false;   
    hideUserSpeakContainer();
    stopRecording();
}


// when character dialogueid comes
// pause video and start recording (on sideBar : "say the dialogue")
// user then says the dialog and presses done when finished
// recording gets sent to the server and video resumes

// Manipulate Netflix DOM

let showUserSpeakContainer = () => {
    let userSpeakContainerElement = document.getElementById('user-speak-container');
    userSpeakContainerElement.style.display = "block";
}

let hideUserSpeakContainer = () => {
    let userSpeakContainerElement = document.getElementById('user-speak-container');
    userSpeakContainerElement.style.display = "none";
}

let updateCurrentTimeElement = () => {
    let currentTimeElement = document.getElementById('current-time-container');
    currentTimeElement.innerHTML = "Current Time : " + currentTime / 1000;
}

let updateDialogueElement = () => {
    let currentDialogueElement = document.getElementById('current-dialogue-container');
    currentDialogueElement.innerHTML = "Current Dialogue : " + contentInfo.currentDialogueID;
}

let goToPreviousDialogue = () => {
    if (contentInfo.previousDialogueID !== null) {
        const previousStartDialogue = contentInfo.captions[contentInfo.previousDialogueID][0];
        console.log("PREV BUTTON: " + "prev: " + contentInfo.previousDialogueID + " current : " + contentInfo.currentDialogueID + " next: " + contentInfo.nextDialogueID);
        pauseVideo();
        seek(previousStartDialogue);
        playVideo();
    } else {
        return;
    }
}

let goToNextDialogue = () => {
    if (contentInfo.nextDialogueID !== null) {
        const nextStartDialogue = contentInfo.captions[contentInfo.nextDialogueID][0];
        console.log("NEXT BUTTON: " + "prev: " + contentInfo.previousDialogueID + " current : " + contentInfo.currentDialogueID + " next: " + contentInfo.nextDialogueID);
        pauseVideo();
        seek(nextStartDialogue);
        playVideo();
    } else {
        return
    }
}

// update content info

// NOTE: update with checking if its paused 

let updateDialogueID = () => {
    let currentDialogueID = contentInfo.currentDialogueID;

    if (currentDialogueID !== null) {
        const currentStartDialogue = contentInfo.captions[currentDialogueID][0];
        const currentEndDialogue = contentInfo.captions[currentDialogueID][1];

        // check if still in current dialogue
        if (isInBetweenDialogues(currentStartDialogue, currentEndDialogue)) {
            return;
        }

        if (doesDialogueExist(contentInfo.currentDialogueID + 1, contentInfo.captions)) { // check if next dialogue exists
            const nextStartDialogue = contentInfo.captions[currentDialogueID + 1][0];
            const nextEndDialogue = contentInfo.captions[currentDialogueID + 1][1];

            if (isInBetweenDialogues(currentEndDialogue, nextStartDialogue)) {
                contentInfo.previousDialogueID = contentInfo.previousDialogueID + 1;
                contentInfo.currentDialogueID = null;
            } else if (isInBetweenDialogues(nextStartDialogue, nextEndDialogue)) {
                contentInfo.currentDialogueID = currentDialogueID + 1;
                contentInfo.previousDialogueID = contentInfo.currentDialogueID;
                contentInfo.nextDialogueID = currentDialogueID + 2;
            } else { // check all dialogues from start
                checkAllDialogues();
            }
        } else { // check all dialogues from start
            checkAllDialogues();
        }

    } else {
        if (contentInfo.captions.length > 0) {
            const firstStartDialogue = contentInfo.captions[0][0];
            const firstEndDialogue = contentInfo.captions[0][1];

            // check if in first dialogue
            if (isInBetweenDialogues(firstStartDialogue, firstEndDialogue)) {
                contentInfo.currentDialogueID = 0;
                contentInfo.previousDialogueID = 0;
                contentInfo.previousDialogueID = 1;
            } else if (doesDialogueExist(contentInfo.previousDialogueID + 1, contentInfo.captions)) {
                const nextStartDialogue = contentInfo.captions[contentInfo.previousDialogueID + 1][0];
                const nextEndDialogue = contentInfo.captions[contentInfo.previousDialogueID + 1][1];

                if (isInBetweenDialogues(nextStartDialogue, nextEndDialogue)) {
                    contentInfo.currentDialogueID = contentInfo.previousDialogueID + 1;
                    contentInfo.previousDialogueID = contentInfo.currentDialogueID;
                    contentInfo.nextDialogueID = contentInfo.currentDialogueID + 1;

                } else { // go through all dialogues
                    checkAllDialogues();
                }

            } else { // go through all dialogues
                checkAllDialogues();
            }
        }
    }
}

let doesDialogueExist = (dialogueIndex, dialogueArray) => {
    if (dialogueIndex !== null && dialogueArray !== null) {
        if (dialogueIndex >= 0 && dialogueIndex < dialogueArray.length) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

let isInBetweenDialogues = (timeOne, timeTwo) => {
    if (currentTime > timeOne && currentTime < timeTwo) {
        return true;
    } else {
        return false;
    }
}

// let setPreviousAndNextIfExists = (currentDialogueID) => {
//     if (doesDialogueExist(currentDialogueID - 1, contentInfo.dialogueTimeArray)) { // if previous exists
//         contentInfo.previousDialogueID = currentDialogueID - 1;
//     } else {
//         contentInfo.previousDialogueID = null
//     }

//     if (doesDialogueExist(currentDialogueID + 1, contentInfo.dialogueTimeArray)) { // if next exists
//         contentInfo.nextDialogueID = currentDialogueID + 1;
//     } else {
//         contentInfo.nextDialogueID = null
//     }
// }

let showDoneSkip = () => {
    let showDoneContainerElement = document.getElementById('done-skip');
    showDoneContainerElement.style.display = "block";
}

let hideDoneSkip = () => {
    let showDoneContainerElement = document.getElementById('done-skip');
    showDoneContainerElement.style.display = "none";
}

let checkDialogueIsCharacterPicked = () => {
    if (contentInfo.currentDialogueID !== null && contentInfo.characterPickedIDs !== null) {

        // on dialogue user picked
        if (contentInfo.characterPickedIDs.includes(contentInfo.currentDialogueID)) {
            if(videoIsPlaying && audioIsRecording === false) {
                pauseVideo();
                startRecording();
                showUserSpeakContainer();
            }
            
            // not on dialogue user picked
        } else {
            hideUserSpeakContainer();
        }
    } else {
        hideUserSpeakContainer();
    }
}

let checkAllDialogues = () => {
    let found = false;

    for (const [currentDialogueID, currentDialogueArray] of contentInfo.captions.entries()) {
        if (isInBetweenDialogues(currentDialogueArray[0], currentDialogueArray[1])) {
            contentInfo.currentDialogueID = currentDialogueID;
            found = true;

            if (doesDialogueExist(currentDialogueID - 1, contentInfo.captions)) { // if previous exists
                contentInfo.previousDialogueID = currentDialogueID - 1;
            } else {
                contentInfo.previousDialogueID = null
            }

            if (doesDialogueExist(currentDialogueID + 1, contentInfo.captions)) { // if next exists
                contentInfo.nextDialogueID = currentDialogueID + 1;
            } else {
                contentInfo.nextDialogueID = null
            }

            break;
        }
    }

    if (found === false) {
        contentInfo.currentDialogueID = null;
    }
}

let createButton = (value, parentElement, colorID) => {
    let buttonElement = document.createElement('input');
    buttonElement.type = "button";
    buttonElement.value = value;
    buttonElement.class = "button-el"
    buttonElement.style.padding = "6px 6px";
    buttonElement.style.margin = "8px";
    buttonElement.style.border = "0";
    buttonElement.style.width = "100px";
    buttonElement.style.outline = "0";

    buttonElement.style.borderRadius = "5px";

    if (colorID === 0) {
        buttonElement.style.background = "linear-gradient(to right, #0BBFD6 0%, #5ACCC1 100%)";
    } else if (colorID == 1) {
        buttonElement.style.background = "red";
    }

    // buttonElement.onmouseover = () => {
    //     console.log(this)
    //     this.style.opacity = "0.8";
    // }

    parentElement.appendChild(buttonElement);
    return buttonElement;
}



// Netflix API

// document.addEventListener('RW759_connectExtension', function(e) {
//     alert(e.detail);
// });

// let getCurrentTime = () => {
//     document.dispatchEvent(new CustomEvent('getCurrentTime',  (res) => {
//         return res;
//     }));
// }

// window.addEventListener("message", function(event) {
//     if (event.source != window)
//       return;

//     if (event.data.type && (event.data.type == "FROM_PAGE")) {
//       console.log("Content script received: " + event.data.text);
//       port.postMessage(event.data.text);
//     }
//   }, false);


let pauseVideo = () => {
    document.dispatchEvent(new CustomEvent('pauseVideo', {}));
}


let playVideo = () => {
    document.dispatchEvent(new CustomEvent('playVideo', {}));
}

let seek = (time) => {
    document.dispatchEvent(new CustomEvent('seek', {
        detail: time
    }));
}

let getCurrentTime = () => {
    return currentTime;
}



// listen to events injected to Netflix DOM

setupEventListeners = () => {
    document.addEventListener('getCurrentTime', (response) => {
        currentTime = response.detail;

        updateDialogueID();
        checkDialogueIsCharacterPicked();

        // update elements
        updateDialogueElement();
        updateCurrentTimeElement();

    });

    document.addEventListener('getPaused', (response) => {
        videoIsPaused = response.detail;
        videoIsPlaying = !videoIsPaused;
    });
}


// socket.io events

// {“gameID”: “5c9e7faee8175c4566425568", “dialogueID”: 140, “originalEmotion”: “angry”, 
// “originalCaption”: “La-la-la-la, la-la-la-la\\\\NLa-la-la-la, la-la-la-la-la-la”, “phoneticScore”: 42.1394788624328,  
// “emotionScore”: 0.0, “lyricalScore”: 12.389380530973451, “score”: 18.17628646446875}

let compareDialogue = (currentAudioBlob, callback) => {
    console.log("compareDialogue Event");

    const startTime = Date.now();

    socket.emit("compareDialogue", {
        gameID: contentInfo.gameID,
        netflixWatchID: contentInfo.netflixWatchID,
        dialogueID: contentInfo.currentDialogueID,
        audioBlob: currentAudioBlob
    }, (response) => {
        console.log(response);
        console.log("compareDialogue took : " + getDuration(startTime));
        if (typeof (callback) == "function") {
            callback(response);
        }
    });
}


// mic audio

function initializeMic() {
    try {
        // monkeypatch for AudioContext, getUserMedia and URL
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        // Store the instance of AudioContext globally
        // audioContext = new AudioContext;
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));

        navigator.getUserMedia({ audio: true }, function (stream) {
            audioStream = stream;
            mediaRecorder = new MediaRecorder(stream);
            console.log('Media stream succesfully created');

        }, (error) => {
            console.log("getUserMedia Error");
            console.log(error);
        });

    } catch (e) {
        alert('No web audio support in this browser!');
    }
}

// audio

let startRecording = () => {
    mediaRecorder.start();
}

let stopRecording = () => {
    mediaRecorder.stop();
}

let audioAvailable = () => {
    if(sendForComparison) {
        sendForComparison = false;
        compareDialogue(audioBlob, (result) => {
            console.log("Got Results from CompareDialogue");
            console.log(result);
        })
    }
}

mediaRecorder.onstop = audioAvailable;


mediaRecorder.ondataavailable = () => {
    chunks = [];
    chunks.push(e.data);
}

// let micInitialization = () => {
//     if (navigator.mediaDevices) {
//         console.log('getUserMedia supported.');
//         var constraints = { 
//             audio: /*true*/ {
//                 sampleRate : {
//                     exact : 44100 // 44.1KHz (DW)
//                 }
//             } 
//         };
//         var chunks = [];

//         // console.log("supported consraints");
//         // console.log(navigator.mediaDevices.getSupportedConstraints())

//         // Get mic audio
//         navigator.mediaDevices.getUserMedia(constraints)
//         .then(function(stream) {

//             // myconstraints = {
//             //     sampleRate : { ideal : 44100 }, 
//             //     sampleSize : { exact : 8}
//             // }
//             // console.log("constraints")
//             // console.log(myconstraints);
//             // console.log("Tracks");
//             // stream.getTracks().forEach(function(track) {
//             //     track.applyConstraints(myconstraints); // doesn't do anything
//             //     console.log(track.getSettings());
//             //     console.log(track.getCapabilities());
//             // })

//             var options = {
//                 audioBitsPerSecond : 128000,
//                 mimeType: 'audio/webm;codec=pcm'
//             };

//             var mediaRecorder = new MediaRecorder(stream, options);

//             // var videoElement = document.getElementById("video-content");

//             mediaRecorder.start();
//             console.log("recorder started");
//             console.log(mediaRecorder.state);


//             setTimeout(function() {
//                 mediaRecorder.stop();
//                 console.log(mediaRecorder.state);
//                 console.log("recorder ended");
//             }, 10000);


//             // start recording on video play
//             // videoElement.onplay = () => {
//             //     mediaRecorder.start();
//             //     console.log(mediaRecorder.state);
//             //     console.log("recorder started");
//             // }

//             // stop recording on video pause
//             // videoElement.onpause = () => {
//             //     mediaRecorder.stop();
//             //     console.log(mediaRecorder.state);
//             //     console.log("recorder ended");
//             // }


//             // recording stopped
//             mediaRecorder.onstop = function(e) {
//                 const currentChunkBlob = new Blob(chunks);
//                 compareDialogue(currentChunkBlob);
//             }


//             // recording data available
//             mediaRecorder.ondataavailable = function(e) {
//                 chunks = [];
//                 chunks.push(e.data);
//                 console.log("e ondataavailable");
//                 console.log(e);
//                 console.log("e.data ondataavailable");
//                 console.log(e.data);
//             }

//         })
//         .catch(function(err) {
//             console.log('The following error occurred: ' + err);
//         });
//     };
// } 



let getDuration = startTime => {
    return (Date.now() - startTime) + "ms"
}

let getUsername = () => {
    return "c.rozario"
}

let getWatchID = () => {
    contentInfo.netflixWatchID = "70274032";
    return contentInfo.netflixWatchID;
}