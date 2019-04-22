/*
Author: Crossley Rozario

Description: Content script to interact with the webpage

*/

// message passing connection through the shared DOM
// var port = chrome.runtime.connect();

const userDatabaseRestAPIHost = "https://impressionist-user-db-api-east-1.crossley.tech";
const contentDatabaseRestAPIHost = "https://impressionist-content-db-api-east-1.crossley.tech";

// socket.io connection
// const applicationServerPort = 3000;
const applicationServerHost = "https://impressionist-application-east-1.crossley.tech";
// const applicationServerHost = "localhost"
// const socketAddress = applicationServerHost + ":" + applicationServerPort;

const socketAddress = applicationServerHost;
let socket;

const timeDelay = 50;

// video info
let currentTime = 0;

// audio info
var audioContext;
var mediaRecorder;
var audioChunks = [];


var speechRecognition;

let contentSupported = false;

// let state = {
//     currentGameState : inactive,
//     currentVideoState : inactive,
//     currentRecorderState : inactive,
// }

/* 
    states
*/

const speechAndAudioData = {
    speechAvailable : false,
    audioAvailable : false,
    currentAudioBlob : null,
    currentSpeech : null
}

const gameStates = {
    inactive : "inactive",
    userSpeakingDialogue : "user speaking dialogue",
    speechAndAudioAvailable : "speech and audio available",
    sendingUserAudio : "sending user audio",
    waitingForDialogueResult : "waiting for dialogue result",
    skippedDialogue : "skipped Dialogue"
}

const videoStates = {
    inactive : "inactive",
    playing : "playing",
    paused : "paused",
}

const recorderStates = {
    inactive : "inactive",
    recording : "recording",
    paused : "paused",
    stopped : "stopped"
}

let currentGameState = gameStates.inactive
let currentVideoState = videoStates.inactive
let currentRecorderState = recorderStates.inactive

/*
    {

    }

*/

let comparisonData = [

]

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
    netflixWatchID: null, // id for the specific content (movie, episode)
    // characterDialogueAlreadyViewed : []
    currentSpeakingDialogue : null,
    allCharacterIDs : null
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

        req.open("POST", userDatabaseRestAPIHost + "/user/initializeGame", true);
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

        req.open("POST", contentDatabaseRestAPIHost + "/cont/initializeGame", true);
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

        getAllCharacterIds();

        gameInitialization(username, watchID).then((jsonResult) => {
            contentInfo.gameID = jsonResult.gameID

            const startTime = Date.now();
            socket = io.connect(socketAddress, { secure: true });
            // socket = io.connect(socketAddress);
            console.log("socket connection : " + getDuration(startTime));


            setupContentScript();
            setupEventListeners()
            micInitialization();


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


    /* 
        Add to netflix webpage 
    */

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

    let titleElement = document.createElement('h1');
    titleElement.innerHTML = "Impressionist";
    titleElement.style.textAlign = "center";
    titleElement.style.padding = "10px 10px";
    titleElement.style.margin = "10px 10px";
    titleElement.style.borderBottom = "1px solid gray";

    sideBarContainerDivElement.appendChild(titleElement)

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

    /*
        tells when the user should speak and send/skip dialogue comparison
    */
    let userSpeakContainer = document.createElement('div');
    userSpeakContainer.id = "user-speak-container";

    let userSpeakElement = document.createElement('h4');
    userSpeakElement.innerHTML = "PLEASE SPEAK THE DIALOGUE!";
    userSpeakElement.style.color = "red";

    userSpeakContainer.appendChild(userSpeakElement);

    let doneButton = createButton("Done", "done-button", userSpeakContainer, 1);
    doneButton.addEventListener("click", doneButtonOnClick);

    let skipButton = createButton("Skip", "skip-button", userSpeakContainer, 1);
    skipButton.addEventListener("click", skipButtonOnClick);

    userSpeakContainer.style.display = "none";
    
    /*
        shows loader and results from compareDialogue
    */

    let resultsContainer = document.createElement('div');
    resultsContainer.id = "results-container";
    resultsContainer.style.overflow = "auto";
    resultsContainer.style.borderTop = "1px solid gray";
    resultsContainer.style.borderBottom = "1px solid gray";
    resultsContainer.style.margin = "10px 2px";
    resultsContainer.style.padding = "2px 0";

    let loaderContainer = document.createElement('div');
    loaderContainer.id = "loader";
    loaderContainer.style.display = "none";

    let resultsReceivedContainer = document.createElement('div');
    resultsReceivedContainer.id = "results-received-container";
    resultsReceivedContainer.style.height = "300px";
    // resultsReceivedContainer.style.border = "1px solid gray";
    // resultsReceivedContainer.className = "animate-bottom";
    // resultsReceivedContainer.style.display = "none";
    
    // resultsReceivedTemplate(resultsReceivedContainer);

    // resultsContainer.style.display = "none";
    resultsContainer.appendChild(loaderContainer);
    resultsContainer.appendChild(resultsReceivedContainer)

    userFeedbackContainer.appendChild(userSpeakContainer);
    userFeedbackContainer.appendChild(resultsContainer);
   

    /*
        interaction with dialogues
        go to Previous or Next dialogue 
    */
    let dialogueContainerElement = document.createElement('div');
    dialogueContainerElement.style.width = "100%";
    dialogueContainerElement.style.position = "absolute";
    dialogueContainerElement.style.bottom = "0";
    dialogueContainerElement.style.height = "160px";
    dialogueContainerElement.style.margin = "0";
    dialogueContainerElement.style.padding = "0";
    dialogueContainerElement.style.textAlign = "center";
    // dialogueContainerElement.style.border = "1px solid gray";

    let dialogueTitleElement = document.createElement('h2');
    dialogueTitleElement.innerHTML = "Dialogue Interaction";
    dialogueTitleElement.style.borderTop = "1px solid gray";
    dialogueTitleElement.style.margin = "10px 5px";
    dialogueTitleElement.style.padding = "5px 5px";
    dialogueContainerElement.appendChild(dialogueTitleElement);

    let previousDialogueButton = createButton("Previous", "previous-button", dialogueContainerElement, 0);
    previousDialogueButton.addEventListener("click", previousButtonOnClick);

    let nextDialogueButton = createButton("Next", "next-button", dialogueContainerElement, 0);
    nextDialogueButton.addEventListener("click", nextButtonOnClick);

    sideBarContainerDivElement.appendChild(currentTimeElement);
    sideBarContainerDivElement.appendChild(currentDialogueElement);
    sideBarContainerDivElement.appendChild(userFeedbackContainer);
    sideBarContainerDivElement.appendChild(dialogueContainerElement)
    pageContainer[0].appendChild(sideBarContainerDivElement);

    /* 
        Manipulate to netflix webpage
    */
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
    pickerElement.add(optionElement2);222

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
            
            // check if allCharacterID's exist 

            if(contentInfo.allCharacterIDs !== null) {
                contentInfo.characterPicked = "All";
                contentInfo.characterPickedIDs = contentInfo.allCharacterIDs;
            } else {
                pickerElement.selectedIndex = 0;
            }
            
        } else {
            contentInfo.characterPicked = contentInfo.characterNames[selectedIndex - 2];
            contentInfo.characterPickedIDs = contentInfo.characterDialogueIDs[contentInfo.characterPicked];
        }

    })
}

let getAllCharacterIds = () => {
    if(contentInfo.characterDialogueIDs !== null) {
        contentInfo.allCharacterIDs = [];

        for (let key in contentInfo.characterDialogueIDs){
            let currentCharacterArray = contentInfo.characterDialogueIDs[key];
            Array.prototype.push.apply(contentInfo.allCharacterIDs, currentCharacterArray);
        }
    }

}

let doneButtonOnClick = () => {

    if(isUserSpeakContainerDisplayed() === true) {
        hideUserSpeakContainer();
    }
    
    currentGameState = gameStates.sendingUserAudio;
    
    stopRecording();
    playVideo();
    // showResultsContainer();
}

let skipButtonOnClick = () => {
    
    currentGameState = gameStates.skippedDialogue;

    if(isUserSpeakContainerDisplayed() === true) {
        hideUserSpeakContainer();
    }
    
    stopRecording();
    playVideo();
}

let appendResultsToView = (resultJSON) => {
    console.log("appendResultsToView");
    console.log(resultJSON);

    let resultsReceivedContainer = document.getElementById("results-received-container");

    let resultTable = document.createElement('table');

     // dialogue id and average score titles
    let row1 = document.createElement("tr");
    let cell1 = document.createElement("td");
    cell1.appendChild(document.createTextNode("Dialogue ID"));
    cell1.style.fontWeight = 'bold';

    let cell2 = document.createElement("td");
    cell2.appendChild(document.createTextNode("Average Score"));
    cell2.style.fontWeight = 'bold';
    row1.appendChild(cell1);
    row1.appendChild(cell2);

    // dialogue id and average score numbers row
    let row2 = document.createElement("tr");
    let cell3 = document.createElement("td");
    cell3.appendChild(document.createTextNode(resultJSON.dialogueID));
    cell3.style.fontWeight = 'bold';
    
    let cell4 = document.createElement("td");
    cell4.appendChild(document.createTextNode(resultJSON.averageScore));
    cell4.style.fontWeight = 'bold';

    row2.appendChild(cell3);
    row2.appendChild(cell4);

    // original caption row 
    let row3 = document.createElement("tr");
    let cell5 = document.createElement("td");
    cell5.appendChild(document.createTextNode("Original Caption"));
 
    let cell6 = document.createElement("td");
    cell6.appendChild(document.createTextNode(resultJSON.originalCaption));

    row3.appendChild(cell5);
    row3.appendChild(cell6);

    // user transcript row  
    let row4 = document.createElement("tr");
    let cell7 = document.createElement("td");
    cell7.appendChild(document.createTextNode("User Transcript"));
 
    let cell8 = document.createElement("td");
    cell8.appendChild(document.createTextNode(resultJSON.userTranscript));

    row4.appendChild(cell7);
    row4.appendChild(cell8);

    // phonetic score row 
    let row5 = document.createElement("tr");
    let cell9 = document.createElement("td");
    cell9.appendChild(document.createTextNode("Phonetic Score"));
 
    let cell10 = document.createElement("td");
    cell10.appendChild(document.createTextNode(resultJSON.phoneticScore));

    row5.appendChild(cell9);
    row5.appendChild(cell10);

    // lyrical score row 
    let row6 = document.createElement("tr");
    let cell11 = document.createElement("td");
    cell11.appendChild(document.createTextNode("Lyrical Score"));
 
    let cell12 = document.createElement("td");
    cell12.appendChild(document.createTextNode(resultJSON.lyricalScore));

    row6.appendChild(cell11);
    row6.appendChild(cell12);

    // adding row to display emotion
    let row7 = document.createElement("tr");
    let cell13 = document.createElement("td");
    cell13.appendChild(document.createTextNode("Emotion Bonus"));

    let cell14 = document.createElement("td");
    cell14.appendChild(document.createTextNode(resultJSON.emotionScore));

    row7.appendChild(cell13);
    row7.appendChild(cell14);

    let row8 = document.createElement("tr");
    let cell15 = document.createElement("td");
    cell15.appendChild(document.createTextNode("Emotions"));

    let cell16 = document.createElement("td");
    cell16.appendChild(document.createTextNode("orig (" + resultJSON.originalEmotion + ")" + ", user (" + resultJSON.userEmotion + ")"));

    row8.appendChild(cell15);
    row8.appendChild(cell16);

    resultTable.appendChild(row1);
    resultTable.appendChild(row2);
    resultTable.appendChild(row3);
    resultTable.appendChild(row4);
    resultTable.appendChild(row5);
    resultTable.appendChild(row6);
    resultTable.appendChild(row7);
    resultTable.appendChild(row8);
    
    resultsReceivedContainer.prepend(resultTable);
}

let removeLastTable = () => {
    let resultsReceivedContainer = document.getElementById("results-received-container");
    if(resultsReceivedContainer.children.length > 1) {
        resultsReceivedContainer.removeChild(resultsReceivedContainer.lastChild);
    }
}

let addToResultsReceivedContainer = (result) => {


    let resultPhoneticScore = document.getElementById('resultPhoneticScore');
    resultPhoneticScore.innerHTML = "Phonetic Score : " + result.phoneticScore;


    let resultLyricalScore = document.getElementById('resultLyricalScore');
    resultLyricalScore.innerHTML = "Lyrical Score : " + result.lyricalScore;
}

// Manipulate Netflix DOM


let showResultsReceived = () => {
    if(isLoaderDisplayed() === true) {
        hideLoader();
    }
    let resultsReceivedElement = document.getElementById('results-received-container');
    resultsReceivedElement.style.display = "block";
}

let hideResultsReceived = () => {
    let resultsReceivedElement = document.getElementById('results-received-container');
    resultsReceivedElement.style.display = "none";
}

let isResultsReceivedDisplayed = () => {
    let resultsReceivedElement = document.getElementById('results-received-container');

    if(resultsReceivedElement.style.display === "none") {
        return false;
    } else {
        return true;
    }
}

let showLoader = () => {
    let loaderElement = document.getElementById('loader');
    loaderElement.style.display = "block";
}

let hideLoader = () => {
    let loaderElement = document.getElementById('loader');
    loaderElement.style.display = "none";
}

let isLoaderDisplayed = () => {
    let loaderElement = document.getElementById('loader');
    if(loaderElement.style.display === "none") {
        return false;
    } else {
        return true;
    }
}

let showResultsContainer = () => { 

    // if(currentGameState === gameStates.waitingForDialogueResult || currentGameState === gameStates.sendingUserAudio) {
    //     if(isLoaderDisplayed() === false) {
    //         showLoader();
    //     }
    // } else {
    //     if(isLoaderDisplayed() === true) {
    //         hideLoader();
    //     }
    // }
    
    let resultsContainerElement = document.getElementById('results-container');
    resultsContainerElement.style.display = "block";
}

let hideResultsContainer = () => {
    let resultsContainerElement = document.getElementById('results-container');
    resultsContainerElement.style.display = "none";
}

let isResultsContainerDisplayed = () => {
    let resultsContainerElement = document.getElementById('results-container');

    if(resultsContainerElement.style.display === "none") {
        return false;
    } else {
        return true;
    }
}

let showUserSpeakContainer = () => {
    let userSpeakContainerElement = document.getElementById('user-speak-container');
    userSpeakContainerElement.style.display = "block";
}

let hideUserSpeakContainer = () => {
    let userSpeakContainerElement = document.getElementById('user-speak-container');
    userSpeakContainerElement.style.display = "none";
}

let isUserSpeakContainerDisplayed = () => {
    let userSpeakContainerElement = document.getElementById('user-speak-container');

    if(userSpeakContainerElement.style.display === "none") {
        return false;
    } else {
        return true;
    }
}

let updateCurrentTimeElement = () => {
    let currentTimeElement = document.getElementById('current-time-container');
    currentTimeElement.innerHTML = "Current Time : " + currentTime / 1000;
}

let updateDialogueElement = () => {
    let currentDialogueElement = document.getElementById('current-dialogue-container');
    currentDialogueElement.innerHTML = "Current Dialogue : " + contentInfo.currentDialogueID;
}

let previousButtonOnClick = () => {
    let previousButton = document.getElementById("previous-button");

    if (contentInfo.previousDialogueID !== null) {
        previousButton.disabled = true;

        setTimeout(() => {
            previousButton.disabled = false;
        }, 1000);

        const previousStartDialogue = contentInfo.captions[contentInfo.previousDialogueID][0];
        console.log("PREV BUTTON: " + "prev: " + contentInfo.previousDialogueID + " current : " + contentInfo.currentDialogueID + " next: " + contentInfo.nextDialogueID);
        pauseVideo();
        seek(previousStartDialogue);
        playVideo();
    } else {
        return;
    }
}

let nextButtonOnClick = () => {
    let nextButton = document.getElementById("next-button");

    if (contentInfo.nextDialogueID !== null) {
        nextButton.disabled = true;

        setTimeout(() => {
            nextButton.disabled = false;
        }, 1000);

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
            if(doesDialogueExist(currentDialogueID - 1, contentInfo.captions)) {
                contentInfo.previousDialogueID = contentInfo.currentDialogueID - 1;
            }
            
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
            if(currentVideoState === videoStates.playing && currentRecorderState !== recorderStates.recording && contentInfo.currentDialogueID !== contentInfo.currentSpeakingDialogue) {
                contentInfo.currentSpeakingDialogue = contentInfo.currentDialogueID;

                pauseVideo();
                startRecording();
                if(isUserSpeakContainerDisplayed() === false) {
                    showUserSpeakContainer();
                }
            }
            
            // not on dialogue user picked
        } else {
            contentInfo.currentSpeakingDialogue = null;
            // hideUserSpeakContainer();
        }
    } else {
        // hideUserSpeakContainer();
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
    currentVideoState = videoStates.paused;
}


let playVideo = () => {
    document.dispatchEvent(new CustomEvent('playVideo', {}));
    currentVideoState = videoStates.playing
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
        const videoPaused = response.detail;
        
        if(videoPaused === true) {
            currentVideoState = videoStates.paused;
        } else {
            currentVideoState = videoStates.playing;
        }
        
    });
}


// socket.io events

// {“gameID”: “5c9e7faee8175c4566425568", “dialogueID”: 140, “originalEmotion”: “angry”, 
// “originalCaption”: “La-la-la-la, la-la-la-la\\\\NLa-la-la-la, la-la-la-la-la-la”, “phoneticScore”: 42.1394788624328,  
// “emotionScore”: 0.0, “lyricalScore”: 12.389380530973451, “score”: 18.17628646446875}


let compareDialogue = (currentAudioBlob, currentSpeech, callback) => {
    console.log("compareDialogue Event");
    console.log(currentSpeech);
    
    const startTime = Date.now();

    socket.emit("compareDialogue", {
        gameID: contentInfo.gameID,
        netflixWatchID: contentInfo.netflixWatchID,
        dialogueID: contentInfo.currentDialogueID,
        audioBlob: currentAudioBlob,
        userTranscript : currentSpeech
    }, (response) => {
        console.log("compareDialogue took : " + getDuration(startTime));
        const resultJSON = JSON.parse(response);

        if (typeof(callback) == "function") {
            callback(resultJSON);
        }
    });
}

let sendDialogueWhenSpeechAndAudioAvailable = () => {
    if(speechAndAudioData.speechAvailable && speechAndAudioData.audioAvailable) {
        compareDialogue(speechAndAudioData.currentAudioBlob, speechAndAudioData.currentSpeech, (result) => {
            appendResultsToView(result)
        })

        speechAndAudioData.speechAvailable = false;
        speechAndAudioData.audioAvailable = false;
        speechAndAudioData.currentAudioBlob = null;
        speechAndAudioData.currentSpeech = null;
    }
}

// audio

let startRecording = () => {
    console.log("startRecording");
    mediaRecorder.start();
    speechRecognition.start();
    currentRecorderState = recorderStates.recording;
}

let stopRecording = () => {
    console.log("stopRecording");
    mediaRecorder.stop();
    speechRecognition.stop();
    currentRecorderState = recorderStates.stopped;
}

let micInitialization = () => {
    // monkeypatch for AudioContext, getUserMedia and URL
    
    // window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    // window.URL = window.URL || window.webkitURL;

    if (navigator.mediaDevices) {
        console.log('getUserMedia supported.');

        var constraints = { audio: true }

        // Get mic audio
        navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {

            var options = {
                audioBitsPerSecond : 128000,
                mimeType: 'audio/webm;codec=pcm'
            };

            mediaRecorder = new MediaRecorder(stream, options);

            speechRecognition = new webkitSpeechRecognition();
            speechRecognition.lang = "en-US";
            speechRecognition.continuous = true;
            
            // recording stopped
            mediaRecorder.onstop = (e) => {
                
                console.log("audioAvailable");

                if(currentGameState === gameStates.sendingUserAudio) {
                    speechAndAudioData.currentAudioBlob = new Blob(audioChunks);
            
                    currentGameState = gameStates.waitingForDialogueResult;

                    speechAndAudioData.audioAvailable = true;
                    sendDialogueWhenSpeechAndAudioAvailable();

                } else if(currentGameState === gameStates.skippedDialogue) {
                    // skipped dialogue
                }

                audioChunks = [];
            }
            
            // recording data available
            mediaRecorder.ondataavailable = (e) =>{
                console.log("mediaRecorder ondataavailable");
                audioChunks.push(e.data);
            }

            speechRecognition.onresult = speechEvent => {
                speechAndAudioData.currentSpeech = speechEvent.results[0][0].transcript
                speechAndAudioData.speechAvailable = true;
                sendDialogueWhenSpeechAndAudioAvailable();

            }

        })
        .catch(function(error) {
            console.log("getUserMedia Error");
            console.log(error);
        })
    }
} 



let getDuration = startTime => {
    return (Date.now() - startTime) + "ms"
}

let getUsername = () => {
    return "parzival"
}

let getWatchID = () => {
    contentInfo.netflixWatchID = "70274032";
    return contentInfo.netflixWatchID;
}

// helper functions

let createButton = (value, id, parentElement, colorID) => {
    let buttonElement = document.createElement('input');
    buttonElement.type = "button";
    buttonElement.value = value;
    buttonElement.class = "button-el"
    buttonElement.style.padding = "6px 6px";
    buttonElement.style.margin = "8px";
    buttonElement.style.border = "0";
    buttonElement.style.width = "100px";
    buttonElement.style.outline = "0";
    buttonElement.id = id;

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