"""Generates individual dialogue audio clips from original audio clip using subtitle file
Author: Haard @ Impressionist
"""

import argparse
from datetime import timedelta

def extractTime(t):
    """converts ':' separated string into timedelta
    """
    t = t.split(',')
    ms = int(t[1].strip())
    t = t[0].split(':')
    if (len(t) == 3):
        h = int(t[0].strip())
        m = int(t[1].strip())
        s = int(t[2].strip())
        return timedelta(hours=h, minutes=m, seconds=s, milliseconds=ms)
    else:
        print("could not extract time t =", t)
        exit()

# input is a line ex: 00:00:09,833  --> 00:00:16,630
def getInterval(line):
    times = line.split('-->')
    start = times[0] 
    end = times[1]
    start = extractTime(start)
    end = extractTime(end)
    return (start, end)

# returns list of (startTime, stopTime) tuples
def srtExtractDialogues(subtitlesFile):
    dialogueIntervals = []
    with open(subtitlesFile, 'r') as subfile:
        for line in subfile:
            if '-->' in line:
                interval = getInterval(line)
                dialogueIntervals.append(interval)
    return dialogueIntervals

def timedeltaToIndex(t, samplingRate): 
    # print(t.seconds + t.microseconds/1000000)
    # print((t.seconds + t.microseconds/1000000)*samplingRate)
    index = int((t.seconds + (t.microseconds/1000000)) * samplingRate // 1)
    # print("index:",index)
    return index

def dialogueIntervalsToIndices(dIntervals, samplingRate):
    # print(samplingRate)
    indices = []
    for ii in dIntervals:
        start, end = ii
        start = timedeltaToIndex(start, samplingRate)
        end = timedeltaToIndex(end, samplingRate)
        indices.append((start, end))
    return indices

def printIntervals(dIntervals):
    for d in dIntervals:
        start = '0'+str(d[0])
        start = start.replace('.', ',')[:-3]
        end = '0'+str(d[1])
        end = end.replace('.', ',')[:-3]
        print(start, '-->', end)

def generateWavDialogueFiles(audioFile, subtitlesFile, verbose=False):
    import os
    from scipy.io import wavfile
    prefix, _ = os.path.splitext(audioFile)
    extension = '.wav'
    prefix += '-dialogue'
    #   read audio file
    rate, audio = wavfile.read(args.audio_file)  # rate is samples / second
    #   read subtitles
    dIntervals = srtExtractDialogues(subtitlesFile)
    indexIntervals = dialogueIntervalsToIndices(dIntervals, rate)

    count = 1
    for ii in indexIntervals:
        dfile = prefix + str(count) + extension
        count += 1
        start, end = ii
        # FIXME: assuming 2D array
        wavfile.write(dfile, rate, audio[start:end, :])
        if verbose: print("Wrote dialogue audio:", dfile)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("audio_file", type=str, help="original audio file (.wav extension)")
    parser.add_argument("subtitles_file", type=str, help="subtitile file (.srt extension)")
    args = parser.parse_args()

    #   get dialogues
    generateWavDialogueFiles(args.audio_file, args.subtitles_file, verbose=True)


    


