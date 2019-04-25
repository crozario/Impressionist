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
  subs.firstChild.style.whitespace = "pre-wrap";
  //places all the new span tags into the contianer element
  subs.firstChild.innerHTML = mytext; //.replace(/\n/, '<br>');
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
	    console.log(res);
		myres = res;
	})
	.then(error => console.log(error))

	return myres;
}

async function mwAPI(word) {
	var url = 'https://dictionaryapi.com/api/v3/references/collegiate/json/'+ word + '?key=1b4501d9-d118-40c3-8700-2f8d8b23ec86';

	var params = {
	method: 'GET'
	}
	var myres;
	await fetch(url, params)
	.then(data => {
	  return data.json()
	})
	.then(res => {
	    console.log(res);
		myres = res;
	})
	.then(error => console.log(error))

	return myres;
}

async function myFunction(word, parent) {
	var prevPopup = document.getElementsByClassName('popuptext')[0];
	if (prevPopup != null){
		prevPopup.remove()
	}
	var myelem = document.createElement('span');
	myelem.className = "popuptext";
	parent[0].appendChild(myelem);
	var myvar;
	var mytext;
	await wordsAPI(word).then(res => {myvar = res});
	if (myvar.definitions[0] == null){
		await mwAPI(word).then(res => {
			mytext = res[0].fl + '\n\t' + res[0].shortdef;
			myvar = res});
	}
	else {
	    mytext = myvar.definitions[0].partOfSpeech + '\n\t' + myvar.definitions[0].definition;
          if (myvar.definitions.length > 1){
            for (i=0; i<myvar.definitions.length; i++){
              if (mytext.includes(myvar.definitions[i].partOfSpeech) || myvar.definitions[i].partOfSpeech == null){}
              else {
                mytext += '<hr>' + myvar.definitions[i].partOfSpeech + '\n\t' + myvar.definitions[i].definition;
                break;
              }
            }
          }
        }
	//add code to catch exceptions for no definitions

	myelem.innerHTML = mytext + '<br>' + '<a href="https://www.merriam-webster.com/dictionary/' + word + '" target="_blank">Source</a>';
	console.log(myvar);
	parent[0].children[0].classList.toggle("show");
}

(function(){
    let style = `<style>
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
      if (netflixSubText != mySubText && player.isPaused() == false) {
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

var idNum = setInterval(updateSubs, 50);

console.log("Started scriptorino: ", idNum);

//4140497
//4513753 'powering' not defined
