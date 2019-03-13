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

    var login_button = document.getElementById('login-button');

    login_button.onclick = function() {
        var email = document.getElementsByName("email")[0].value;
        var password = document.getElementsByName("password")[0].value;

        var vars = "login=true" + "&email=" + email + "&password=" + password;

        var req = new XMLHttpRequest();

        req.onreadystatechange = function () {
            if (req.readyState == 4) {

            if (req.status == 200) {
                // var json_response = JSON.parse(req.responseText);   
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
    };

}


