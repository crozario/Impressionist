console.log("on contentScript script");

setup() 

let setup = () => {
    injectNetflixScript();

    // pause video after 10 seconds
    setTimeout(function() {
        console.log("pausing video")
        pauseVideo()
    }, 10000);
}



// inject netflixApiScript.js into netflix DOM
let injectNetflixScript = () => {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL('scripts/netflixApiScript.js');
    (document.head||document.documentElement).appendChild(s);

    script.onload = function() {
        script.remove();
    };

    console.log("injected netflixApiScript");
}


// Netflix API

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


