/*
Author: Crossley Rozario

Description: Popup window for chrome extension

*/

onload = () => {
    console.log("on popup script");
    setup();

    // let searchTab = document.getElementById('search-tab');
    // searchTab.onclick = tabOnClick("search-tab");

    if (isLoggedIn() === true) {
        // user page
        console.log("Logged In");

    } else {
        // login page
        console.log("Not Logged In");
    }



}

let setup = () => {
    let loginButton = document.getElementById('login-button');
    loginButton.onclick = loginButtonPressed;

    // let signupButton = document.getElementById('signup-button');
    // signupButton.onclick = signupButtonPressed;
}
  
let isLoggedIn = () => { return false; }



let loginButtonPressed = () => {

    let login_button = document.getElementById('login-button');

    chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
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

