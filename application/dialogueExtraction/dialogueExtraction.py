import pysubs2
import webvtt
import re
import json
import sys

def getDialogueIntervals(charName, vttFile):
  #load subtitle file into SSA Object using vttFile provided

  subs = pysubs2.load(vttFile)

  #populate the .name variable of each dialogue
  for index, line in enumerate(webvtt.read(vttFile)):
    s = line.raw_text
    result = re.search('<v (.*)>', s)
    if result is not None:
      subs[index].name = result.group(1)

  #retrieve start, end times from SSAFile based on charName into an array
  start_end_times = []
  for line in subs:
    if line.name == charName or charName == "all":
      start_end_times.append([line.start, line.end])

  #return list of start, end times tuples
  return(start_end_times)

def getUniqueCharacter(vttFile):
  #load subtitle file into SSA Object using vttFile provided

  subs = pysubs2.load(vttFile)

  #populate the .name variable of each dialogue

  for index, line in enumerate(webvtt.read(vttFile)):

    s = line.raw_text
    result = re.search('<v (.*)>', s)
    if result is not None:
      subs[index].name = result.group(1)

  #retrieve unique characters names

  charNames = []
  for line in subs:
    if line.name not in charNames and line.name is not '':
      charNames.append(line.name)

  #return list of charNames
  return(charNames)

def printUniqueCharactersJSON(vttFile):
  charNames = getUniqueCharacter(vttFile)
  charNamesJSON = json.dumps({"characters" : charNames})
  print(charNamesJSON)

def printDialogueIntervalsJSON(charName, vttFile):
  lst = getDialogueIntervals(charName, vttFile)
  lstjson = json.dumps({"dialogues" : lst})
  print(lstjson)

def getDialogueIntervalsWithCaptions(vttFile):
  """Returns 2D array of dialogues' start/end times, and captions
  Array of shape (n, 3), where n is number of dialogues
  Ex: [
    [9009.0, 11635.0, "Can't get the monkey off your back?"],
    [12929.0, 15180.0, "Then put it in your mouth..."],
    [15390.0, 17266.0, "...with Monkeyshine Beer!"]
  ]
  """
  #load subtitle file into SSA Object using vttFile provided
  subs = pysubs2.load(vttFile)

  allDialogues = []
  for line in subs:
    allDialogues.append([line.start, line.end, line.text])

  # return 2D array of shape (n, 3)
  return allDialogues

def getCharacterDialogueIdsDict(vttFile):
  """returns character names and list of positions (dialogueIDs) where the character speaks
  """
  characterDialogueIdsDict = {}

  for index, line in enumerate(webvtt.read(vttFile)):
    s = line.raw_text
    result = re.search('<v (.*)>', s)
    if result is not None:
      charName = result.group(1)
      if (characterDialogueIdsDict.get(charName) == None):
        characterDialogueIdsDict[charName] = [index]
      else:
        characterDialogueIdsDict[charName].append(index)

  return characterDialogueIdsDict


if __name__ == "__main__":
  file = "../../contentData/tvShows/Friends/02/12-The-One-After-The-Superbowl-Part1/friends_s02e12_720p.vtt"
  # print(getDialogueIntervalsWithCaptions(file))
  print(getCharacterDialogueIdsDict(file))





