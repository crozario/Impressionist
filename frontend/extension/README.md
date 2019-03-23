# Impressionist Chrome Extension 

## Chrome Extension Architecture

![Flow diagram for Chrome Extension](https://developer.chrome.com/static/images/overview/messagingarc.png)

### Resources

https://developer.chrome.com/extensions/overview

https://developer.chrome.com/extensions/content_scripts

https://stackoverflow.com/questions/36371072/chrome-extension-messaging-architecture

https://stackoverflow.com/questions/17246133/contexts-and-methods-for-communication-between-the-browser-action-background-sc/17276475#17276475

https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script/9517879#9517879

https://stackoverflow.com/questions/4532236/how-to-access-the-webpage-dom-rather-than-the-extension-page-dom

https://stackoverflow.com/questions/32807720/how-to-invoke-javascript-function-on-web-page-from-chrome-extension

https://stackoverflow.com/questions/10526995/can-a-site-invoke-a-browser-extension/10527809#10527809

**Message Passing**

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect


### Netflix Integration

https://stackoverflow.com/questions/42105028/netflix-video-player-in-chrome-how-to-seek

#### Dom Elements

- class="player-timedtext-text-container" (subtitles div container)
- class="sizing-wrapper" (netflix div for sizing player)
- class="nf-kb-nav-wrapper" (wraps around "sizing-wrapper")
- class="VideoContainer" (video container)


**Notes**

Encrypt message passing between content script and injected script using asymmetric cryptography?

Record audio from netflix video player
- Virtual Pulsewave device
- get audio from DOM?
- get audio file location/stream from webpage



Web Worker 

- Current Time 
- Play/Pause

**TODO**

setup state variable for isplaying, isPaused, 


videoPlayer.setVolume() : volume between 0 and 1
videoPlayer.setPlaybackRate : 


**DOM Netflix API**

netflix.appContext.state.playerApp.getAPI().videoPlayer

- get video player => netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0])

- get session id => netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0]


netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0])


netflix.appContext.state.playerApp.getAPI().videoPlayer.getCurrentTextTrackBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0])


netflix.appContext.getPlayerApp().getAPI().videoPlayer.showTimedTextBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds()[0])