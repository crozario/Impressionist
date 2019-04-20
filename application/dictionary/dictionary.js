function setjQuery() {
  var jqry = document.createElement('script');
  jqry.src = "https://code.jquery.com/jquery-3.3.1.min.js";
  document.getElementsByTagName('head')[0].appendChild(jqry);
  //jQuery.noConflict();
}

//do something about this at some point
const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer
const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0]
const player = videoPlayer.getVideoPlayerBySessionId(playerSessionId)

function getSubs() {
  if (document.getElementsByClassName('player-timedtext')[0].children[0] != null) {
    return document.getElementsByClassName('player-timedtext')[0];
  }
}

//Appends subtitle element with new container/subs elements based on netflix'subs
function setSubs() {
  //need movieId to find container element to add the new subtitle element to
  var movieId = player.getMovieId();
  var netflixSubs = getSubs();
  //make sure to check if subs exist first
  var subs = netflixSubs.cloneNode(true);
  //modify subs to style z-index=2 so that the appear in the foreground of the player and allow for hover capability, stolen from eJOY
  subs.children[0].style.zIndex = 2;
  //display the subs
  subs.style.display = 'block';
  //split up subs into spans for each word
  var mytext = netflixSubs.innerText.replace(/\b(\w+\W?\s?)\b/g, "<span class=\"sub-word\">$1</span>");
  //carry over the style from netflix's subs
  subs.firstChild.style.cssText += netflixSubs.firstChild.firstChild.style.cssText;
  //places all the new span tags into the contianer element
  subs.firstChild.innerHTML = mytext.replace(/\n/, '<br>');
  //append outer subtitle container with modified subs
  document.getElementById(movieId).insertAdjacentHTML('beforeend', subs.outerHTML);
}

function hoverHighlight() {
   $('span.sub-word').click(
    function() {
      //maybe add api call etc here? nope, add a function call with the word
      wordsAPI($(this).text().replace(/\W/, '').trim());
    }
  );
  $('span.sub-word').hover(
    function() {
      //changes color of font to yellow w/ mouseover
      $(this).css('color', 'yellow');
      //pause videoPlayer
      player.pause();
    },
    function() {
      //reverts color after mouseaway
      $(this).css('color', '');
      //resume videoPlayer
      player.play();
    }
  );
}

function wordsAPI(word) {
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

  fetch(url, params)
    .then(data => {
      return data.json()
    })
    .then(res => {
      console.log(res)
    })
    .then(error => console.log(error))
}

//add jQuery to page
setjQuery();

function updateSubs() {
  var textContainers = document.getElementsByClassName('player-timedtext');
  if (textContainers[0].firstChild != null) {
    var netflixSubText = textContainers[0].innerText;
    //check if our subs elem is present
    if (textContainers.length > 1) {
      var mySub = textContainers[1];
      var mySubText = mySub.innerText.replace('\n', '');
      //if subs have changed, remove our sub, then create new sub
      if (netflixSubText != mySubText) {
        player.setTimedTextVisibility(true);
        mySub.remove()
        setSubs();
        //disable netflix subs
        player.setTimedTextVisibility(false);
        //add hightlighting with hover
        hoverHighlight();
      } else return; //if subs haven't changed, then don't update any elements
    } else {
      player.setTimedTextVisibility(true);
      //if our subs aren't present, create them
      setSubs();
      player.setTimedTextVisibility(false);
      hoverHighlight();
    }
  } else {
    //if our sub is present but netflix'subs isn't, then delete our subs
    if (textContainers.length > 1) {
      textContainers[1].remove();
      //resume player if paused but no subs,
      if (player.isPaused()){
        player.play();
        }
    }
  }
}

var idNum = setInterval(updateSubs, 10);

console.log("Started scriptorino: ", idNum);
