"""Compare audioClip to previously stored featureFile
For testing with `test.wav`
$ python3 compareAudio.py

Author: Haard @ Impressionist
"""

import subprocess
import time
# import cProfile
# pr = cProfile.Profile()
# add Impressionist HOME path
import sys
import os
import json
import urllib.request
# sys.path.insert(0, '../')
sys.path.insert(0, 'databuilder/')
from databuilder.extractFeatures import extractFeature as extract
sys.path.insert(0, 'signalComparison/')
from signalComparison.compareSig import compareSignals as compare
# sys.path.insert(0, 'speech_to_text/')
from speech_to_text.sub_user_similarity import similar

CONTENTDB_PORT = 3002
USERDB_PORT = 3001
# URLcontentDB_gamePlay = "http://localhost:"+str(CONTENTDB_PORT)+"/cont/play"
URLcontentDB_gamePlay = "https://impressionist-content-db-api-east-1.crossley.tech/"
URLcontentDB_gamePlay += "cont/play"
# URLuserDB_storeScoreData = "http://localhost:"+str(USERDB_PORT)+"/user/score"
URLuserDB_storeScoreData = "https://impressionist-user-db-api-east-1.crossley.tech/"
URLuserDB_storeScoreData += "user/score"

def validateAudioFileFormat(audioFile, profile=False):
    if (profile): start = time.time()
    assert (".wav" in audioFile or ".webm" in audioFile), "Error: only supports comparing audio for .wav and .webm files."
        
    # TODO: convert this step to bash script
    # FIXME: maybe sometimes even .wav files are corrupted. FFMPEG can fix it so it is in proper format to be opened by OpenSMILE. Maybe this should be run anyway. 
    if audioFile[-4:] == 'webm': # convert to `wav extension`
        import subprocess
        newFile = audioFile[:-4] + "wav"
        cmd = "ffmpeg -y -i " + audioFile + " " + newFile
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
        out = result.stdout.decode('utf-8')
        assert ("command not found" not in out), "Error: could not convert .webm to .wav because FFMPEG program is not installed"
        assert ("No such file" not in out), "Error: could not find " + audioFile + "."
        # Not sure if anything else can go wrong
        #   check successful
        assert ("size=" in out), "Error: unknown error in converting `.webm` file to `.wav`"
        audioFile = newFile
    
    if (profile): 
        end = time.time()
        print("(profile) validate audio file : ", end-start)
    return audioFile

def comparePhoneticSimilarity(audioFile, featureFile, verbose=False, profile=False):
    """Compare tone with OpenSMILE
    returns 0 score with error message if error occured
    """
    if (profile): start = time.time()
    assert(".wav" in audioFile), "Expected .wav as audioFile"
    configFile = 'databuilder/configs/prosodyShs.conf'
    error = ""
    if not (os.path.exists(configFile) and os.path.exists(audioFile) and os.path.exists(featureFile)):
        error = "(middle) error: one or more files don't exist (check paths). Cannot compare phonetics. exiting...\n"
        for ff in (configFile, audioFile, featureFile):
            if not os.path.exists(ff): error += "not found file: " + ff + "\n"
        print(error)
        return 0, error
    status, error = extract(audioFile, "test.csv", configFile, verbose=verbose)
    if not status: #failed
        error = "(middle) feature extraction error: " + error
        print(error)
        return 0, error
    similarity = compare("test.csv", featureFile, 'prosody', delimiter=';', verbose=verbose, plot=False)
    if verbose: print("Similarity: ", similarity)
    if (profile):
        end = time.time()
        print("(profile) compare phonetic similarity : ", end-start)
    return similarity, error

def getCaptionFromVTTcaptionFile(vttFile, dialogueID):
    """Returns the dialogueID-th caption from vttFile
    """
    import webvtt
    return webvtt.read(vttFile)[dialogueID].text

def getProcessedFromContentDB(netflixWatchID, dialogueID, profile=False):
    """Requests contentDB for data using urllib
    """
    if (profile): start = time.time()
    featureFileURL = ''
    emotion = '' 
    originalCaption = '' # dialogueID-th dialogue from captionFile
    # construct json
    reqdict = {
        "netflixWatchID" : netflixWatchID,
        "dialogueID" : dialogueID
    }
    reqjson = json.dumps(reqdict)
    reqbytes = reqjson.encode('utf-8') # convert to bytes
    # prepare request
    req = urllib.request.Request(URLcontentDB_gamePlay, method='POST')
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    req.add_header('Content-Length', len(reqbytes))
    req.add_header('User-Agent', 'Chrome')
    # send request
    print("reqbytes:", reqbytes)
    response = urllib.request.urlopen(req, reqbytes)
    resString = response.read().decode('utf-8')
    resjson = json.loads(resString)

    # parse json
    assert(resjson['status'] == "success"), "Error - requesting gameplay data\n"+resjson['error']
    assert('featureURL' in resjson and 'dialogueEmotion' in resjson and 'dialogueCaption' in resjson), "Error - Network response not containing one of the expected keys."
    featureFileURL = resjson['featureURL']
    emotion = resjson['dialogueEmotion']
    # originalCaptionFile = resjson['captionsFileURL']
    # # FIXME: this will change if storing 2D dialogue array in database
    # originalCaption = getCaptionFromVTTcaptionFile(originalCaptionFile, dialogueID)
    originalCaption = resjson['dialogueCaption'][2]
    if (profile):
        end = time.time()
        print("(profile) get data from contentDB : ", end-start)
    return featureFileURL, emotion, originalCaption

def compareEmotionSimilarity(audioFile, emotion, emoPredictor, verbose=False, profile=False):
    """returns True (if same emotion)"""
    error = ""
    if (profile): start = time.time()
    # from speech_to_emotion.emotion_classifier_nn import livePredictions
    # emoPredictor = livePredictions(path='speech_to_emotion/Emotion_Voice_Detection_Model.h5', file=audioFile)
    # emoPredictor.load_model()
    emoPredictor.file = audioFile
    prediction = emoPredictor.makepredictions()
    if verbose: print("user emotion -", prediction)
    if (profile):
        end = time.time()
        print("(profile) compare emotion : ", end-start)
    return (prediction == emotion), prediction, error

def compareLyricalSimilarity(userTranscript, originalCaption, verbose=False, profile=False):
    """Convert audioFile to text and compares against originalCaption string
    Returns 0 if an error occured
    """
    error = ""
    if (profile): start = time.time()
    # cmp = compareToDialogue(audioFile, originalCaption, verbose=verbose)
    cmp = similar(userTranscript, originalCaption)
    if (profile):
        end = time.time()
        print("(profile) lyrical similarity :", end-start)
    return cmp, error

def _logToFile(logsLst, logFile="logFile.txt"):
    """Log any errors / updates worth consideration to `logFile.txt`
    """
    with open(logFile, "a+") as file:
        message = "\n".join(logsLst)
        file.write("------------------Middle logs--------------------\n")
        
        file.write(message + "\n")
        

def performThreeComparisons(netflixWatchID, dialogueID, audioFile, gameID, userTranscript, emoPredictor, verbose=False, profile=False, logErrors=True):
    """Perform comparison 
    $ python compareAudio.py audioFile(.webm), netflixWatchID(str), dialogueID(number), gameID(str)
        - NOTE: gameID to report to userDB
    1. get processed data from contentDB
        featureFileURL  (for signal similarity)
        emotion         (for emotion similarity)
        captionsFileURL (for lyrical similarity)
    2. validate audioFile
    3. comparePhonetic
    4. compareEmotion
    5. compareLyrical
    """
    logFile = "logFile.txt"
    errorsLst = []
    resultDICT = {"gameID" : gameID, "dialogueID" : dialogueID, "error" : "", "success" : True}
    overallscore = 0.0
    totalScores = 2
    # 1. get processed data from contentDB
    featureFileURL, originalEmotion, originalCaption = getProcessedFromContentDB(netflixWatchID, dialogueID, profile=profile)
    resultDICT["originalEmotion"] = originalEmotion
    resultDICT["originalCaption"] = originalCaption
    # print(featureFileURL, emotion, originalCaption)
    # 2. Validate audioFile
    audioFile = validateAudioFileFormat(audioFile, profile=profile)
    # 3. comparePhonetic
    featureFileURL = "132.csv"
    phoneticSimilarity, error = comparePhoneticSimilarity(audioFile, featureFileURL, verbose=False, profile=profile)
    if error is not "":
        errorsLst.append(error)  # Log error
    resultDICT["phoneticScore"] = phoneticSimilarity
    if verbose: print("Phonetic similarity:", resultDICT["phoneticScore"])
    overallscore += resultDICT["phoneticScore"]
    # 4. Compare Emotion
    emotionSimilarity, userEmotion, error = compareEmotionSimilarity(audioFile, originalEmotion, emoPredictor, verbose=True, profile=profile)
    if error is not "":
        errorsLst.append(error)  # Log error
    resultDICT["emotionScore"] = 20.0 if emotionSimilarity else 0.0
    resultDICT["userEmotion"] = userEmotion
    if verbose: print("Similar emotion:", resultDICT["emotionScore"])
    # 5. Compare Lyrics
    lyricalSimilarity, error = compareLyricalSimilarity(userTranscript, originalCaption, verbose=False, profile=profile)
    if error is not "":
        errorsLst.append(error)  # Log error
    resultDICT["userTranscript"] = userTranscript
    resultDICT["lyricalScore"] = lyricalSimilarity*100
    if verbose: print("Lyrical Similarity:", resultDICT["lyricalScore"])
    overallscore += resultDICT["lyricalScore"]
    overallscore /= totalScores
    overallscore += resultDICT["emotionScore"] # add emotion bonus

    # add average score
    resultDICT["averageScore"] = overallscore

    # convert to JSON
    resultJSON = json.dumps(resultDICT)
    resultBYTES = resultJSON.encode('utf-8')

    if logErrors: _logToFile(errorsLst, logFile=logFile)

    return resultBYTES, resultJSON, errorsLst

def sendScoreToBack(resultBYTES, verbose):
    # send to back
    req = urllib.request.Request(URLuserDB_storeScoreData, method='POST')
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    req.add_header('Content-Length', len(resultBYTES))
    req.add_header('User-Agent', 'Chrome')
    backResponse = urllib.request.urlopen(req, resultBYTES)
    backResponse = backResponse.read().decode('utf-8')
    backResponse = json.loads(backResponse)
    if verbose: print("userDB response: ", backResponse)
    return backResponse

if __name__=='__main__':
    
    # dummy data for Friends s02 e12
    netflixWatchID = "70274032"
    dialogueID = 0
    audioFile = 'tmpFiles/test.webm'
    gameID = "5c9e7faee8175c4566425568"  # don't have this yet to report score
    resultBYTES = performThreeComparisons(netflixWatchID, dialogueID, audioFile, gameID, verbose=True)
    print(resultBYTES)
    # backResponse = sendScoreToBack(resultBYTES)
    # print(backResponse)


