"""Extracts dialogues from audio clips using subtitle file

"""

import argparse
from scipy.io import wavfile
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
        count = 1
        for line in subfile:
            if '-->' in line:
                interval = getInterval(line)
                dialogueIntervals.append(interval)
    return dialogueIntervals

def printIntervals(dIntervals):
    for d in dIntervals:
        start = '0'+str(d[0])
        start = start.replace('.', ',')[:-3]
        end = '0'+str(d[1])
        end = end.replace('.', ',')[:-3]
        print(start, '-->', end)



if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("audio_file", type=str, help="original subtitile file (.srt extension)")
    parser.add_argument("subtitles_file", type=str, help="subtitile file (.srt extension)")
    args = parser.parse_args()

    #   Read in audio file
    rate, audio = wavfile.read(args.audio_file) # rate is samples / second
    print(audio.shape)
    print("length (seconds):", audio.shape[0]/rate)

    dialogues = srtExtractDialogues(args.subtitles_file)
    printIntervals(dialogues)

    exit()

    import matplotlib.pyplot as plt
    plt.subplot(2,1,1)
    plt.plot(audio[:,0])
    plt.subplot(2,1,2)
    plt.plot(audio[:,1])
    plt.show()
    


