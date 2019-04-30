/*
Author: Crossley Rozario

Description: Popup window for chrome extension

*/

let userToken = null;
let userEmail = null;
let userProfileLink = null;

let logging = true;


onload = () => {
    console.log("on popup script");
    setup()

    // let searchTab = document.getElementById('search-tab');
    // searchTab.onclick = tabOnClick("search-tab");

    if (isUserLoggedIn() === true) {
        // Load User Page
        console.log("Logged In");

        loadUserPage()
    } else {
        // login page
        console.log("Not Logged In");
        loadLoginPage();
    }
}

let isUserLoggedIn = () => { 

    return false;
}

let setup = () => {
    let loginButton = document.getElementById('login-button');
    loginButton.onclick = loginButtonPressed;
}

let loadLoginPage = () => {
    load("login");
}

let loadSignUpPage = (jsonData) => {
    load("user");


    // let user_id = jsonData.id;
    // let email = jsonData.email;
    // let emailVerified = jsonData.verified_email // true | false
    // let fullName = jsonData.full_name
    // let firstName = jsonData.given_name
    // let lastName = jsonData.family_name
    // let profilePicURL = jsonData.picture
    // let locale = jsonData.locale

    // let firstNameElement = document.getElementById('first-name');
    // firstNameElement.innerHTML = "First Name : " + firstName;

    // let lastNameElement = document.getElementById('last-name');
    // lastNameElement.innerHTML = "Last Name : " + lastName;

    // let emailElement = document.getElementById('email');
    // emailElement.innerHTML = "Email : " + email;

    // let profilePicElement = document.getElementById('profile-pic');
    // profilePicElement.src = profilePicURL;
}



let loadSearchPage = () => {
    load("login");
}

let load = (page) => {
    let loginContainer = document.getElementById('login-container');
    let signupContainer = document.getElementById('signup-container');
    let userContainer = document.getElementById('user-container');
    let searchContainer = document.getElementById('search-container');
    let leftTab = document.getElementById('left-tab');
    let rightTab = document.getElementById('right-tab');

    if(page == "login") {
        loginContainer.style.display = "block";
        userContainer.style.display = "none";
        signupContainer.style.display = "none";
        searchContainer.style.display = "none";
        leftTab.onclick = 

    } else if(page == "signup") {
        signupContainer.style.display = "block";
        loginContainer.style.display = "none";
        userContainer.style.display = "none";
        searchContainer.style.display = "none";
    } else if(page == "user") {
        userContainer.style.display = "block";  
        loginContainer.style.display = "none";
        signupContainer.style.display = "none";
        searchContainer.style.display = "none";

    } else if(page == "search") {
        searchContainer.style.display = "block";
        loginContainer.style.display = "none";
        userContainer.style.display = "none";
        signupContainer.style.display = "none";
    }
}


let loginButtonPressed = () => {
    let email = document.getElementById('login-input-email').value;
    let password = document.getElementById('login-input-password').value;

    saveLoginData(email);
    loadUserPage();

    return
    let data = {
        "email" : email,
        "password" : password
    }

    let stringifedData = JSON.stringify(data);

    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {  
                let jsonData = JSON.parse(req.responseText);
                console.log("LOGIN RESPONSE\n" + jsonData);
                saveLoginData(email);
                loadUserPage();
            } else {
                alert("error");
                alert(req.responseText)
            }
        }
    }

    req.open("POST", "https://impressionist-user-db-api-east-1.crossley.tech/user/signIn", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(stringifedData);
}

let saveLoginData = (email) => {
    const loggedIn = true

}
let logoutButtonPressed = () => {

}
// let loginButtonPressed = () => {

//     let login_button = document.getElementById('login-button');

//     chrome.identity.getAuthToken({interactive: true}, function(token) {
//         userToken = token
//         console.log(token);

//         if(chrome.runtime.lastError) {
//             console.log(chrome.runtime.lastError.message);
//             return;
//         }

//         let xhr = new XMLHttpRequest();
        
//         xhr.onload = function() {
//             let jsonData = JSON.parse(xhr.responseText)
//             loadUserPage(jsonData);
//         };

//         xhr.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
//         xhr.send();

//     });
// }

// let logoutButtonPressed = () => {
//     if(userToken != null) {
//         chrome.identity.removeCachedAuthToken(token, function(callback) {
//             console.log("logout Pressed : " + callback);
//         })
//     }
// }
