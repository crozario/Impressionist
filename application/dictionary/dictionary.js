//#1 import jquery
var jqry = document.createElement('script');
jqry.src = "https://code.jquery.com/jquery-3.3.1.min.js";
document.getElementsByTagName('head')[0].appendChild(jqry);

//#2 returns the whole div element which contains subs
function getSubs2(){
  if (document.getElementsByClassName('player-timedtext')[0].children[0] != null){
  return document.getElementsByClassName('player-timedtext')[0];
  }
}

//#3 creates object to control netflix player
const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer
// Getting player id
const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0]
const player = videoPlayer.getVideoPlayerBySessionId(playerSessionId)

//#4 adds highligh/definition functions to span.sub-word elements during hover
function hoverHighlight() {
    $('span.sub-word').hover(
    function() {
      $('#word').text($(this).css('background-color', '#ffff66').text());
      //maybe add api call etc here? nope, add a function call with the word
      //wordsAPI($(this).css('background-color', '#ffff66').text())
      },
    function() {
      $('#word').text('');
      $(this).css('background-color', '');
      }
    );
}

//#5 API request for definition
function  wordsAPI(word){
	var url1 = 'https://wordsapiv1.p.rapidapi.com/words/' + word + '/definitions/'

	var params1 ={
		method: 'GET',
		headers: {
		'cache-control': 'no-cache',
		'Content-Type': 'application/json',
		"X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
		"X-RapidAPI-Key": "e26dcc4bbdmsh0842a0791e370ffp11181ajsn05b018a504ba"
	  }
	}

	fetch(url1, params1)
	.then(data=>{return data.json()})
	.then(res=>{console.log(res)})
	.then(error=>console.log(error))
}

//#6 Last but not least, controller perhaps?
//Calls all the other functions in order to create our functionality of hover/highlight/definition
//Appends subtitle element with new container/subs elements based on netflix'subs
function setSubs(){
  //need to disable netflix subs
  player.setTimedTextVisibility(false);
  //need movieId
  var movieId = player.getMovieId();
  //make sure to check if subs exist first
  var subs = getSubs2().cloneNode(true);
  //modify subs to style z-index=2 so that the appear in the foreground of the player and allow for hover capability, stolen from eJOY
  subs.children[0].style.zIndex = 2;
  //add sub-word class to subs
  subs.firstChild.firstChild.className = 'sub-word';
  //display the subs
  subs.style.display = 'block';
  //split up subs into spans for each word
  subs.innerText.replace(/\b(\w+)\b/g, "<span class=\"sub-word\">$1</span>")
  //append outer subtitle container with modified subs
  document.getElementById(movieId).insertAdjacentHTML('beforeend', subs.outerHTML);
  //add hightlighting with hover, maybe change this so highlighting is done before element is added
  hoverHighlight();
}
