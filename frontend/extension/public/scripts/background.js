/*
Author: Crossley Rozario

Description: Background script for chrome extension

*/

"use strict";

console.log("ON BACKGROUND SCRIPT");


// works only with URLs from www.netflix.com/watch/
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'www.netflix.com',
                    pathPrefix: '/watch/',
                    schemes: ['http', 'https']
                    },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});
