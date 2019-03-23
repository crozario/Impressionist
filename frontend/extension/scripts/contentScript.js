/*
Author: Crossley Rozario

Description: Content script to interact with the webpage

*/

let setupContentScript = () => {
    // pause video after 10 seconds
    // setTimeout(function() {
    //     console.log("pausing video");
    //     pauseVideo();
    // }, 10000);

    setTimeout(function() {
        injectNetflixScript();
        injectSideBar();
    }, 5000);
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
    titleElement.style.borderBottom  = "1px solid gray";

    sideBarContainerDivElement.appendChild(titleElement)

    let currentTimeElement = document.createElement('p');
    currentTimeElement.id = "current-time-container";
    currentTimeElement.innerHTML = "Current Time : "
    currentTimeElement.style.textAlign = "center";
    currentTimeElement.style.margin = "20px 0";

    sideBarContainerDivElement.appendChild(currentTimeElement);


    pageContainer[0].appendChild(sideBarContainerDivElement);
    videoContainer.style.right = "300px"; // need to add this to a class inside ('size-wrapper') to show and hide side bar

}

let updateCurrentTimeElement = (e) => {
    let currentTimeElement = document.getElementById('current-time-container');
    currentTimeElement.innerHTML = "Current Time : " + e;
}

// Netflix API

// document.addEventListener('RW759_connectExtension', function(e) {
//     alert(e.detail);
// });


document.addEventListener('currentTimeLoop', function(e) {
    updateCurrentTimeElement(e.detail);
});

let pauseVideo = () => {
    document.dispatchEvent(new CustomEvent('pauseVideo', {
    }));
}


let playVideo = () => {
    document.dispatchEvent(new CustomEvent('playVideo', {
    }));
}


window.onload = () => {
    console.log("on contentScript script");
    setupContentScript();

}
