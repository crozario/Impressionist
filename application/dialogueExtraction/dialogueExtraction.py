import pysubs2
import webvtt
import re

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
    if line.name == charName:
      start_end_times.append((line.start, line.end))

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
