/*
Author: Crossley Rozario

Description: Popup window for chrome extension

*/

// tab one = search bar (search for wa)


// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.executeScript(
//           tabs[0].id,
//           {code: 'document.body.style.backgroundColor = "' + color + '";'});
//     });
// };


onload = () => {
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

    let signupButton = document.getElementById('signup-button');
    signupButton.onclick = signupButtonPressed;
}

let tabOnClick = (buttonId) =>  {
    
}

let isLoggedIn = () => { return false; }



let loginButtonPressed = () => {
    let email = document.getElementById('login-input-email').value;
    let password = document.getElementById('login-input-password').value;

        // let login_button = document.getElementById('login-button');
    // let sign_up_button = document.getElementById("signup-button");


    var vars = "email=" + email + "&password=" + password;

    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {  
                console.log("response received");
                console.log(req.responseText);

            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "http://localhost:8080/requests", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);

}

let signupButtonPressed = () => {
    let email = document.getElementById('signup-input-email').value;
    let username = document.getElementById('signup-input-username').value;
    let password = document.getElementById('signup-input-password').value;
    let passwordConfirm = document.getElementById('signup-input-password-confirm').value;

    if(password !== passwordConfirm) {
        console.log("password and password confirm does not match");
        return
    }

    var vars = "email=" + email + "&username=" + username + "&password=" + password;

    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {  
                console.log("response received");
                console.log(req.responseText);

            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "http://localhost:8080/requests", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);


}
