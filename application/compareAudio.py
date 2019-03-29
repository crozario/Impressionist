"""Compare audioClip to previously stored featureFile
For testing with `test.wav`
$ python3 compareAudio.py

Author: Haard @ Impressionist
"""

import subprocess

# add Impressionist HOME path
import sys
import json
import urllib.request
# sys.path.insert(0, '../')
sys.path.insert(0, 'databuilder/')
from databuilder.extractFeatures import extractFeature as extract
sys.path.insert(0, 'signalComparison/')
from signalComparison.compareSig import compareSignals as compare
sys.path.insert(0, 'speech_to_text/')

CONTENTDB_PORT = 3002
USERDB_PORT = 3001
URLcontentDB_gamePlay = "http://localhost:"+str(CONTENTDB_PORT)+"/cont/play"
URLuserDB_storeScoreData = "http://localhost:"+str(USERDB_PORT)+"/user/score"

def validateAudioFileFormat(audioFile):
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
    
    return audioFile

def comparePhoneticSimilarity(audioFile, featureFile, verbose=False):
    assert(".wav" in audioFile), "Expected .wav as audioFile"
    # audioFile = '../frontend/audio_three-dialogue1.wav' # same file yields 100%
    status, error = extract(audioFile, 'test.csv', 'databuilder/configs/prosodyShs.conf', verbose=verbose)
    if not status: #failed
        print(error)
        exit()

    similarity = compare("test.csv", featureFile, 'prosody', delimiter=';', verbose=verbose, plot=False)
    if verbose: print("Similarity: ", similarity)
    return similarity

def getCaptionFromVTTcaptionFile(vttFile, dialogueID):
    """Returns the dialogueID-th caption from vttFile
    """
    import webvtt
    return webvtt.read(vttFile)[dialogueID].text

def getProcessedFromContentDB(netflixWatchID, dialogueID):
    """Requests contentDB for data using urllib
    """
    featureFileURL = ''
    emotion = '' 
    originalCaption = '' # dialogueID-th dialogue from captionFile
    originalCaptionFile = '' # entire caption file URL
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
    # send request
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

    return featureFileURL, emotion, originalCaption

def compareEmotionSimilarity(audioFile, emotion, verbose=False):
    """returns True (if same emotion)"""
    from speech_to_emotion.emotion_classifier_nn import livePredictions
    emoPredictor = livePredictions(path='speech_to_emotion/Emotion_Voice_Detection_Model.h5', file=audioFile)
    emoPredictor.load_model()
    prediction = emoPredictor.makepredictions()
    if verbose: print("user emotion -", prediction)
    return (prediction == emotion)

def compareLyricalSimilarity(audioFile, originalCaption, verbose=False):
    """Convert audioFile to text and compares against originalCaption string"""
    sys.path.insert(0, 'speech_to_text/')
    from speech_to_text.sub_user_similarity import compareToDialogue
    return compareToDialogue(audioFile, originalCaption, verbose=verbose)

def performThreeComparisons(netflixWatchID, dialogueID, audioFile, gameID, verbose=False, getJSON=False):
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
    resultDICT = {}
    # 1. get processed data from contentDB
    featureFileURL, originalEmotion, originalCaption = getProcessedFromContentDB(netflixWatchID, dialogueID)
    resultDICT["originalEmotion"] = originalEmotion
    resultDICT["originalCaption"] = originalCaption
    # print(featureFileURL, emotion, originalCaption)
    # 2. Validate audioFile
    audioFile = validateAudioFileFormat(audioFile)
    # 3. comparePhonetic
    phoneticSimilarity = comparePhoneticSimilarity(audioFile, featureFileURL, verbose=False)
    if verbose: print("Phonetic similarity:", phoneticSimilarity)
    resultDICT["phoneticScore"] = phoneticSimilarity
    # 4. Compare Emotion
    emotionSimilarity = compareEmotionSimilarity(audioFile, originalEmotion, verbose=True)
    if verbose: print("Similar emotion:", emotionSimilarity)
    resultDICT["emotionScore"] = 100.0 if emotionSimilarity else 0.0
    # 5. Compare Lyrics
    lyricalSimilarity = compareLyricalSimilarity(audioFile, originalCaption, verbose=False)
    if verbose: print("Lyrical Similarity:", lyricalSimilarity)
    resultDICT["lyricalScore"] = lyricalSimilarity*100

    # convert to JSON
    resultJSON = json.dumps(resultDICT)
    resultBYTES = resultJSON.encode('utf-8')
    # send to back

    # send the update status to front?

    return resultBYTES

if __name__=='__main__':
    
    # dummy data for Friends s02 e12
    netflixWatchID = "70274032"
    dialogueID = 0
    audioFile = 'tmpFiles/test.webm'
    gameID = "" # don't have this yet to report score
    resultBYTES = performThreeComparisons(netflixWatchID, dialogueID, audioFile, gameID, verbose=True)
    print(resultBYTES)

    # next send back scores to front and back (userDB)



