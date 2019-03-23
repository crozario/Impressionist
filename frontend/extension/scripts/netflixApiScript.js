/*
Author: Crossley Rozario

Description: Injected Netflix Api Script

*/

console.log("on netflixApi script");

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

// setTimeout(function() {
//     document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
    
//         detail: getSessionSummary()
//     }));
// }, 5000);

// event listeners for Netflix API
document.addEventListener('pauseVideo', function(e) {
    pauseVideo();
});

document.addEventListener('playVideo', function(e) {
    playVideo();
});