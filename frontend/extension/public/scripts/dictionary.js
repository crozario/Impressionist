(function() {
  function setjQuery() {
    var jqry = document.createElement('script');
    jqry.src = "https://code.jquery.com/jquery-3.3.1.min.js";
    document.getElementsByTagName('head')[0].appendChild(jqry);
    //jQuery.noConflict();
  }

  function getSubs() {
    if (document.getElementsByClassName('player-timedtext')[0].children[0]) {
      return document.getElementsByClassName('player-timedtext')[0];
    }
  }

  //Appends subtitle element with new container/subs elements based on netflix'subs
  function setSubs() {
    //need movieId to find container element to add the new subtitle element to
    var movieId = getMovieId();
    var netflixSubs = getSubs();
    //make sure to check if subs exist first
    var subs = netflixSubs.cloneNode(true);
    //remove other inner timed-text container if present
    while (subs.childElementCount > 1) {
      subs.children[1].remove()
    }
    //modify subs to style z-index=2 so that the appear in the foreground of the player and allow for hover capability, stolen from eJOY
    subs.firstChild.style.zIndex = 2;
    //display the subs
    subs.style.display = 'block';
    //split up subs into spans for each word
    var mytext = netflixSubs.innerText.replace(/\b(\w+\W?\s?)\b/g, "<span class=\"sub-word\">$1</span>");
    //carry over the style from netflix's subs
    //create new span elem to store only the style info
    var myelem = document.createElement('span');
    myelem.style = netflixSubs.firstChild.firstChild.style.cssText;
    //places all the new span tags into the contianer element
    myelem.innerHTML = mytext; //.replace(/\n/, '<br>');
    myelem.className = 'sub-words';
    //appends sub-words span to the inner timed-text container
    subs.firstChild.insertAdjacentHTML('beforeend', myelem.outerHTML);
    while (subs.firstChild.childElementCount > 1) {
      subs.firstChild.children[0].remove()
    }
    //set spacing from netflix controls
    setStyle(netflixSubs, subs);
    //append outer subtitle container with modified subs
    document.getElementById(movieId).insertAdjacentHTML('beforeend', subs.outerHTML);
  }

  function hoverHighlight() {
    $('span.sub-word').click(
      function() {
        myFunction($(this).text().replace(/\W/, '').trim(), $(this))
      }
    );
    $('span.sub-word').hover(
      function() {
        //changes color of font to yellow w/ mouseover
        $(this).css('color', 'yellow');
        //pause videoPlayer
        pauseVideo();
      },
      function() {
        //reverts color after mouseaway
        $(this).css('color', '');
        //resume videoPlayer
        playVideo();
      }
    );
  }

  async function wordsAPI(word) {
    var url = 'https://wordsapiv1.p.rapidapi.com/words/' + word + '/definitions/'

    var params = {
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
        //need to store this key somewhere safe, can't be in plain text here :/
        "X-RapidAPI-Key": "e26dcc4bbdmsh0842a0791e370ffp11181ajsn05b018a504ba"
      }
    }
    var myres;
    await fetch(url, params)
      .then(data => {
        return data.json()
      })
      .then(res => {
        myres = res;
      })
      .catch(error => console.log(error))

    return myres;
  }

  async function mwAPI(word) {
    var url = 'https://dictionaryapi.com/api/v3/references/collegiate/json/' + word + '?key=1b4501d9-d118-40c3-8700-2f8d8b23ec86';

    var params = {
      method: 'GET'
    }
    var myres;
    await fetch(url, params)
      .then(data => {
        return data.json()
      })
      .then(res => {
        myres = res;
      })
      .catch(error => console.log(error))

    return myres;
  }

  async function mwlAPI(word) {
    var url = 'https://dictionaryapi.com/api/v3/references/learners/json/' + word + '?key=89b82d41-650a-4e96-93dc-e980c48a3dda';

    var params = {
      method: 'GET'
    }
    var myres;
    await fetch(url, params)
      .then(data => {
        return data.json()
      })
      .then(res => {
        myres = res;
      })
      .catch(error => console.error(error))

    return myres;
  }

  async function myFunction(word, parent) {
    var prevPopup = document.getElementsByClassName('popuptext')[0];
    if (prevPopup) {
      prevPopup.remove()
    }
    var myelem = document.createElement('span');
    myelem.className = "popuptext";
    parent[0].appendChild(myelem);
    var myvar;
    var mytext;
    //add word on top center
    mytext =  "<p class=\"sub-word-top\">" + word + "</p>";
    //check m-w learners dict for def.
    await mwlAPI(word).then(res => {
      if (res[0].hasOwnProperty('shortdef')) {
        mytext += "<b>" + res[0].fl + "</b>"+ '\n' + res[0].shortdef[0];
        myvar = res
      }
    }).catch(error => console.error(error));
    //check m-w collegiate dict for def.
    if (myvar == null) {
      await mwAPI(word).then(res => {
        if (res[0].hasOwnProperty('shortdef')) {
          mytext += "<b>" + res[0].fl + "</b>" + '\n' + res[0].shortdef[0];
          myvar = res;
        }
      }).catch(error => console.error(error));
    }
    //check WordsAPI for def.
    if (myvar == null) {
      await wordsAPI(word).then(res => {
        myvar = res
      }).catch(error => console.error(error));
      if (myvar.definitions[0]) {
        mytext += myvar.definitions[0].partOfSpeech + '\n' + myvar.definitions[0].definition;
        if (myvar.definitions.length > 1) {
          for (i = 0; i < myvar.definitions.length; i++) {
            if (mytext.includes(myvar.definitions[i].partOfSpeech) || myvar.definitions[i].partOfSpeech == null) {} else {
              mytext += '<hr>' + myvar.definitions[i].partOfSpeech + '\n' + myvar.definitions[i].definition;
              break;
            }
          }
        }
      }
    }
    myelem.innerHTML = mytext + '<br>' + '<a href="http://www.learnersdictionary.com/definition/' + word + '" target="_blank">more</a>';
    parent[0].children[0].classList.toggle("show");
  }

  (function() {
    let style = `<style>
.sub-word-top {
  font-weight: bold;
  text-align: center;
  margin: auto;
}
.sub-words {
  white-space: pre-wrap;
}
    /* definition link */
a {
  text-decoration: underline;
  cursor: pointer;
  color: #fff;
  font-size: x-small;
}
    /* Popup container */
.sub-word {
  position: relative;
  cursor: pointer;
  white-space: pre-wrap;
}

/* The actual popup (appears on top) */
.sub-word .popuptext {
    font-size: small;
    visibility: hidden;
    width: 160px;
    background-color: #555;
    color: #fff;
    text-align: left;
    border-radius: 6px;
    padding: 8px 8px;
    font-weight: initial;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -80px;
}

/* Popup arrow */
.sub-word .popuptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

/* Toggle this class when clicking on the popup container (hide and show the popup) */
.sub-word .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s
}

/* Add animation (fade in the popup) */
@-webkit-keyframes fadeIn {
  from {opacity: 0;}
  to {opacity: 1;}
}

@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity:1 ;}
}
</style>
`;

    document.head.insertAdjacentHTML("beforeend", style);
  })();

  function setStyle(netflixSub, mySub) {
    if (document.getElementsByClassName('active').length) {
      if (netflixSub.childElementCount == 1 && mySub.firstChild.style.top != '79%')
        mySub.firstChild.style.top = '79.4%';
      else if (netflixSub.childElementCount == 2 && mySub.firstChild.style.top != '72%')
        mySub.firstChild.style.top = '72.5%';
      else if (netflixSub.childElementCount == 3 && mySub.firstChild.style.top != '67%')
        mySub.firstChild.style.top = '67%';
    }
  }

  function resetStyle(netflixSub, mySub) {
    if (!document.getElementsByClassName('active').length) {
      mySub.firstChild.style.top = netflixSub.firstChild.style.top;
    }
  }

  function updateSubs() {
    var textContainers = document.getElementsByClassName('player-timedtext');
    if (textContainers[0] && textContainers[0].firstChild) {
      var mySub = textContainers[1];
      var netflixSub = textContainers[0];
      //check if our subs elem is present
      if (textContainers.length > 1) {
        var netflixSubText = netflixSub.innerText;
        var mySubText = mySub.innerText.replace('\n', '');
        //if subs have changed, remove our sub, then create new sub
        if (netflixSubText != mySubText && !getPaused()) {
          setTimedTextVisibility(true);
          mySub.remove()
          setSubs();
          //disable netflix subs
          setTimedTextVisibility(false);
          //add hightlighting with hover
          hoverHighlight();
        } else if (document.getElementsByClassName('active').length) {
          setStyle(netflixSub, mySub);
        } else {
          resetStyle(netflixSub, mySub);
          return;
        } //if subs haven't changed, then don't update any elements
      } else {
        setTimedTextVisibility(true);
        //if our subs aren't present, create them
        setSubs();
        setTimedTextVisibility(false);
        hoverHighlight();
      }
    } else {
      //if our sub is present but netflix'subs isn't, then delete our subs
      if (textContainers.length > 1) {
        textContainers[1].remove();
        //resume player if paused but no subs,
        if (getPaused()) {
          playVideo();
        }
      }
    }
  }

  //add jQuery to page
  setjQuery();

  var idNum = setInterval(updateSubs, 10);



  console.log("STARTED SCRIPTORINO : ", idNum);


  //4140497
  //4513753 'powering' not defined

})();