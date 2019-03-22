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
- "rooms and stuff" 
    - what has this? - socket.io

## ContentProcessor
> STATUS: DOING
- [append to content DB](#append-to-content-database) 
    - SEND to contentDB
        {
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
- (contentProcessor → contentDatabase)
    - MediaID
    - dataArray (details of elements in the array in TV Show | Movie section above)
        - If id == 1
            - dataArray will contain TV show details
        - If id == 2
            - dataArray will contain Movie details
- (contentProcessor ← contentDatabase)
    - Success / Failure
    - Error (if failure) - why might it fail?
        - Database is down
        - Received incomplete data

## *During game play*
- (Front → Application)
    - gameID
    - contentID
    - audioBuffer
    - dialogueID
- (Application → contentDatabase)
    - contentID
    - dialogueID
- (Application ← contentDatabase)
    - featureURL
- (Application → Front, userDatabase)
    - Score
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





