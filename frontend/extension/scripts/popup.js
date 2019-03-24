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

    let signupButton = document.getElementById('signup-button');
    signupButton.onclick = signupButtonPressed;
}

let tabOnClick = (buttonId) => {

}

let isLoggedIn = () => { return false; }



let loginButtonPressed = () => {
    let email = document.getElementById('login-input-email').value;
    let password = document.getElementById('login-input-password').value;

    // let login_button = document.getElementById('login-button');
    // let sign_up_button = document.getElementById("signup-button");


    let data = {
        "email" : email,
        "password" : password
    }

    let stringifedData = JSON.stringify(data);

    // alert(stringifedData);
    
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {  
                console.log("response received");
                console.log(req.responseText);
                alert(req.responseText);

            } else {
                alert("error");
                alert(req.responseText)
            }
        }
    }

    req.open("POST", "http://localhost:3000/user/signIn", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(stringifedData);

    // fetch("http://localhost:3000/user/signIn",
    //     {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         method: "POST",
    //         body: stringifedData
    //     })
    //     .then(function (res) { 
    //         console.log('Request success: ', res) 
    //         alert('Request success: ', res) 
    //     })
    //     .catch(function (error) { 
    //         console.log('Request failure: ', error)
    //         alert('Request failure: ', error) 
    //     })

}

let signupButtonPressed = () => {
    let email = document.getElementById('signup-input-email').value;
    let username = document.getElementById('signup-input-username').value;
    let password = document.getElementById('signup-input-password').value;
    let passwordConfirm = document.getElementById('signup-input-password-confirm').value;

    // if (password !== passwordConfirm) {
    //     console.log("password and password confirm does not match");
    //     return
    // }

    let data = {
        "firstName" : "bob",
        "lastName" : "roz",
        "username" : "bobroza",
        "email" : "bobroz@gmail.com",
        "password" : "password"
    }

    let stringifedData = JSON.stringify(data);

    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                console.log("response received");
                console.log(req.responseText);
                alert(req.responseText);
            } else {
                alert("error");
                alert(req.responseText)
            }
        }
    }

    req.open("POST", "http://localhost:3000/user/signUp", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(stringifedData);
}
