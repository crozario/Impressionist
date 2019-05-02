/*
Author: Crossley Rozario

Description: Popup window for chrome extension

*/

// let userToken = null;
// let userEmail = null;
// let userProfileLink = null;

let logging = true;
let loggedIn = false
let email = ""

onload = () => {
    console.log("on popup script");
    setup()

    // let searchTab = document.getElementById('search-tab');
    // searchTab.onclick = tabOnClick("search-tab");
    loadSearchPage();
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
    // loggedIn = true;
    // saveLoginData(email);
    // loadUserPage();

    
    // return false;
    // let data = {
    //     "user" : email,
    //     "password" : password
    // }
    
    // let stringifedData = JSON.stringify(data);

    // var req = new XMLHttpRequest();

    // req.onreadystatechange = function () {
    //     if (req.readyState == 4) {
    //         if (req.status == 200) {  
    //             // let jsonData = JSON.parse(req.responseText);
    //             console.log("LOGIN RESPONSE\n" + req.responseText);
    //             // saveLoginData(email);
    //             // loadUserPage();
    //         } else {
    //             console.log(req.responseText);
    //         }
    //     }
    // }

    // req.open("POST", "https://impressionist-user-db-api-east-1.crossley.tech/user/signIn", true);
    // req.setRequestHeader("Content-Type", "application/json");
    // req.send(stringifedData);

    return false;
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
