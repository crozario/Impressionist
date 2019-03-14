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

def compareAudioToFeature(verbose=False):
    audioFile = 'test.wav' 
    # audioFile = '../frontend/audio_three-dialogue1.wav' # same file yields 100%
    status, error = extract(audioFile, 'test.csv', '../databuilder/configs/prosodyShs.conf', verbose=verbose)
    if not status: #failed
        print(error)
        exit()

    similarity = compare('audio_three-dialogue1.csv', 'test.csv', 'prosody', delimiter=';', verbose=verbose, plot=False)

    if verbose: print("Similarity: ", similarity)

    return similarity

if __name__=='__main__':
    similarity = compareAudioToFeature(verbose=False)
    print("---------------------------------------")
    print("Similarity score (out of 100.0):", round(similarity, ndigits=3))
    print("---------------------------------------")
