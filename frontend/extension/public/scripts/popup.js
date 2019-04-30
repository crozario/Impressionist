/*
Author: Crossley Rozario

Description: Popup window for chrome extension

*/

let userToken = null;
let userEmail = null;
let userProfileLink = null;



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

let isLoggedIn = () => { 
    // chrome.identity.getAuthToken({interactive: false}, function(token) {
    //     userToken = token
    //     console.log(token);

    //     if(chrome.runtime.lastError) {
    //         console.log(chrome.runtime.lastError.message);
    //         return false;
    //     } 

    //     return true;

    //     let xhr = new XMLHttpRequest();
        
    //     xhr.onload = function() {
    //         console.log(xhr.response);
    //         return true

    //     };

    //     xhr.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
    //     xhr.send();

    // });
    return false;
}

let setup = () => {
    let loginButton = document.getElementById('login-button');
    loginButton.onclick = loginButtonPressed;
}

let loadUserPage = (jsonData) => {
    load("user");


    let user_id = jsonData.id;
    let email = jsonData.email;
    let emailVerified = jsonData.verified_email // true | false
    let fullName = jsonData.full_name
    let firstName = jsonData.given_name
    let lastName = jsonData.family_name
    let profilePicURL = jsonData.picture
    let locale = jsonData.locale

    let firstNameElement = document.getElementById('first-name');
    firstNameElement.innerHTML = "First Name : " + firstName;

    let lastNameElement = document.getElementById('last-name');
    lastNameElement.innerHTML = "Last Name : " + lastName;

    let emailElement = document.getElementById('email');
    emailElement.innerHTML = "Email : " + email;

    let profilePicElement = document.getElementById('profile-pic');
    profilePicElement.src = profilePicURL;
}

let loadLoginPage = () => {
    load("login");
}

let load = (page) => {
    let loginContainer = document.getElementById('login-container');
    let userContainer = document.getElementById('user-container');

    if(page == "login") {
        loginContainer.style.display = "block";
        userContainer.style.display = "none";

    } else if(page == "user") {
        loginContainer.style.display = "none";
        userContainer.style.display = "block";
    }
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
            let jsonData = JSON.parse(xhr.responseText)
            loadUserPage(jsonData);
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
