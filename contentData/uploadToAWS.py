
import subprocess
import sys
import os

pemFile = "../../appServer_nvirginia_ubuntu.pem"

def createEmptyFolderOnAWS(folderPath, folderName, remoteContentDataPath):
    tmpRepeatDir = os.path.join(folderPath, folderName)
    os.makedirs(tmpRepeatDir)
    remoteContentDataPath = os.path.join(remoteContentDataPath, folderPath)
    cmd = ' '.join(["scp -i", pemFile, "-r", tmpRepeatDir, "ubuntu@3.91.111.9:"+remoteContentDataPath])
    cmdStdOut = runOScommand(cmd)
    # result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
    # print(cmd)
    os.removedirs(tmpRepeatDir)
    return cmdStdOut

def runOScommand(cmd):
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
    print(result)
    return result.stdout.decode('utf-8')

def uploadEpisodeToAWS(episodeFolder):
    """Works only for tvShows episodes
    """
    origFeaturesDir = os.path.join(episodeFolder, "features")
    if not os.path.isdir(origFeaturesDir):
        print("no features/ folder found inside "+episodeFolder)
        print("skipping...")
        return

    tmpsplit = episodeFolder.split("/")
    if tmpsplit[-1] == "": tmpsplit = tmpsplit[:-1]
    episodeFolder = "/".join(tmpsplit)
    episodeFolderName = tmpsplit[-1]
    seasonFolder = "/".join(tmpsplit[:-1])
    seasonFolderName = tmpsplit[-2]

    # send tmpRepeatDirectory that has features folder inside 
    remoteContentDataPath = os.path.join("~", "contentData")

    # try upload features/ to AWS
    remoteEpisodeFeaturesPath = os.path.join(os.path.join(remoteContentDataPath, episodeFolder), "features")
    cmdUploadFeatures = " ".join(["scp -i", pemFile, "-r", origFeaturesDir,
                    "ubuntu@3.91.111.9:"+remoteEpisodeFeaturesPath])
    uploadFeaturesStdOut = runOScommand(cmdUploadFeatures)

    if uploadFeaturesStdOut != '': 
        # if unsuccessful uploading features/ because first time with this episode
        createEpisodeFolderOut = createEmptyFolderOnAWS(episodeFolder, episodeFolderName, remoteContentDataPath)
        if (createEpisodeFolderOut != ''):
            # if unsuccessful uploading episode dir because first time with season
            # 1. create empty season folder
            _ = createEmptyFolderOnAWS(seasonFolder, seasonFolderName, remoteContentDataPath)
            # 2. create empty episode folder
            _ = createEmptyFolderOnAWS(episodeFolder, episodeFolderName, remoteContentDataPath)

        # try uploading features/ again
        uploadFeaturesStdOut = runOScommand(cmdUploadFeatures)
        if uploadFeaturesStdOut != '':
            print("ERROR: Couldn't upload features/ for this episode")
            return

    print("features added to AWS at:", remoteEpisodeFeaturesPath)
    print("----------------- Pce ✌ ------------------")

def uploadSeasonEpisodesToAWS(seasonFolder):
    episodes = os.listdir(seasonFolder)
    episodes = [os.path.join(seasonFolder, e) for e in episodes]
    for ep in episodes:
        if not os.path.isdir(ep): continue
        uploadEpisodeToAWS(ep)

if (len(sys.argv) < 3):
    print("Usage: python", sys.argv[0], "<season | episode>", "<directory containing features/ folder>")
    exit()

choice = sys.argv[1]
if (choice == "episode"):
    episodeFolder = sys.argv[2] # tvShows/Friends/02/2-The-One-With-The-Breast-Milk/
    uploadEpisodeToAWS(episodeFolder)
elif (choice == "season"):
    seasonFolder = sys.argv[2]
    uploadSeasonEpisodesToAWS(seasonFolder)
