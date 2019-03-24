"""Compare audioClip to previously stored featureFile
For testing with `test.wav`
$ python3 compareAudio.py

Author: Haard @ Impressionist
"""

import subprocess

# add Impressionist HOME path
import sys
# sys.path.insert(0, '../')
sys.path.insert(0, 'databuilder/')
from databuilder.extractFeatures import extractFeature as extract
sys.path.insert(0, 'signalComparison/')
from signalComparison.compareSig import compareSignals as compare
sys.path.insert(0, 'speech_to_text/')

def validateAudioFileFormat(audioFile):
    assert (".wav" in audioFile or ".webm" in audioFile), "Error: only supports comparing audio for .wav and .webm files."
        
    # TODO: convert this step to bash script
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

def getProcessedFromContentDB(contentID, dialogueID):
    """Requests 
    """
    featureFileURL = ''
    emotion = '' 
    originalCaption = '' # dialogueID-th dialogue from captionFile
    originalCaptionFile = '' # entire caption file URL
    # construct json
    import json
    reqdict = {
        "contentID" : contentID,
        "dialogueID" : dialogueID
    }
    reqjson = json.dumps(reqdict)
    reqbytes = reqjson.encode('utf-8') # convert to bytes
    # prepare request
    import urllib.request
    backURL = "http://localhost:3000/cont/play"
    req = urllib.request.Request(backURL, method='POST')
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    req.add_header('Content-Length', len(reqbytes))
    # send request
    response = urllib.request.urlopen(req, reqbytes)
    resString = response.read().decode('utf-8')
    resjson = json.loads(resString)

    # parse json
    assert(resjson['status'] == "success"), "Error - requesting gameplay data\n"+resjson['error']
    assert('featureURL' in resjson and 'dialogueEmotion' in resjson and 'captionsFileURL' in resjson), "Error - Network response not containing one of the expected keys."
    featureFileURL = resjson['featureURL']
    emotion = resjson['dialogueEmotion']
    originalCaptionFile = resjson['captionsFileURL']
    originalCaption = getCaptionFromVTTcaptionFile(originalCaptionFile, dialogueID)

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
    from speech_to_text.transcribe_return_only_one_line import transcribe_file_with_word_time_offsets as transcribe
    print('import worked')
    exit()
    return 0

if __name__=='__main__':
    import sys
    """
    NEW system
    $ python compareAudio.py audioFile(.webm), contentID(str), dialogueID(number), gameID(str)
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
    # dummy data
    contentID = "5c971e36f4d9beaaf9ab6a87"
    dialogueID = 1
    audioFile = 'tmpFiles/test.webm'
    # gameID = 
    # 1. get processed data from contentDB
    featureFileURL, emotion, originalCaption = getProcessedFromContentDB(contentID, dialogueID)
    print(featureFileURL, emotion, originalCaption)
    # 2. Validate audioFile
    audioFile = validateAudioFileFormat(audioFile)
    # 3. comparePhonetic
    # phoneticSimilarity = comparePhoneticSimilarity(audioFile, featureFileURL, verbose=False)
    # print("Phonetic similarity -", phoneticSimilarity)
    # # 4. Compare Emotion
    # emotionSimilarity = compareEmotionSimilarity(audioFile, emotion, verbose=True)
    # print("Similar emotion -", emotionSimilarity)
    # 5. Compare Lyrics
    lyricalSimilarity = compareLyricalSimilarity(audioFile, originalCaption, verbose=False)


