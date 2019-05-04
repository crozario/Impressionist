"""Adds content to mongoDB contentDB
    $ python3 appendContentDB.py <parentFolder>
NOTE: arg `parentFolder` is NOT individual file
Example:
    $ python appendContentDB.py ../contentData/tvShows/Friends/02/12-The-One-After-The-Superbowl-Part1/ "70274032" --subsOffset=-2000
Rules / notes
- using configFile -> `databuilder/configs/prosodyShs.conf`
- MOST IMPORTANT: using relative paths so this file has to be in the same folder as `server` and `compareAudio.py` and any other file calling it (VERY DELICATE STUFF)
- When adding files to database, convention should be followed (inside `contentData/README.md`)
- Using fixed samplerate (44100) when converting content video to audio using FFMPEG

Author: Haard @ Impressionist
"""

import argparse
import os
import subprocess
from datetime import timedelta
import webvtt
import shutil
from difflib import SequenceMatcher
import sys

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

def timedeltaToMilli(t):
    return (t.days * 86400000) + (t.seconds * 1000) + (t.microseconds / 1000)

def convertIntervalsToMilliseconds(dIntervals):
    dMilliIntervals = []
    for interval in dIntervals:
        start, end = interval
        start = timedeltaToMilli(start)
        end = timedeltaToMilli(end)
        dMilliIntervals.append((start, end))
    return dMilliIntervals

def timedeltaToIndex(t, samplingRate):
    # print(t.seconds + t.microseconds/1000000)
    # print((t.seconds + t.microseconds/1000000)*samplingRate)
    index = int((t.seconds + (t.microseconds/1000000)) * samplingRate // 1)
    # print("index:",index)
    return index

def dialogueIntervalsToIndices(dIntervals, samplingRate, offset=None):
    # print(samplingRate)
    indices = []
    for ii in dIntervals:
        start, end = ii
        start = timedeltaToIndex(start, samplingRate)
        end = timedeltaToIndex(end, samplingRate)
        if offset is not None:
            start += offset
            end += offset
        indices.append((start, end))
    return indices

def printIntervals(dIntervals):
    for d in dIntervals:
        start = '0'+str(d[0])
        start = start[:-3]
        end = '0'+str(d[1])
        end = end[:-3]
        print(start, '-->', end)

def writeStringLstToCSV(strLst, fileName):
    line = ",".join(strLst)
    with open(fileName, "w") as emoFile:
        emoFile.write(line)
    
def readCSVtoStringLst(fileName):
    lst = []
    with open(fileName, "r") as emoFile:
        line = emoFile.readlines()
        assert(len(line) == 1), "expecting one line csv file"
        lst = line[0].split(',')
    return lst


def extractFeatures(captionFile, audioFile, tmpWave, featuresDir, configFile, emotionsLogFile, videoOffset,  verbose=False):
    """Extract features using OpenSMILE to folder LOCATION/features/ (`featuresDir`)
    """
    from scipy.io import wavfile
    samplingRate, audio = wavfile.read(audioFile)
    # print(len(audio))
    # get dialogue intervals
    indexOffset = timedeltaToIndex(videoOffset, samplingRate) # convert timedelta offset to index offset
    indices = dialogueIntervalsToIndices(vttExtractDialogues(captionFile), samplingRate, offset=indexOffset)

    featureFiles = []
    # get emotion
    from speech_to_emotion.emotion_classifier_nn import livePredictions
    emoPredictor = livePredictions(path='speech_to_emotion/Emotion_Voice_Detection_Model.h5', file='speech-to-text/dummy.wav')
    emoPredictor.load_model()

    emotionsLst = []
    totalDialogues = len(indices)
    print("Extracting features and emotions... (total "+str(totalDialogues)+")")
    for count, ii in enumerate(indices):
        # split audioFile to tmpName
        start, end = ii
        if (start > len(audio) or end > len(audio)):
            print("start or end was greater than len audio! breaking")
            break
        wavfile.write(tmpWave, samplingRate, audio[start:end, :])
        # extract features
        csvOutFile = os.path.join(featuresDir, str(count)+".csv")
        cmd = "SMILExtract -C "+ configFile +" -I "+ tmpWave +" -csvoutput " + csvOutFile
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
        # print(result.stdout)
        if "Processing finished!" in result.stdout.decode('utf-8'):
            # if verbose: print("Success! extracted features in:", csvOutFile)
            featureFiles.append(csvOutFile)
        else:
            error = "Feature extraction unsuccessful.\nstdout: "+result.stdout.decode('utf-8')
            if verbose: print(error)
            exit()
        
        # extract emotion
        emoPredictor.file = tmpWave
        emotionsLst.append(emoPredictor.makepredictions())
        print("Extraction progress: ", count+1, sep='', end="\r", flush=True)
    # log the emotions
    emotionsLogFile
    writeStringLstToCSV(emotionsLst, emotionsLogFile)

    return featureFiles, emotionsLst

def deleteFiles(filesLst):
    for file in filesLst:
        if os.path.exists(file): os.remove(file)

def getFeatureFilesFromDir(featuresDir):
    """Expects that files are labeled 0.csv, ..., n.csv
    """
    allfiles = os.listdir(featuresDir)
    featureFiles = []
    count = 0
    for file in allfiles:
        if (file.endswith(".csv")):
            featureFiles.append( os.path.join(featuresDir, str(count)+".csv") )
            count += 1
    return featureFiles

def getVideoFileDuration(mediaFile):
    """returns duration of file in seconds as int
    uses ffmpeg
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


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def getVideoOffset(netflixVTT, localSRT, manual=True):
    """compare dialogues between and returns time offset
    returns timedelta object (can be used later)
    POSITIVE offset -> add offset to subtitle times when extracting dialogues from video
    NEGATIVE offset -> subtract
    """
    netVTT = webvtt.read(netflixVTT)
    locSRT = webvtt.from_srt(localSRT)
    lennet = len(netVTT)
    lenloc = len(locSRT)
    ni = 0; # netVTT count
    li = 0; # locSRT count
    skipcnt = 0
    PUNCTUATION = '!"#$%&()*+,-./;<=>?@[\\]^_`{|}~'

    if (manual):
        while (ni < lennet and li < lenloc):
            for _ in range(5):
                print(ni)
                print("LEFT\t", netVTT[ni].text.replace("\n", " "))
                print("RIGHT\t", locSRT[li].text.replace("\n", " "))
                ni += 1
                li += 1
            leftChoice = input("left choice [0-4], ENTER to skip: ")
            if leftChoice == "":
                continue
            rightChoice = input("right choice [0-4]: ")
            start_ni = netVTT[int(leftChoice)].start
            # print(netVTT[ni], "start:", start_ni)
            start_li = locSRT[int(rightChoice)].start
            # print(locSRT[li], "start:", start_li)
            difference = extractTime(start_li) - extractTime(start_ni)
            # print("diff:", difference)
            return difference

    offsetsLst = []

    while (ni < len(netVTT) and li < len(locSRT)):
        # print(ni, li)
        lhs = netVTT[ni].text
        lhs = lhs.strip().lower().translate(str.maketrans(PUNCTUATION, ' '*len(PUNCTUATION)))
        lhs = " ".join(lhs.split())
        rhs = locSRT[li].text
        rhs = rhs.strip().lower().translate(str.maketrans(PUNCTUATION, ' '*len(PUNCTUATION)))
        rhs = " ".join(rhs.split())
        if ("♪" in lhs): 
            ni += 1
            continue
        if ("♪" in rhs):
            li += 1
            continue

        # print(lhs, " | ", rhs)
        cmpScore = similar(lhs, rhs)
        # print("score:", cmpScore)
        if cmpScore < 0.95:
            # print(ni, li)
            li += 1# skip
            skipcnt += 1
            if (skipcnt > 3):
                li -= skipcnt
                ni += 1
                skipcnt = 0
        else:
            # print(ni, li)
            start_ni = netVTT[ni].start
            # print(netVTT[ni], "start:", start_ni)
            start_li = locSRT[li].start
            # print(locSRT[li], "start:", start_li)
            difference = extractTime(start_li) - extractTime(start_ni)
            # print("diff:", difference)
            offsetsLst.append(difference)
            # return difference
            ni += 1
            li += 1

    mean = sum(offsetsLst, timedelta(0))/len(offsetsLst)
    if (mean > timedelta(seconds=4) or mean < timedelta(seconds=-4)):
        print("mean offset is", str(mean))
        res = input("still continue? (yes|no): ")
        if res == "no":
            print("list of offsets:", [str(o) for o in offsetsLst])
            exit()

    return mean

def getMediaAndCaptionFiles(mediaDirectory):
    """get videoFile and captionFile full path locations
    """
    mediaFile = ''
    captionFile = ''
    SRTfile = ''
    error = ''
    allfiles = os.listdir(mediaDirectory)
    for file in allfiles:
        prefix, ext = os.path.splitext(file)
        if ext in ['.mkv', '.mp4', '.avi', '.flv']:
            if mediaFile != '': error += 'multiple video files found\n'
            mediaFile = os.path.join(mediaDirectory, file)
            if ext == '.mkv': videotype = '.mkv'
            elif ext == '.mp4': videotype = '.mp4'
            elif ext == '.avi': videotype = '.avi'
            else: videotype = '.flv'
        elif ext == '.vtt':
            if "labeled_subs" in prefix:
                print("found labeled_subs")
                if captionFile !=  '': error += 'multiple labeled_subs caption files found\n'
                captionFile = os.path.join(mediaDirectory, file)
                netflixWatchID = prefix.replace("labeled_subs_", "")
        elif ext == '.srt':
            SRTfile = os.path.join(mediaDirectory, file)
    if error != '':
        print(error)
        exit()
    else:
        if captionFile != '' and SRTfile != '':
            videoOffset = getVideoOffset(captionFile, SRTfile)
        elif SRTfile == '':
            print("SRT file not found to sync subtitles. Try manually.")
            offset_seconds = input("Captions offset seconds: ")
            offset_ms = input("captions offset ms: ")
            videoOffset = timedelta(seconds=int(offset_seconds), microseconds=int(offset_ms)*1000)
        else:
            print("VTT labeled_subs... Caption file not found")
            exit()
    return mediaFile, captionFile, videoOffset, netflixWatchID, videotype

if __name__=='__main__':
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("mediaDirectory", type=str, help="parent folder containing video file (.mkv or .mp4(tested)) and subtitle file (.vtt ; .srt WON'T work)")
    # parser.add_argument("netflixWatchID", type=str, help="watch id from netflix content's URL. REQUIRED argument because all video supported are currently netflix.")
    # reason for offset is because netflix subtitles are shifted a bit
    parser.add_argument('--force', help="this will replace previous features/ folder with new features", action='store_true', default=False)
    parser.add_argument('--subsOffset', help="add the certain float offset, in milliseconds, to the times read from .vtt subtitle file above. (default) 0", type=float, default=0.0)
    args = parser.parse_args()

    mediaFile, captionFile, videoOffset, netflixWatchID, videotype = getMediaAndCaptionFiles(args.mediaDirectory)

    # mediaFile = mediaFile.replace("'", "\\'")
    dirName = args.mediaDirectory
    if "'" in dirName:
        print("Apostrophe in dir names is not handled.")
        exit()
    # dirName = dirName.replace("'", "\\'")
    # print(dirName)

    print("mediaFile:", mediaFile)
    print("captionFile:", captionFile)
    print("videoOffset:", videoOffset)
    print("netflixWatchID", netflixWatchID)

    tmpFullAudio = os.path.join(dirName, "tmpFullAudio.wav")
    tmpDialogue = os.path.join(dirName, "tmpDialogue.wav")
    featuresDir = os.path.join(dirName, "features")
    emotionsLogFile = os.path.join(dirName, "emotions.csv")
    # used when converting video to audio
    samplingRate = 44100
    # FIXME: add `netflixSubtitleOffset` from front in a better way
    # netflixSubtitleOffset = args.subsOffset  # netflixSubtitleOffset = -2000
    netflixSubtitleOffset = 0 # because only using netflix subtitles now (extracted using 'Subtitles for Netflix' chrome extension)
    # netflixWatchID = args.netflixWatchID  # netflixWatchID = "70274032"

    # cmd = "ffmpeg -y -i " + mediaFile + " -ab 160k -ac 2 -ar "+str(samplingRate)+" -vn " + tmpFullAudio
    # print("cmd", cmd)

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
        - extract emotion
        - save to list
    - log emtions to csv file
    - delete temp audio files
    - send post JSON to contentDB
    """

    # first make sure feature folder doesn't exist
    if (not os.path.isdir(featuresDir) or args.force):
        if os.path.isdir(featuresDir):
            shutil.rmtree(featuresDir)
        os.makedirs(featuresDir)

        # convert video to audio
        if videotype == '.mp4':
            cmd = " ".join(['ffmpeg -i', mediaFile, '-ac 2 -f wav', tmpFullAudio])
        else:
            cmd = "ffmpeg -y -i " + mediaFile + " -ab 160k -ac 2 -ar "+str(samplingRate)+" -vn " + tmpFullAudio

        # print("cmd", cmd)
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
        out = result.stdout.decode('utf-8')
        assert ("command not found" not in out), "Error: could not convert .webm to .wav because FFMPEG program is not installed"
        assert ("No such file" not in out), "Error: could not find " + mediaFile + ".\n" + "FFMPEG error:" + out
        #   check successful
        assert ("size=" in out), "Error: unknown error in converting video mediaFile to `.wav`"+ ".\n" + "FFMPEG error:" + out
        if VERBOSE: print("(ffmpeg) video successfully converted to audio!")

        # get dialogue intervals
        # indices = dialogueIntervalsToIndices(vttExtractDialogues(captionFile), samplingRate)
        featureFiles, emotions = extractFeatures(captionFile, tmpFullAudio, tmpDialogue, featuresDir, configFile, emotionsLogFile, videoOffset, verbose=VERBOSE)
        deleteFiles([tmpFullAudio, tmpDialogue])
    else:
        # get featureFiles array
        if VERBOSE: print("features/ already exist, not extracting features again. Please delete the `features/` folder to extract.")
        # get featureFiles
        featureFiles = getFeatureFilesFromDir(featuresDir)
        emotions = readCSVtoStringLst(emotionsLogFile)

    # construct JSON to send to contentDB
    # get mediaFile length
    secondsDuration = getVideoFileDuration(mediaFile)
    # get dialogue information of vtt file
    from dialogueExtraction.dialogueExtraction import getUniqueCharacter, getDialogueIntervalsWithCaptions, getCharacterDialogueIdsDict
    uniqueCharacterNames = getUniqueCharacter(captionFile)
    dialogues2Darray = getDialogueIntervalsWithCaptions(captionFile, offset=netflixSubtitleOffset)
    characterDialogueIDsDict = getCharacterDialogueIdsDict(captionFile)
    # print(characterDialogueIDsDict)
    # exit()
    contentdict = {
        "reqType" : "appendContentDB",
        "mediaFileLocation" : mediaFile,
        "length" : secondsDuration,
        "featureFileLocations" : featureFiles, 
        "captionFile" : captionFile,
        "emotionsList" : emotions,
        "captions" : dialogues2Darray, 
        "netflixSubtitleOffset": netflixSubtitleOffset, 
        "characterNames" : uniqueCharacterNames, 
        "characterDialogueIDs" : characterDialogueIDsDict,
        "netflixWatchID" : netflixWatchID
    }
    if "contentData/movies" in dirName:
        contentdict["title"] = os.path.basename(dirName)
    else:
        # print(dirName)
        split = dirName.split(sep='/')
        # print(split)
        if split[-1] == "": split = split[:-1]
        # print(split)
        episode = split[-1].split('-')
        contentdict["episodeNumber"] = int(episode[0])
        contentdict["episodeTitle"] = " ".join(episode[1:])
        contentdict["seasonNumber"] = int(split[-2])
        contentdict["title"] = split[-3]
        # print(contentdict)

    # convert to JSON
    import json
    contentJSON = json.dumps(contentdict)
    # print("---------_sending_-----------")
    # print(contentJSON)
    # print("-----------_end_-------------")

    # SEND jSON
    import urllib.request #ref: https://stackoverflow.com/a/26876308/7303112
    # contentDB_PORT = str(3002)
    # backURL = "http://localhost:"+contentDB_PORT+"/cont/"
    backURL = "https://impressionist-content-db-api-east-1.crossley.tech/cont/"
    req = urllib.request.Request(backURL, method='POST')
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsondataasbytes = contentJSON.encode('utf-8') # convert to bytes
    req.add_header('Content-Length', len(jsondataasbytes))
    req.add_header('User-Agent', 'Chrome')
    # print("sent jsonbytes:", jsondataasbytes)
    response = urllib.request.urlopen(req, jsondataasbytes)
    resultJSON = response.read().decode('utf-8')
    res = json.loads(resultJSON)
    if res['status'] == 'success':
        print("Successfully added to contentDB")
    else:
        print("Some error occured while adding to database")
        print(res['error'])

