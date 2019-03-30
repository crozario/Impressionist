/*
Author: Crossley Rozario

Description: Injected Netflix Api Script

*/

console.log("on netflixApi script");


// Encapsulation of Netflix API from webpage
let getSessionSummary = () => {
    let videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0]);
    return videoPlayer.getSessionSummary();
}

let pauseVideo = () => {
    let videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0]);
    console.log("pause video");
    videoPlayer.pause();
}

let playVideo = () => {
    let videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0]);
    console.log("play video");
    videoPlayer.play();
}

let seek = (time) => {
    let videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0]);
    console.log("seek video");
    videoPlayer.seek(time);
}

let getCurrentTime = () => {
    let videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0]);
    if (videoPlayer) {
        return videoPlayer.getCurrentTime(); // in ms
    } else {
        return 0;
    }
}

let getPaused = () => {
    let videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0]);
    if (videoPlayer) {
        return videoPlayer.getPaused();
    } else {
        return true;
    }
}

// setTimeout(function() {
//     document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
    
//         detail: getSessionSummary()
//     }));
// }, 5000);


// dispatch events by time interval
window.setInterval(() => {
    document.dispatchEvent(new CustomEvent('getCurrentTime', {
        detail: getCurrentTime()
    }));

    document.dispatchEvent(new CustomEvent('getPaused', {
        detail: getPaused()
    }));
}, 50);



// event listeners for Netflix API
document.addEventListener('pauseVideo', () => {
    pauseVideo();
});

document.addEventListener('playVideo', () => {
    playVideo();
});

document.addEventListener('seek', (event) => {
    seek(event.detail);
});