"""Compare audioClip to previously stored featureFile
// execute python dataBuilder.extractFeatures.py
python ../databuilder/extractFeatures.py <test.wav> ../databuilder/configs/prosodyShs.conf -c test.csv
// execute python signalComparison.compareSig.py
$ python ../signalComparison/compareSig.py audio_three-dialogue1.csv test.csv prosody
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
    status, error = extract(audioFile, 'test.csv', '../databuilder/configs/prosodyShs.conf', verbose=False)
    if not status: #failed
        print(error)
        exit()

    similarity = compare('audio_three-dialogue1.csv', 'test.csv', 'prosody', delimiter=';', verbose=False, plot=False)

    if verbose: print("Similarity: ", similarity)

    return similarity

if __name__=='__main__':
    compareAudioToFeature(verbose=True)
