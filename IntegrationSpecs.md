# Front-middle Integration Plan
# Middle REST API
## Application Server
- [gameplay story](#during-game-play)
    - example json (RECEIVE from FRONT)
        {
            "reqType" : "compareAudio"
            "gameID" : 2,  // info about user (connected with contentID on userDatabase)
            "contentID" : 43, // info about tvshow/movie
            "dialogueID" : 23, // which dialogue to compare the audioBuffer against
            "data" : blob 
        }
    - json SEND to contentDB
        {
            "reqType" : "getFeatureURL",
            "contentID" : 43,
            "dialogueID" : 23
        }
WORDS
- sockets (compareAudio)
- http req (JSON)
- message queue 
----------------------
- "rooms and stuff" 
    - what has this? - socket.io

## ContentProcessor
> STATUS: DOING
- [append to content DB](#append-to-content-database) 
    - SEND to contentDB
        {
            "reqType" : "appendContentDB"
            "title" : String,
            "season" : Number, (0 if its a movie)
            "episode" : Number, (0 if its a movie)
            "length" : Number,
            "mediaFileLocation" : String,
            "captionFile" : String,
            "dialogueFileLocations" : array of String values
        }
    - RECEIVE status from contentDB
        {
            "status" : "success"|"failure"
            "error" : empty String | String
        }


### Front functionality assumptions
- 

# User stories
## *Append to content database*
> Updated : 3/29/19
- (contentProcessor → contentDatabase)
    - "reqType" : "appendContentDB"
    - "mediaFileLocation" : String (*relative location of file on local server*)
    - "length" : Number (*duration of the content*)
    - "featureFileLocations" : Array of Strings (*all paths relative to local server*)
    - "captionFile" : String (*relative path to .vtt subtitle file. MUST include characterNames*)
    - "emotionsList" : Array of Strings (*on word emotions of all dialogues in the movie/episode*)
    - "captions" : 2D Array Numbers and Strings (*each row has [Number, Number, String] representing one dialogues [startTime, endTime, transcribedDialogue]*)
    - "netflixSubtitleOffset" : Number (*positive or negative number representing the milliseconds adjustement to the dialogue start/stop times stored in contentDB*)
    - "characterNames" : Array of Strings
    - "characterDialogueID" : Map where keys are the same names from *characterNames* and values are Array of Numbers (*representing dialogueID where the character speaks*)
    - "netflixWatchID" : String (*watch id from netflix content's URL*)
- (contentProcessor ← contentDatabase)
    - Success / Failure
    - Error (if failure) - why might it fail?
        - Database is down
        - Received incomplete data

## *During game play*
> Updated : 3/29/19
- (Front → Application)
    - gameID
    - netflixWatchID
    - audioBuffer
    - dialogueID
- (Application → contentDatabase)
    - netflixWatchID
    - dialogueID
- (Application ← contentDatabase)
    - featureURL
    - dialogueEmotion
    - dialogueCaption
- (Application → Front, userDatabase)
    - Score (FIXME: i have 3 scores)
    - dialogueID
    - gameID

## *User quits game halfway*
- (Front → userDatabase)
    - gameID
    - contentID
    - Signal: “save buffer”
- (Front ← userDatabase)
    - Success (meaning “buffer saved!”)

## *User returns to previous (might be part of [GameInitialization](#game-initialization))*

## *Sign up*
- (front → userDatabase)
    - firstName
    - lastName
    - username
    - email
    - password
- (front ← userDatabase)
    - status: success/failure
    - error: (if failure)

## *Sign in*
- (front → userDatabase)
    - username
    - password
- (front ← userDatabase)
    - status: success/failure
    - error: (if failure)

## *Game Initialization*
> Description: User has selected an episode to play as a game. Details about the gameplay need to be initialized here.
- (front → userDatabase)
    - username
    - mediatype
    - mediaArray : details about the movie/show
- (front ← userDatabase)
    - status: success/failure
    - if (success): 
        - gameID
        - contentID





