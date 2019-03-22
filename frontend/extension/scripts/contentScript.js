console.log("on contentScript script");

var s = document.createElement('script');
s.src = chrome.extension.getURL('scripts/netflixApiScript.js');
(document.head||document.documentElement).appendChild(s);

s.onload = function() {
    s.remove();
};

// Event listener

// document.addEventListener('RW759_connectExtension', function(e) {
//     alert(e.detail);
// });

let pauseVideo = () => {
    document.dispatchEvent(new CustomEvent('pauseVideo', {
    }));
}


let playVideo = () => {
    document.dispatchEvent(new CustomEvent('playVideo', {
    }));
}


setTimeout(function() {
    console.log("pausing video")
    pauseVideo()
}, 10000);