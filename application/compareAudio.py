"""Compare audioClip to previously stored featureFile
For testing with `test.wav`
$ python3 compareAudio.py
"""

import subprocess

# add Impressionist HOME path
import sys
sys.path.insert(0, '../')
sys.path.insert(0, '../databuilder/')
from databuilder.extractFeatures import extractFeature as extract
sys.path.insert(0, '../signalComparison/')
from signalComparison.compareSig import compareSignals as compare

def compareAudioToFeature(audioFile, featureFile, verbose=False):
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
    
    # audioFile = '../frontend/audio_three-dialogue1.wav' # same file yields 100%
    status, error = extract(audioFile, 'test.csv', '../databuilder/configs/prosodyShs.conf', verbose=verbose)
    if not status: #failed
        print(error)
        exit()

    similarity = compare('audio_three-dialogue1.csv', 'test.csv', 'prosody', delimiter=';', verbose=verbose, plot=False)

    if verbose: print("Similarity: ", similarity)

    return similarity

if __name__=='__main__':
    audioFile = 'test.webm'
    featureFile = 'audio_three-dialogue1.csv'
    # print("Running feature comparison...(python)")
    similarity = compareAudioToFeature(audioFile, featureFile, verbose=False)
    print("---------------------------------------")
    print("Similarity score (out of 100.0):", round(similarity, ndigits=3))
    print("---------------------------------------")
