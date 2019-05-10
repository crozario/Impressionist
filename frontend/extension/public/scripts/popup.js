/*
Author: Crossley Rozario

Description: Popup window for chrome extension

*/

// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-139623581-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// let userToken = null;
// let userEmail = null;
// let userProfileLink = null;
let contentDatabaseRestAPIHost = "https://impressionist-content-db-api-east-1.crossley.tech";

let logging = true;
let loggedIn = false
let email = ""

onload = () => {
    console.log("on popup script");
    setup()
    loadSearchPage();

    // let reloadButton = document.getElementById('reload-button')

    // reloadButton.onclick = () => {  
    //     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //         chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    //     });
    // }
}

let isUserLoggedIn = () => { 
    return loggedIn;
}

let setup = () => {
    let loginButtonElement = document.getElementById('login-button');
    loginButtonElement.onclick = loginButtonPressed;

    let logoutButtonElement = document.getElementById('logout-button')
    logoutButtonElement.onclick = logoutButtonPressed;
    
    let leftTabButtonElement = document.getElementById('left-tab')
    leftTabButtonElement.onclick = leftTabButtonPressed;

    let rightTabButtonElement = document.getElementById('right-tab')
    rightTabButtonElement.onclick = rightTabButtonPressed;

    let searchButtonElement = document.getElementById('search-button')
    searchButtonElement.onclick = searchButtonPressed;

    let loginTabButtonElement = document.getElementById('login-tab');
    loginTabButtonElement.onclick = () => {
        loadLoginSignup("login");
        return false;
    }

    let signupTabButtonElement = document.getElementById('signup-tab');
    signupTabButtonElement.onclick = () => {
        loadLoginSignup("signup");
        return false;
    }
    
}

let loadLoginSignupPage = () => {
    load("login-signup");
}

let loadUserPage = (jsonData) => {
    load("user");
    let emailElement = document.getElementById('user-email');
    emailElement.innerHTML = email;

}

let loadSearchPage = () => {
    load("search");
}

let load = (page) => {
    let loginSignupContainer = document.getElementById('login-signup-container');
    let userContainer = document.getElementById('user-container');
    let searchContainer = document.getElementById('search-container');

    if(page == "login-signup") {
        loginSignupContainer.style.display = "block";
        loadLoginSignup("login")
        userContainer.style.display = "none";
        searchContainer.style.display = "none";

    } else if(page == "user") {
        userContainer.style.display = "block";  
        loginSignupContainer.style.display = "none";
        searchContainer.style.display = "none";

    } else if(page == "search") {
        searchContainer.style.display = "block";
        loginSignupContainer.style.display = "none";
        userContainer.style.display = "none";
    }
}

let loadLoginSignup = (page) => {
    let loginContainerElement = document.getElementById('login-container');
    let signupContainerElement = document.getElementById('signup-container');

    if(page === "login") {
        signupContainerElement.style.display = "none";
        loginContainerElement.style.display = "block";
    } else if(page === "signup") {
        loginContainerElement.style.display = "none"; 
        signupContainerElement.style.display = "block"; 
    }
}


let loginButtonPressed = () => {
    let email = document.getElementById('login-input-email').value;
    let password = document.getElementById('login-input-password').value;
    
    email = "wade_owen_watts@email.com"
    password = "parzival+art3mis"
    let success = false;

    if(success === true) {
        saveLoginData(email)
        loadUserPage()
    } else {
        incorrect_username_or_password_notification()
    }


    return false;
}

let searchButtonPressed = () => {
    let searchInput = document.getElementById('search-input').value;
    
    let data = {
        "keywords" : searchInput
    }

    let stringifedData = JSON.stringify(data);

    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {  
                let jsonData = JSON.parse(req.responseText);
                if(jsonData.status === "success") {
                    showSearchResults(jsonData.data);
                }
            } else {
                alert("error");
                alert(req.responseText)
            }
        }
    }

    req.open("POST", contentDatabaseRestAPIHost + "/cont/keywordSearch", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(stringifedData);

    return false;
}


// {"status":"success","data":[
//     {"_id":"5cc3791112b853001111bd02","mediaType":0,"title":"Friends","episodeTitle":"The One Where Joey Moves Out","netflixWatchID":"70274036"},
//     {"_id":"5cc3fc1a12b853001111bd0e","mediaType":0,"title":"Friends","episodeTitle":"The One After the Superbowl Part2","netflixWatchID":"70274033"},


let showSearchResults = (searchData) => {
    console.log(searchData);
    document.getElementById('search-input').value = "";
    
    let searchResultsContainer = document.getElementById("search-results");

    // remove child nodes if any
    while (searchResultsContainer.firstChild) {
        searchResultsContainer.removeChild(searchResultsContainer.firstChild);
    }

    for (const content of searchData) {
        let table = document.createElement('table');
   
        if (content.mediaType == 0) { //tv show
            let titleRow = document.createElement("tr");
            let cell1 = document.createElement("td");
            cell1.appendChild(document.createTextNode("TV Show: " + content.title));
            titleRow.appendChild(cell1)

            let seasonEpRow = document.createElement("tr");
            let cell2 = document.createElement("td");
            cell2.appendChild(document.createTextNode("Season " + content.seasonNumber  + ", Episode " + content.episodeNumber));
            seasonEpRow.appendChild(cell2);

            let epTitleRow = document.createElement("tr");
            let cell3 = document.createElement("td");
            cell3.appendChild(document.createTextNode("Episode Title: " + content.episodeTitle));
            epTitleRow.appendChild(cell3);

            let watchId = content.netflixWatchID;
            let netflixURL = "https://netflix.com/watch/" + watchId
            let openURLButton = document.createElement('button');
            openURLButton.innerHTML = "Watch Content";
            openURLButton.style.fontSize = "8pt"

            openURLButton.onclick = () => {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    var tab = tabs[0];
                    chrome.tabs.update(tab.id, {url: netflixURL});
                });

                return false;
            }

            let watchIdRow = document.createElement("tr");
            let cell4 = document.createElement("td");
            cell4.appendChild(openURLButton);
            watchIdRow.appendChild(cell4);

            table.appendChild(titleRow)
            table.appendChild(seasonEpRow)
            table.appendChild(epTitleRow)
            table.appendChild(watchIdRow)
            searchResultsContainer.appendChild(table);

        } else if(content.mediaType == 1) { // movie

        }
        
        console.log(content.episodeTitle);
      }

}


let incorrect_username_or_password_notification = () => {
    document.getElementById("login-form").reset();
    var status_id = document.getElementById("status");
    status_id.style.display = "block";
    status_id.style.opacity = 1;
    status_id.addEventListener('click', fadeOutEffect);
    setTimeout(function(){ 
        status_id.click();
    }, 1500);
}


let fadeOutEffect = () =>  {
    var fadeTarget = document.getElementById("status");
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 50); 
}

let saveLoginData = (email) => {
    loggedIn = true;
    email = email;

}
let logoutButtonPressed = () => {
    loggedIn = false;
    loadLoginSignupPage();
}


let leftTabButtonPressed = () => {
    loadSearchPage();

    return false;
}

let rightTabButtonPressed = () => {
    if(loggedIn === true) {
        loadUserPage()
    } else {
        loadLoginSignupPage()
    }

    return false;
}

