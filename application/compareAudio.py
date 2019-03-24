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

if __name__=='__main__':
    import sys
    # audioFile = sys.argv[1]
    audioFile = 'test.webm' 
    audioFile = validateAudioFileFormat(audioFile)
    # featureFile = sys.argv[2]
    featureFile = 'arbitrary-featurefile.csv'
    # emotion = sys.argv[3]
    emotion = "" 
    # subtitleFile = sys.argv[4]
    subtitleFile = ""
    # dialogueId = sys.argv[5]
    dialogueId = 1

    signalSimilarity = comparePhoneticSimilarity(audioFile, featureFile, verbose=False)
    print("---------------------------------------")
    print("Similarity score (out of 100.0):", round(signalSimilarity, ndigits=3))
    print("---------------------------------------")

    # Next compare emotion
    # emotionSimilarity = compareEmotionSimilarity(audioFile, emotion, verbose=False)

    # Next compare lyrical similarity
    # lyricalSimilarity = compareLyricalSimilarity(audioFile, subtitleFile, dialogueId, verbose=False)
