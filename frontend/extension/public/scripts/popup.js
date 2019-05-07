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

let logging = true;
let loggedIn = false
let email = ""

onload = () => {
    console.log("on popup script");
    // setup()
    // loadSearchPage();

    let reloadButton = document.getElementById('reload-button')

    reloadButton.onclick = () => {  
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
    }
}

// let isUserLoggedIn = () => { 
//     return loggedIn;
// }

// let setup = () => {
//     let loginButtonElement = document.getElementById('login-button');
//     loginButtonElement.onclick = loginButtonPressed;

//     let logoutButtonElement = document.getElementById('logout-button')
//     logoutButtonElement.onclick = logoutButtonPressed;
    
//     let leftTabButtonElement = document.getElementById('left-tab')
//     leftTabButtonElement.onclick = leftTabButtonPressed;

//     let rightTabButtonElement = document.getElementById('right-tab')
//     rightTabButtonElement.onclick = rightTabButtonPressed;

//     let loginTabButtonElement = document.getElementById('login-tab');
//     loginTabButtonElement.onclick = () => {
//         loadLoginSignup("login");
//         return false;
//     }

//     let signupTabButtonElement = document.getElementById('signup-tab');
//     signupTabButtonElement.onclick = () => {
//         loadLoginSignup("signup");
//         return false;
//     }
    
// }

// let loadLoginSignupPage = () => {
//     load("login-signup");
// }

// let loadUserPage = (jsonData) => {
//     load("user");
//     let emailElement = document.getElementById('user-email');
//     emailElement.innerHTML = email;

// }



// let loadSearchPage = () => {
//     load("search");
// }

// let load = (page) => {
//     let loginSignupContainer = document.getElementById('login-signup-container');
//     let userContainer = document.getElementById('user-container');
//     let searchContainer = document.getElementById('search-container');

//     if(page == "login-signup") {
//         loginSignupContainer.style.display = "block";
//         loadLoginSignup("login")
//         userContainer.style.display = "none";
//         searchContainer.style.display = "none";

//     } else if(page == "user") {
//         userContainer.style.display = "block";  
//         loginSignupContainer.style.display = "none";
//         searchContainer.style.display = "none";

//     } else if(page == "search") {
//         searchContainer.style.display = "block";
//         loginSignupContainer.style.display = "none";
//         userContainer.style.display = "none";
//     }
// }

// let loadLoginSignup = (page) => {
//     let loginContainerElement = document.getElementById('login-container');
//     let signupContainerElement = document.getElementById('signup-container');

//     if(page === "login") {
//         signupContainerElement.style.display = "none";
//         loginContainerElement.style.display = "block";
//     } else if(page === "signup") {
//         loginContainerElement.style.display = "none"; 
//         signupContainerElement.style.display = "block"; 
//     }
// }


// let loginButtonPressed = () => {
//     let email = document.getElementById('login-input-email').value;
//     let password = document.getElementById('login-input-password').value;
    
//     email = "wade_owen_watts@email.com"
//     password = "parzival+art3mis"
//     let success = false;

//     if(success === true) {
//         saveLoginData(email)
//         loadUserPage()
//     } else {
//         incorrect_username_or_password_notification()
//     }


//     return false;
// }

// let incorrect_username_or_password_notification = () => {
//     document.getElementById("login-form").reset();
//     var status_id = document.getElementById("status");
//     status_id.style.display = "block";
//     status_id.style.opacity = 1;
//     status_id.addEventListener('click', fadeOutEffect);
//     setTimeout(function(){ 
//         status_id.click();
//     }, 1500);
// }


// let fadeOutEffect = () =>  {
//     var fadeTarget = document.getElementById("status");
//     var fadeEffect = setInterval(function () {
//         if (!fadeTarget.style.opacity) {
//             fadeTarget.style.opacity = 1;
//         }
//         if (fadeTarget.style.opacity > 0) {
//             fadeTarget.style.opacity -= 0.1;
//         } else {
//             clearInterval(fadeEffect);
//         }
//     }, 50); 
// }

// let saveLoginData = (email) => {
//     loggedIn = true;
//     email = email;

// }
// let logoutButtonPressed = () => {
//     loggedIn = false;
//     loadLoginSignupPage();
// }


// let leftTabButtonPressed = () => {
//     loadSearchPage();

//     return false;
// }

// let rightTabButtonPressed = () => {
//     if(loggedIn === true) {
//         loadUserPage()
//     } else {
//         loadLoginSignupPage()
//     }

//     return false;
// }

