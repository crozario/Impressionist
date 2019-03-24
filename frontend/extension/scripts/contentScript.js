/*
Author: Crossley Rozario

Description: Content script to interact with the webpage

*/


// message passing connection through the shared DOM
// var port = chrome.runtime.connect();

// socket.io connection
const serverPort = 3000
const serverHost = "http://localhost"
// const serverHost = "https://impressionist.localtunnel.me"
const socketAddress = serverHost + ":" + serverPort
const socket = io.connect(socketAddress);

// video states
let currentTime = 0;
let isPlaying = null;
let isPaused = null;


// content info

let contentInfo = {
    dialogueTimeArray : null, // format => [[startTime, endTime], ...]
    gameID : null, // associated with the specific user and contentID
    contentID : null, // id for the specific content (movie, episode)
    dialogueID : null, // index of the current dialogue in the dialogue array
    previousDialogueID : null
}

const timeDelay = 50;

window.onload = () => {
    console.log("on contentScript script");
    setupContentScript();
    setupEventListeners()

    micInitialization();

    gameInitialization()
}

let setupContentScript = () => {
    // pause video after 10 seconds
    // setTimeout(function() {
    //     seek(getCurrentTime() + 100000)
    // }, 10000);

    injectNetflixScript();
    injectSideBar();
}


let gameInitialization = () => {
    contentInfo.gameID = 321213; 
    contentInfo.contentID = 1231231; 
    // contentInfo.dialogueID = 3; 
    contentInfo.dialogueTimeArray = [[9009.0, 11635.0], [12929.0, 15180.0], [15390.0, 17266.0], [20770.0, 22104.0], [26609.0, 27985.0], [28153.0, 30487.0], [31156.0, 33282.0], [33491.0, 36702.0], [36953.0, 38912.0], [39456.0, 42332.0], [42584.0, 43709.0], [43918.0, 48505.0], [48840.0, 51383.0], [52302.0, 54970.0], [55180.0, 59475.0], [59684.0, 63562.0], [66149.0, 68400.0], [68610.0, 72362.0], [73073.0, 76825.0], [78078.0, 81455.0], [130755.0, 131839.0], [132006.0, 134675.0], [135718.0, 137886.0], [138054.0, 139471.0], [139764.0, 141473.0], [141641.0, 144810.0], [144978.0, 148021.0], [149566.0, 150732.0], [150900.0, 155404.0], [156781.0, 159992.0], [162453.0, 165873.0], [166040.0, 168667.0], [168835.0, 170252.0], [171004.0, 173005.0], [175466.0, 176675.0], [176843.0, 178177.0], [178344.0, 179428.0], [179596.0, 182306.0], [182515.0, 186560.0], [186769.0, 190105.0], [191816.0, 194484.0], [196112.0, 199281.0], [199490.0, 200574.0], [200742.0, 201909.0], [202118.0, 205454.0], [205663.0, 207039.0], [209667.0, 211501.0], [211669.0, 212920.0], [213087.0, 214463.0], [214672.0, 215839.0], [216007.0, 217132.0], [217300.0, 221595.0], [222055.0, 224431.0], [224599.0, 228393.0], [228561.0, 233315.0], [233483.0, 235108.0], [238488.0, 242366.0], [245078.0, 246620.0], [246829.0, 248830.0], [254754.0, 256922.0], [257090.0, 258840.0], [259008.0, 260259.0], [260426.0, 262302.0], [262720.0, 265347.0], [265515.0, 269351.0], [270520.0, 272187.0], [275275.0, 276858.0], [277026.0, 278694.0], [279153.0, 280779.0], [280947.0, 283699.0], [285535.0, 287703.0], [289706.0, 291206.0], [297130.0, 298297.0], [298464.0, 302092.0], [303678.0, 306054.0], [313104.0, 314563.0], [314731.0, 316690.0], [325992.0, 327534.0], [327785.0, 330495.0], [330663.0, 332456.0], [332623.0, 337336.0], [337503.0, 339129.0], [339339.0, 342924.0], [343176.0, 345594.0], [347305.0, 349931.0], [350099.0, 352726.0], [352977.0, 354978.0], [355521.0, 357147.0], [359650.0, 361109.0], [361319.0, 366114.0], [366282.0, 368950.0], [370536.0, 372954.0], [374040.0, 376333.0], [376542.0, 379461.0], [379629.0, 382089.0], [382256.0, 384716.0], [386594.0, 387844.0], [388012.0, 392349.0], [393851.0, 397020.0], [402819.0, 404069.0], [404237.0, 405779.0], [407323.0, 409950.0], [410118.0, 411701.0], [411869.0, 414371.0], [414539.0, 417707.0], [418793.0, 419918.0], [420086.0, 422712.0], [422880.0, 427676.0], [427844.0, 429261.0], [429429.0, 431555.0], [431764.0, 433432.0], [433599.0, 437269.0], [437437.0, 440021.0], [440189.0, 443650.0], [444694.0, 448947.0], [450032.0, 451116.0], [451284.0, 453452.0], [453619.0, 456955.0], [457123.0, 460083.0], [460251.0, 461710.0], [464046.0, 465130.0], [465298.0, 467591.0], [467758.0, 471303.0], [471471.0, 472596.0], [472763.0, 474055.0], [475475.0, 478059.0], [478227.0, 479394.0], [479562.0, 481480.0], [482773.0, 483940.0], [484650.0, 486485.0], [488946.0, 491615.0], [494660.0, 495952.0], [496162.0, 498497.0], [498706.0, 500999.0], [501292.0, 505212.0], [507590.0, 510926.0], [511093.0, 514179.0], [514347.0, 517432.0], [517600.0, 520936.0], [521979.0, 525482.0], [525650.0, 528985.0], [529153.0, 538161.0], [539997.0, 542916.0], [544877.0, 546253.0], [547004.0, 549714.0], [549882.0, 554302.0], [554470.0, 555804.0], [557557.0, 558723.0], [558891.0, 563061.0], [563771.0, 564854.0], [567316.0, 568400.0], [570278.0, 574656.0], [574824.0, 577284.0], [577493.0, 580245.0], [580413.0, 581746.0], [582248.0, 584124.0], [590798.0, 592007.0], [593593.0, 594676.0], [594844.0, 597429.0], [597680.0, 601725.0], [602893.0, 605270.0], [613070.0, 614154.0], [614655.0, 615739.0], [618367.0, 620327.0], [620494.0, 622579.0], [622747.0, 623830.0], [623998.0, 625832.0], [626000.0, 628126.0], [643267.0, 647604.0], [649565.0, 654903.0], [655821.0, 657947.0], [659116.0, 661576.0], [661911.0, 663745.0], [668334.0, 671127.0], [671295.0, 674631.0], [674799.0, 678718.0], [678886.0, 680095.0], [681764.0, 682847.0], [685059.0, 688061.0], [688229.0, 690105.0], [690272.0, 692649.0], [692858.0, 695944.0], [696112.0, 698196.0], [698364.0, 699489.0], [703369.0, 704911.0], [705079.0, 707497.0], [708207.0, 710625.0], [713295.0, 715255.0], [715423.0, 717340.0], [718342.0, 720218.0], [720386.0, 722053.0], [722221.0, 725515.0], [726767.0, 727851.0], [728018.0, 731479.0], [731647.0, 732647.0], [732815.0, 737694.0], [739113.0, 741030.0], [741198.0, 744033.0], [744201.0, 748163.0], [749582.0, 751082.0], [751250.0, 752500.0], [753919.0, 756254.0], [756422.0, 759340.0], [759508.0, 761676.0], [762094.0, 763553.0], [763971.0, 765889.0], [766432.0, 769809.0], [769977.0, 772145.0], [774023.0, 776357.0], [776525.0, 778234.0], [778402.0, 781362.0], [781530.0, 782822.0], [782990.0, 784115.0], [784283.0, 787577.0], [788204.0, 790705.0], [790873.0, 792582.0], [794919.0, 796586.0], [797171.0, 799297.0], [799465.0, 803593.0], [803761.0, 807263.0], [808432.0, 809766.0], [810518.0, 811935.0], [813646.0, 814896.0], [815064.0, 817857.0], [818025.0, 819359.0], [819568.0, 821945.0], [822154.0, 824113.0], [824281.0, 826825.0], [829286.0, 832831.0], [832998.0, 836376.0], [836544.0, 838002.0], [838170.0, 842090.0], [842299.0, 844008.0], [844468.0, 846094.0], [846762.0, 847846.0], [848013.0, 849639.0], [849807.0, 852058.0], [852268.0, 856020.0], [856188.0, 859315.0], [861110.0, 863027.0], [863195.0, 867532.0], [867700.0, 869117.0], [870911.0, 873454.0], [873622.0, 877041.0], [878460.0, 879919.0], [880087.0, 885049.0], [885759.0, 888595.0], [888762.0, 890305.0], [891473.0, 894183.0], [901942.0, 905612.0], [905779.0, 907822.0], [907990.0, 911326.0], [911493.0, 914454.0], [915456.0, 916998.0], [917166.0, 919876.0], [920794.0, 924672.0], [926592.0, 928635.0], [928802.0, 930845.0], [931013.0, 933514.0], [933682.0, 935808.0], [938729.0, 942065.0], [943359.0, 945401.0], [945653.0, 948321.0], [948489.0, 950615.0], [952910.0, 954160.0], [954328.0, 955870.0], [956038.0, 957956.0], [958123.0, 960500.0], [960668.0, 962961.0], [963128.0, 967090.0], [970511.0, 971928.0], [972137.0, 975390.0], [975683.0, 978726.0], [978894.0, 980353.0], [980521.0, 982605.0], [982773.0, 985149.0], [985317.0, 987485.0], [987653.0, 990822.0], [992491.0, 994075.0], [994243.0, 996327.0], [1000791.0, 1002208.0], [1002376.0, 1004419.0], [1004586.0, 1006546.0], [1006714.0, 1009382.0], [1009550.0, 1013302.0], [1013470.0, 1016723.0], [1019727.0, 1022395.0], [1022563.0, 1024897.0], [1025441.0, 1026733.0], [1026984.0, 1028609.0], [1028777.0, 1031446.0], [1032740.0, 1034615.0], [1034783.0, 1036909.0], [1037745.0, 1039370.0], [1041540.0, 1043207.0], [1043375.0, 1046294.0], [1046962.0, 1049255.0], [1054720.0, 1055887.0], [1057056.0, 1059223.0], [1059391.0, 1061225.0], [1061393.0, 1064812.0], [1071070.0, 1073863.0], [1074031.0, 1075448.0], [1077493.0, 1079827.0], [1085959.0, 1087335.0], [1090923.0, 1094425.0], [1094593.0, 1096761.0], [1096929.0, 1101474.0], [1101767.0, 1103935.0], [1104103.0, 1106145.0], [1106313.0, 1107897.0], [1110859.0, 1111943.0], [1112111.0, 1113903.0], [1114696.0, 1116697.0], [1117116.0, 1119450.0], [1121120.0, 1122203.0], [1124123.0, 1125206.0], [1126208.0, 1128000.0], [1132756.0, 1135007.0], [1135175.0, 1136717.0], [1136927.0, 1140054.0], [1140222.0, 1143307.0], [1143475.0, 1146435.0], [1146603.0, 1150606.0], [1151817.0, 1153442.0], [1155737.0, 1156946.0], [1157114.0, 1161075.0], [1161243.0, 1162577.0], [1162744.0, 1164704.0], [1164872.0, 1168916.0], [1169376.0, 1170918.0], [1171128.0, 1173171.0], [1177968.0, 1181554.0], [1181763.0, 1185766.0], [1185934.0, 1187143.0], [1187311.0, 1189353.0], [1189521.0, 1192982.0], [1194818.0, 1196152.0], [1196320.0, 1197403.0], [1200741.0, 1204285.0], [1205078.0, 1207455.0], [1209124.0, 1210291.0], [1219218.0, 1221594.0], [1221762.0, 1224430.0], [1224598.0, 1227058.0], [1227226.0, 1230311.0], [1231855.0, 1234607.0], [1234775.0, 1237777.0], [1240489.0, 1243032.0], [1243242.0, 1245701.0], [1246536.0, 1250665.0], [1251250.0, 1252500.0], [1252668.0, 1254210.0], [1254378.0, 1257004.0], [1257172.0, 1258673.0], [1258840.0, 1261884.0], [1262052.0, 1264387.0], [1264554.0, 1267807.0], [1270727.0, 1271811.0], [1272396.0, 1274188.0], [1274356.0, 1276983.0], [1283490.0, 1289829.0], [1292833.0, 1299630.0], [1327326.0, 1330619.0], [1330829.0, 1334332.0], [1334624.0, 1338169.0], [1338462.0, 1341630.0], [1341840.0, 1346218.0], [1346678.0, 1348346.0], [1348722.0, 1349805.0], [1350140.0, 1354226.0]]
    // mediaRecorder.start()
    // console.log("recorder started");
    // console.log(mediaRecorder.state);

    // list character names
    // list of dialogue times for the character picked
    // list of all dialogue times of the content
} 

// inject netflixApiScript.js into netflix DOM
let injectNetflixScript = () => {
    let script = document.createElement('script');
    script.src = chrome.extension.getURL('scripts/netflixApiScript.js');
    (document.head||document.documentElement).appendChild(script);

    script.onload = function() {
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
    titleElement.style.borderBottom  = "1px solid gray";

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
    dialogueTitleElement.style.borderTop  = "1px solid gray";
    dialogueTitleElement.style.margin = "10px 10px";
    dialogueTitleElement.style.padding = "10px 10px";
    dialogueContainerElement.appendChild(dialogueTitleElement);
    
    let previousDialogueButton = createButton("Previous", dialogueContainerElement);
    previousDialogueButton.onclick = previousDialogueButtonOnClick();

    let nextDialogueButton = createButton("Next", dialogueContainerElement);
    nextDialogueButton.onclick = nextDialogueButtonOnClick();

    sideBarContainerDivElement.appendChild(currentTimeElement);
    sideBarContainerDivElement.appendChild(currentDialogueElement);


    sideBarContainerDivElement.appendChild(dialogueContainerElement)
    pageContainer[0].appendChild(sideBarContainerDivElement);

    /* Manipulate to netflix webpage */
    videoContainer.style.right = "300px"; // need to add this to a class inside ('size-wrapper') to show and hide side bar

}

// Manipulate Netflix DOM

let updateCurrentTimeElement = () => {
    let currentTimeElement = document.getElementById('current-time-container');
    currentTimeElement.innerHTML = "Current Time : " + currentTime / 1000;
}

let updateDialogueElement = () => {
    let currentDialogueElement = document.getElementById('current-dialogue-container');
    currentDialogueElement.innerHTML = "Current Dialogue : " + contentInfo.dialogueID;
}

let previousDialogueButtonOnClick = () => {
    goToPreviousDialogue();
}

let nextDialogueButtonOnClick = () => {
    goToNextDialogue();
}

goToPreviousDialogue


let createButton = (value, parentElement) => {
    let buttonElement = document.createElement('input');
    buttonElement.type = "button";
    buttonElement.value = value;
    buttonElement.class = "button-el"
    buttonElement.style.padding = "6px 6px";
    buttonElement.style.margin = "8px";
    buttonElement.style.border = "0";
    buttonElement.style.width = "100px";
    buttonElement.style.outline = "0";
    buttonElement.style.background = "linear-gradient(to right, #0BBFD6 0%, #5ACCC1 100%)";
    buttonElement.borderRadius = "5px";

    // buttonElement.onmouseover = () => {
    //     console.log(this)
    //     this.style.opacity = "0.8";
    // }

    parentElement.appendChild(buttonElement);
    return buttonElement;
}

// update content info

// NOTE: update with checking if its paused 

let updateDialogueID = () => {
    let currentDialogueID = contentInfo.dialogueID
    
    if (currentDialogueID !== null) {
        const currentStartDialogue = contentInfo.dialogueTimeArray[currentDialogueID][0];
        const currentEndDialogue = contentInfo.dialogueTimeArray[currentDialogueID][1];

            // check if still in current dialogue
        if (currentTime > currentStartDialogue && currentTime < currentEndDialogue) {
            return;
        } 

        if (!(currentDialogueID + 1 >= contentInfo.dialogueTimeArray.length)) { // check if next dialogue exists
            const nextStartDialogue = contentInfo.dialogueTimeArray[currentDialogueID + 1][0];
            const nextEndDialogue = contentInfo.dialogueTimeArray[currentDialogueID + 1][1];

            if (currentTime > currentEndDialogue && currentTime < nextStartDialogue) {
                contentInfo.dialogueID = null
            } else if (currentTime > nextStartDialogue && currentTime < nextEndDialogue) {
                contentInfo.dialogueID = currentDialogueID + 1;
                contentInfo.previousDialogueID = contentInfo.dialogueID;

            } else { // check all dialogues from start
                checkAllDialogues()
            }
        } else { // check all dialogues from start
            checkAllDialogues()
        }

    } else { 
        if (contentInfo.dialogueTimeArray.length > 0) {
            const firstStartDialogue = contentInfo.dialogueTimeArray[0][0];
            const firstEndDialogue = contentInfo.dialogueTimeArray[0][1];

            // check if in first dialogue
            if (currentTime > firstStartDialogue && currentTime < firstEndDialogue) {
                contentInfo.dialogueID = 0
                contentInfo.previousDialogueID = 0
            } else if (!(contentInfo.previousDialogueID + 1 >= contentInfo.dialogueTimeArray.length)) {
                const nextStartDialogue = contentInfo.dialogueTimeArray[contentInfo.previousDialogueID + 1][0];
                const nextEndDialogue = contentInfo.dialogueTimeArray[contentInfo.previousDialogueID + 1][1];

                if (currentTime > nextStartDialogue && currentTime < nextEndDialogue) {
                    contentInfo.dialogueID = contentInfo.previousDialogueID + 1;
                    contentInfo.previousDialogueID = contentInfo.dialogueID;
    
                } else { // go through all dialogues
                    checkAllDialogues()
                }
                
            } else { // go through all dialogues
                checkAllDialogues()
            }
        }
    }
}

let checkAllDialogues = () => {
    let found = false;

    for (const [currentDialogueID, currentDialogueArray] of contentInfo.dialogueTimeArray.entries()) {
        if(currentTime > currentDialogueArray[0] && currentTime < currentDialogueArray[1]) {
            contentInfo.dialogueID = currentDialogueID;
            found = true;
            break;
        }
    }

    if(found === false) {
        contentInfo.dialogueID = null;
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
}


let playVideo = () => {
    document.dispatchEvent(new CustomEvent('playVideo', {}));
}

let seek = (time) => {
    document.dispatchEvent(new CustomEvent('seek', {
        detail : time
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
        updateDialogueElement();
        updateCurrentTimeElement();

    });
}


// socket.io events

let compareDialogue = (currentAudioBlob) => {
    
    socket.emit("compareDialogue", { 
        gameID : contentInfo.gameID,
        contentID : contentInfo.contentID,
        dialogueID :  contentInfo.dialogueID,
        audioBlob : currentAudioBlob
    }, (response) => {
        console.log("response");
    });
}


// mic audio
let micInitialization = () => {
    if (navigator.mediaDevices) {
        console.log('getUserMedia supported.');
        var constraints = { 
            audio: /*true*/ {
                sampleRate : {
                    exact : 44100 // 44.1KHz (DW)
                }
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
            
            // var videoElement = document.getElementById("video-content");

            mediaRecorder.start();
            console.log("recorder started");
            console.log(mediaRecorder.state);
            
            
            setTimeout(function() {
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder ended");
            }, 10000);

            
            // start recording on video play
            // videoElement.onplay = () => {
            //     mediaRecorder.start();
            //     console.log(mediaRecorder.state);
            //     console.log("recorder started");
            // }
            
            // stop recording on video pause
            // videoElement.onpause = () => {
            //     mediaRecorder.stop();
            //     console.log(mediaRecorder.state);
            //     console.log("recorder ended");
            // }
            

            // recording stopped
            mediaRecorder.onstop = function(e) {
                const currentChunkBlob = new Blob(chunks);
                compareDialogue(currentChunkBlob);
            }

            
            // recording data available
            mediaRecorder.ondataavailable = function(e) {
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