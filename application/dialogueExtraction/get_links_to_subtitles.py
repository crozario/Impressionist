"""
Get links to Friends episodes 

From http://www.livesinabox.com/friends/scripts.shtml
"""

from bs4 import BeautifulSoup
import requests
import os
import re
from transcript_to_vtt import getFriendsDialogueDichotomy, addCharNames

def getFriendsTranscriptsLinks(
    linkHome="http://www.livesinabox.com/friends/",
    linkEpisodes="scripts.shtml",
    season=None, # means all seasons
    episode=None # means all episodes
):
    """Gets links for `season` and `episode` for Friends from `livesinabox.com/friends`
    """
    linkEpisodes = linkHome + "scripts.shtml"
    page = requests.get(linkEpisodes) # try the following
    soup = BeautifulSoup(page.content, 'html5lib')

    links_with_tags = soup.find_all('li')

    episode_details = [] # info tuples (str link, int seasonNum, int episodeNum, str episodeTitle)
    couldntParse = [] # tuples (str tag, str error)
    for ii, tag in enumerate(links_with_tags):
        strtag = str(tag)
        text = tag.get_text()
        tmp = text.split(":") # splitting `episode ###: The one with...`
        
        # if (len(tmp) is 2):  
        if "Episode" in tmp[0] or "Epsiode" in tmp[0] or "Episdoe" in tmp[0]:
            if (len(tmp) >= 2):
                tmp[1] = " ".join(tmp[1:])
            else:
                couldntParse.apend((strtag), "Found episode but splits to less than 2. Skipping...")
                continue
        else:
            couldntParse.append((strtag, "Couldn't parse tag.get_text(). Skipping...", "; tag.get_text() =", tag.get_text()))
            continue

        episodeStr = tmp[0]
        episodeStr = episodeStr.split() # splitting `episode ###` into two
        if (len(episodeStr) is not 2): 
            couldntParse.append((strtag, "Expected episodeStr (`episode ###`) to split into 2. Skipping..."))
            continue
        
        # get seasonNum and episodeNum
        episodeStr = episodeStr[1]
        if (len(episodeStr) is 3): # for seasons 1-9 (Friends)
            seasonNum = episodeStr[0]
            episodeNum = episodeStr[1:]
        elif (len(episodeStr) is 4): # if season is 10
            seasonNum = episodeStr[:2]
            episodeNum = episodeStr[2:]
        else:
            couldntParse.append((strtag, "Unable to parse episodeNum (#### or ###). Skipping..."))
            continue

        # get epiodeTitle
        episodeTitle = tmp[1]
        episodeTitle = episodeTitle.strip()
        episodeTitle = " ".join(episodeTitle.split())
        
        # get link
        link = re.findall(r'(?:href=\")(.*html?)(?=\">)', str(tag))
        if len(link) is 1: 
            link = link[0]
        else:
            couldntParse.append((strtag, "Unable to find link. Skipping..."))
            continue
        
        seasonNum = int(seasonNum)
        episodeNum = int(episodeNum)
        info = (linkHome + link, seasonNum, episodeNum, episodeTitle)
        if season is None: episode_details.append(info)
        else:
            if season is seasonNum:
                if episode is None or episode is episodeNum:
                    episode_details.append(info)
    return episode_details, couldntParse

def _checkAndCreateFolder(folderPath, verbose=False):
    """Create folder if doesn't exist"""
    if (not os.path.isdir(folderPath)):
        if verbose: print("Creating:", folderPath)
        os.makedirs(folderPath)

def _getFilesFrom(folderPath, extension="all", verbose=False):
    """returns list of files from `folderPath` 
    """
    files = os.listdir(folderPath)
    # files = [os.path.join(folderPath, f) for f in files] # don't return full paths
    newFiles = [] # return this
    if extension is "all": return files
    else:
        for f in files:
            _, fext = os.path.splitext(f)
            if fext == extension: newFiles.append(f)
        return newFiles

def _writeDiagsToCSV(tuplesList, fileName, delim=","):
    print("_writeDiagsToCSV not implemented yet")

def createContentDirsFriends(season=2, episode=None, extractCharacters=False, saveTranscriptToCSV=False, verbose=False):
    """Create folders inside contentData folder
    TODO: add a loop to do all seasons
    `extractCharacters`
    """
    # Create Friends home directory
    friendsDir = os.path.join(CONTENT_DIR, "tvShows/Friends")
    _checkAndCreateFolder(friendsDir)

    # initialize directories inside Friends
    episodes, couldntParse = getFriendsTranscriptsLinks(season=season, episode=episode)
    print("------------Couldn't parse------------")
    for c in couldntParse: print(c)
    print("--------------------------------------")
    assert (len(episodes) is not 0), "no episodes were extracted"

    seasonNum = episodes[0][1]
    if (seasonNum < 10): seasonNum = "0" + str(seasonNum)
    seasonDir = os.path.join(friendsDir, seasonNum)
    # create folder for season 02
    _checkAndCreateFolder(seasonDir)
    
    for ep in episodes:
        num = str(ep[2]) + "-"
        name = ep[3]
        name = "-".join(name.split(" "))
        episodeFolderName = num+name
        fullEpisodeFolderName = os.path.join(seasonDir, episodeFolderName)
        _checkAndCreateFolder(fullEpisodeFolderName)

        if (extractCharacters):
            # get transcript and character name pairs
            link = ep[0]
            print("----------------------------------------------------------------------------")
            print("**Extracting characters for :", fullEpisodeFolderName)
            print("**FROM: ", link)
            print("----------------------------------------------------------------------------")

            transcriptPairs = getFriendsDialogueDichotomy(link)
            
            if (saveTranscriptToCSV):
                csvFileName =  "-".join(["transcript", str(seasonNum), str(ep[2])])
                csvFileName += ".csv"
                fullcsvFileName = os.path.join(fullEpisodeFolderName, csvFileName)
                print("Writing transcriptPairs to CSV file:", fullcsvFileName)
                _writeDiagsToCSV(transcriptPairs, fullcsvFileName, delim=",")
            
            vttFiles = _getFilesFrom(fullEpisodeFolderName, extension=".vtt")
            if (len(vttFiles) == 1): # there's only .vtt file (must be from netflix subs)
                subs = vttFiles[0]
                fullInputSubsPath = os.path.join(fullEpisodeFolderName, subs)
                if ("netflix_subs" in subs):
                    outSubs = subs.replace("netflix_subs", "labeled_subs")
                    fullOutputSubsPath = os.path.join(fullEpisodeFolderName, outSubs)
                    addCharNames(transcriptPairs, fullInputSubsPath, fullOutputSubsPath, verbose=True, detailedVerbose=False, interactive=True, interactiveResolve=False)
                else:
                    pass
            elif (len(vttFiles) > 1):
                # rename old one
                subs = ""
                for f in vttFiles:
                    if "netflix_subs" in f:
                        subs = f.replace("netflix_subs", "labeled_subs")
                    elif "labeled_subs" in f:
                        num = 1
                        while (num < 11):
                            old = f.replace("labeled_subs", str(num)+"-old_labeled")
                            fullOld = os.path.join(fullEpisodeFolderName, old)
                            if not (os.path.exists(fullOld)): break
                            num += 1
                # find netflix subs `netflix_subs_...`
                # check if previously labeled one is in here
                # TODO: take argument overwriteLabeledVTT=True before overwriting it
                pass
            else:
                # netflix subs haven't been added yet
                pass


CONTENT_DIR = "../../contentData/"
# don't run this script from anywhere else or if CONTENT_DIR is not at above location
if (not os.path.isdir(CONTENT_DIR)):
    print("Using relative paths. Please run this script from inside application/dialogueExtraction/ OR make sure "+CONTENT_DIR+" exists.")
    exit()

if __name__ == "__main__":
    createContentDirsFriends(season=2, episode=1, extractCharacters=True, saveTranscriptToCSV=False, verbose=True)
    
    
    
    
    
    
    
            


