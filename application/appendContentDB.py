"""Adds content to mongoDB contentDB
For testing with `test.wav`
$ python3 appendContentDB.py <parentFolder>
NOTE: argument is `parentFolder` containing video and subtitle files NOT individual files

Rules / notes
- parent directory of videoFile ????
- using configFile -> `databuilder/configs/prosodyShs.conf`
- MOST IMPORTANT: using relative paths so this file has to be in the same folder as `server.js` and `compareAudio.py` (VERY DELICATE STUFF)
- When adding files to database, convention should be followed (inside `contentData/README.md`)

Author: Haard @ Impressionist
"""

import argparse
import os
import subprocess
from datetime import timedelta

configFile = 'databuilder/configs/prosodyShs.conf'
VERBOSE=True

def extractTime(t):
    """converts ':' separated string into timedelta
    """
    t = t.split('.')
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

# input is a line ex: 00:00:09.833  --> 00:00:16.630
def getInterval(line):
    times = line.split('-->')
    start = times[0]
    end = times[1]
    start = extractTime(start)
    end = extractTime(end)
    return (start, end)

# returns list of (startTime, stopTime) tuples
def vttExtractDialogues(subtitlesFile):
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
        start = start[:-3]
        end = '0'+str(d[1])
        end = end[:-3]
        print(start, '-->', end)

def extractFeatures(captionFile, audioFile, tmpWave, featuresDir, configFile, verbose=False):
    """Extract features using OpenSMILE to folder LOCATION/features/ (`featuresDir`)
    """
    from scipy.io import wavfile
    samplingRate, audio = wavfile.read(audioFile)
    # get dialogue intervals
    indices = dialogueIntervalsToIndices(vttExtractDialogues(captionFile), samplingRate)

    featureFiles = []
    for count, ii in enumerate(indices):
        # split audioFile to tmpName
        start, end = ii
        wavfile.write(tmpWave, samplingRate, audio[start:end, :])
        # extract features
        csvOutFile = os.path.join(featuresDir, str(count)+".csv")
        cmd = "SMILExtract -C "+ configFile +" -I "+ tmpWave +" -csvoutput " + csvOutFile
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
        # print(result.stdout)
        if "Processing finished!" in result.stdout.decode('utf-8'):
            if verbose: print("Success! extracted features in:", csvOutFile)
            featureFiles.append(csvOutFile)
        else:
            error = "Feature extraction unsuccessful.\nstdout: "+result.stdout.decode('utf-8')
            if verbose: print(error)
            exit()

    return featureFiles

def deleteFiles(filesLst):
    for file in filesLst:
        if os.path.exists(file): os.remove(file)

def getFeatureFilesFromDir(featuresDir):
    allfiles = os.listdir(featuresDir)
    featureFiles = []
    count = 0
    for file in allfiles:
        if (file.endswith(".csv")):
            featureFiles.append( os.path.join(featuresDir, str(count)+".csv") )
            count += 1
    return featureFiles

def getVideoFileDuration(mediaFile):
    """Command: ffmpeg -i file.flv 2>&1 | grep "Duration"| cut -d ' ' -f 4 | sed s/,// | sed 's@\..*@@g' | awk '{ split($1, A, ":"); split(A[3], B, "."); print 3600*A[1] + 60*A[2] + B[1] }'
    """
    cmd = "ffmpeg -i "+mediaFile+""" 2>&1 | grep "Duration" | cut -d ' ' -f 4 | sed s/,// | sed 's@\..*@@g' | awk '{ split($1, A, ":"); split(A[3], B, "."); print 3600*A[1] + 60*A[2] + B[1] }'"""
    # print(cmd)
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
    result = result.stdout.decode('utf-8')
    try:
        result = int(result)
        return result
    except ValueError:
        print("Couldn't get length of media")
        return -1

def getMediaAndCaptionFiles(mediaDirectory):
    mediaFile = ''
    captionFile = ''
    error = ''
    allfiles = os.listdir(mediaDirectory)
    for file in allfiles:
        root, ext = os.path.splitext(file)
        if ext in ['.mkv', '.mp4', '.avi', '.flv']:
            if mediaFile != '': error += 'multiple video files found\n'
            mediaFile = os.path.join(mediaDirectory, file)
        elif ext == '.vtt':
            if captionFile !=  '': error += 'multiple caption files found\n'
            captionFile = os.path.join(mediaDirectory, file)
    if error != '':
        print(error)
        exit()
    return mediaFile, captionFile

if __name__=='__main__':
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("mediaDirectory", type=str, help="parent folder containing video file (.mkv or .mp4(tested)) and subtitle file (.vtt ; .srt WON'T work)")
    args = parser.parse_args()

    mediaFile, captionFile = getMediaAndCaptionFiles(args.mediaDirectory)
    dirName = os.path.dirname(mediaFile)
    tmpFullAudio = os.path.join(dirName, "tmpFullAudio.wav")
    tmpDialogue = os.path.join(dirName, "tmpDialogue.wav")
    featuresDir = os.path.join(dirName, "features")
    # used when converting video to audio
    samplingRate = 44100

    """
    Plan
    - create folder `LOCATION/features/`
    - convert .mp4 or .mkv to audio (.wav)
    - get dialogue intervals
    loop through intervals
        - produce tmp.wav from interval
        - produce features from tmp.wav
        - save to /features/PREFIX.csv
        - add to feature file paths
    - delete temp audio files
    - send post JSON to contentDB
    """

    # first make sure feature folder doesn't exist
    if (not os.path.isdir(featuresDir)):
        os.makedirs(featuresDir)

        # convert video to audio
        cmd = "ffmpeg -y -i " + mediaFile + " -ab 160k -ac 2 -ar "+str(samplingRate)+" -vn " + tmpFullAudio
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
        out = result.stdout.decode('utf-8')
        assert ("command not found" not in out), "Error: could not convert .webm to .wav because FFMPEG program is not installed"
        assert ("No such file" not in out), "Error: could not find " + mediaFile + "."
        #   check successful
        assert ("size=" in out), "Error: unknown error in converting `.webm` file to `.wav`"
        if VERBOSE: print("(ffmpeg) video successfully converted to audio!")

        # get dialogue intervals
        # indices = dialogueIntervalsToIndices(vttExtractDialogues(captionFile), samplingRate)
        featureFiles = extractFeatures(captionFile, tmpFullAudio, tmpDialogue, featuresDir, configFile, verbose=VERBOSE)
        deleteFiles([tmpFullAudio, tmpDialogue])
    else:
        # get featureFiles array
        if VERBOSE: print("features/ already exist, not extracting features again. Please delete the `features/` folder to extract.")
        # get featureFiles
        featureFiles = getFeatureFilesFromDir(featuresDir)

    # construct JSON to send to contentDB
    if "contentData/movies" in dirName:
        title = os.path.basename(dirName)
        season = episodeNum = 0
        episodeTitle = '' # NOTE: notify debbie of this addendum
    else:
        split = dirName.split(sep='/')
        episode = split[-1].split('-')
        episodeNum = int(episode[0])
        episodeTitle = " ".join(episode[1:])
        season = int(split[-2])
        title = split[-3]
    # get mediaFile length
    secondsDuration = getVideoFileDuration(mediaFile)
    # print(secondsDuration)
    contentdict = {
        "reqType": "appendContentDB",
        "title" : title,
        "episode" : episodeNum,
        "episodeTitle" : episodeTitle,
        "season" : season,
        "mediaFileLocation" : mediaFile,
        "captionFile" : captionFile,
        "length" : secondsDuration, # FIXME: What kind of number is she expecting? may fail if above enters else (think she might be expecting minutes (if so divide by 60))
        "featureFiles" : featureFiles
    }

    # convert to JSON
    import json
    contentJSON = json.dumps(contentdict)
    print(contentJSON)


