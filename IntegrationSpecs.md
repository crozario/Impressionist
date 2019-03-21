# Front-middle Integration Plan
## Middle REST API

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





