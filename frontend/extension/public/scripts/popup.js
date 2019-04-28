/*
Author: Crossley Rozario

Description: Popup window for chrome extension

*/

let userToken = null;


onload = () => {
    console.log("on popup script");
    setup()

    // let searchTab = document.getElementById('search-tab');
    // searchTab.onclick = tabOnClick("search-tab");

    if (isLoggedIn() === true) {
        // user page
        console.log("Logged In");

        loadUserPage()
    } else {
        // login page
        console.log("Not Logged In");
        loadLoginPage();
    }
}

let isLoggedIn = () => { return false; }

let loadUserPage = () => {

}

let setup = () => {
    let loginButton = document.getElementById('login-button');
}


let loadLoginPage = () => {
    let contentsContainer = document.getElementById("contents-container");

    let loginButton = document.createElement('button');
    loginButton.type = "submit";
    loginButton.id = "login-button";
    loginButton.innerHTML = "Log in with email";
    loginButton.onclick = loginButtonPressed;

    console.log(contentsContainer)

    contentsContainer.appendChild(loginButton);
}



let loginButtonPressed = () => {

    let login_button = document.getElementById('login-button');

    chrome.identity.getAuthToken({interactive: true}, function(token) {
        userToken = token
        console.log(token);

        if(chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            return;
        }

        let xhr = new XMLHttpRequest();
        
        xhr.onload = function() {
            alert(xhr.response);
        };

        xhr.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
        xhr.send();
    });





    // let email = document.getElementById('login-input-email').value;
    // let password = document.getElementById('login-input-password').value;

    // let login_button = document.getElementById('login-button');
    // let sign_up_button = document.getElementById("signup-button");

    // let data = {
    //     "email" : email,
    //     "password" : password
    // }

    // let stringifedData = JSON.stringify(data);

    // var req = new XMLHttpRequest();

    // req.onreadystatechange = function () {
    //     if (req.readyState == 4) {
    //         if (req.status == 200) {  
    //             console.log("response received");
    //             console.log(req.responseText);
    //             alert(req.responseText);

    //         } else {
    //             alert("error");
    //             alert(req.responseText)
    //         }
    //     }
    // }

    // req.open("POST", "http://localhost:3000/user/signIn", true);
    // req.setRequestHeader("Content-Type", "application/json");
    // req.send(stringifedData);

}


let logoutButtonPressed = () => {
    if(userToken != null) {
        chrome.identity.removeCachedAuthToken(token, function(callback) {
            console.log("logout Pressed : " + callback);
        })
    }
}
