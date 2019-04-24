"""

"""

import requests
import re
import string
import webvtt
import bs4
from bs4 import BeautifulSoup
from difflib import SequenceMatcher


def printItrNicely(thing):
	for t in thing:
        # print(type(t) is bs4.element.Tag)
        # if (type(t) is not bs4.element.Tag):
        #     print(t)
		print(t)
		print("-------------------------------------")


def cleanUpEmpty(oldLst):
	newLst = []
	for i in oldLst:
        # print(i.strip())
		if i.strip() is not "":
			newLst.append(i)
	return newLst


def _getMatch(linkToEpisode):
	page = requests.get(linkToEpisode)
	soup = BeautifulSoup(page.content, 'html5lib')
	html = list(soup.children)
	whole = html[0].prettify()
	match = re.findall(r'(?:<br/>)([\s\S]*?)(?=<br/>)', whole)
	if (len(match) > 10): return match
	# another try
	match = soup.find_all('p')
	if (len(match) > 10):
		match = [m.get_text() for m in match]
		return match
	else:
		print("couldn't find transcript matches")
		return False

def getFriendsDialogueDichotomy(linkToEpisode):
	"""Web scraping and returning tuples (CHARNAME, 'dialogue...')"""
	print("Web scraping and obtaining dialogue dichotomy...")
	match = _getMatch(linkToEpisode)
	if not match:
		print("Match not found")
		return
	
	all_dialogues = []
	for m in match:
		# tmp = m.group(0).replace("\n", " ")
		tmp = m.replace("\n", " ")
		tmp = remove_html_tags(tmp).strip()
		tmp = remove_parens(tmp)
		tmp = remove_stage_directions(tmp)
	#     tmp = re.sub("<.*?>", "", tmp).strip()
		if (tmp == ""):
			continue
		all_dialogues.append(tmp)

	dd = []
	#     tmpTuple = ('','')
	for i, t in enumerate(all_dialogues):
	#         print(i)
		tmp = t.split(':')
	#         print(tmp)
	#         if i>=100: break
		if (len(tmp) == 2):
			tmp[0] = tmp[0].strip().upper()
			# remove punctuations and white spaces
			# tmp[1] = tmp[1].strip().lower().translate(str.maketrans('', '', string.punctuation))
			tmp[1] = tmp[1].strip().lower().translate(str.maketrans(string.punctuation, ' '*len(string.punctuation)))
			tmp[1] = " ".join(tmp[1].split())
			dd.append((tmp[0], tmp[1]))
	#             print(tmp)
	#                 break # TESTING
		elif (len(tmp) == 1):
			continue
		else: # WEIRD
			print("WEIRD", len(tmp))
			print(tmp)
			continue # TESTING
		
	return dd


def remove_html_tags(data):
	p = re.compile(r'<.*?>')
	return p.sub('', data)


def remove_stage_directions(data):
	"""remove things between square brackets [...]
	"""
	p = re.compile(r'\[.*?\]')
	return p.sub('', data)


def remove_parens(data):
	"""remove things between parens (...)
	"""
	p = re.compile(r'\(.*?\)')
	return p.sub('', data)


def standardizeVttCaptionsForComparison(captionsLst):
	capToDel = []
	for i, cap in enumerate(captionsLst):
		tmp = cap.text.lower()
		tmp = tmp.replace("\n", " ")
		tmp = remove_stage_directions(tmp)
		tmp = remove_parens(tmp)
		tmp = tmp.translate(str.maketrans(string.punctuation, ' '*len(string.punctuation)))
		if tmp is "":
			capToDel.append(i)
			continue
		tmp = " ".join(tmp.split())
		cap.text = tmp
	for i, idx in enumerate(capToDel):
		del captionsLst[idx-i]
	return captionsLst


#matches strings with percent similarity, obvious problems with periods and exclamation marks etc
def similar(a, b):
	return SequenceMatcher(None, a, b).ratio()


def isMatch(caption, transcript, thres=0.75, verbose=False):
	""" checks for existence of each word of caption in transcript
	`caption` : is string
	`transcript` : is string
	"""
	print("Merging to VTT file...")
	if verbose:
		print("COMP", caption, "|", transcript)
	lsttra = transcript.split()
	lstcap = caption.split()
	if len(lstcap) is 0: return (0.0, 0.0)

	comp = [s in lsttra for s in lstcap]
	score = comp.count(True)/len(comp)
	simScore = similar(caption, transcript)
	if verbose:
		print("SCORE:", score)
		print("SIM_S:", simScore)
	return score, simScore


def addCharNames(transcriptPairs, inputVTTFile, outputVTTFile, verbose=False, detailedVerbose=False, interactive=False, interactiveResolve=False):
	"""add character names to vtt captions (will return modified captions list)
	`transcriptPairs` : list of tuples of size two 
		[0] => characterName (ALL CAPS), 
		[1] => dialogue all lower with subtitles and white spaces removed
	`stdVttCaptions` : list of Caption objects 
		(standardized by removing puntuations, netflix tags, & lowercasing)
		use `.text` to get text &
		append charactername like so `stdVttCaptions.text = '<v CHARACTER>'+stdVttCaptions.text`
	"""
	vtt = webvtt.read(inputVTTFile)
	stdVttCaptions = vtt.captions
	# print(len(stdVttCaptions))
	stdVttCaptions = standardizeVttCaptionsForComparison(stdVttCaptions)
	# print(len(stdVttCaptions))
	totalOrigCaptions = len(stdVttCaptions)
	print("initial count", totalOrigCaptions, len(transcriptPairs))
	min_score = 0.75
	cap_i = 0 # counter for captions
	tra_j = 0 # counter for transcripts pairs
	maxNotMatchedBeforeMovingOn = 10
	maxNotFound = 20 # 20 consistent dialogues couldn't be matched with transcripts 
	foundFirst = False
	notFoundIndices = []

	mostRecentSkippedTranscripts = []
	def interactiveResolve(cap_i):
		print("-----------caption------------")
		print(stdVttCaptions[cap_i].text)
		print("---------transcripts----------")
		strOptions = [str(i+1) for i in range(4)]
		for idx, ii in enumerate(mostRecentSkippedTranscripts):
			print(idx+1, transcriptPairs[ii])
		resolve = input("Hit <ENTER> to skip OR type <" + "|".join(strOptions) + "> to select: ")
		print("received:", resolve)
		if resolve not in strOptions:
			print("unresolved... returning False")
			return False
		else:
			nonlocal tra_j
			tra_j = mostRecentSkippedTranscripts[int(resolve)-1]
			print("resolved!", transcriptPairs[tra_j][0], "said ", stdVttCaptions[cap_i].text)
			found()
			return True

	def found():
		nonlocal cap_i
		nonlocal didntFindCount
		nonlocal didntMatchCount
		nonlocal foundFirst
		mostRecentSkippedTranscripts.clear()
        # print("++Matched!++", transcriptPairs[tra_j][0], currCap)
		# modify actual captions
		stdVttCaptions[cap_i].text = "<v "+transcriptPairs[tra_j][0]+">"+stdVttCaptions[cap_i].text
		if verbose: print("Matched : ", stdVttCaptions[cap_i].raw_text)
		if not foundFirst:
			foundFirst = True
			nonlocal maxNotMatchedBeforeMovingOn
			maxNotMatchedBeforeMovingOn = 3 # reduce to minimize errors throughout 
		cap_i += 1
		didntFindCount = 0
		didntMatchCount = 0
	def foundPerf():
		nonlocal tra_j
        # nonlocal cap_i
		if verbose: print("**PerfMatched!**")
		found()
		tra_j += 1
	def notFound():
		nonlocal cap_i
		nonlocal tra_j
		nonlocal didntMatchCount
		nonlocal didntFindCount
		mostRecentSkippedTranscripts.append(tra_j)
		tra_j += 1
		didntMatchCount += 1
		if didntMatchCount > maxNotMatchedBeforeMovingOn or tra_j >= len(transcriptPairs):
			
			# manually resolve?
			resolveSuccess = interactiveResolve(cap_i)
			if resolveSuccess:
				return True
			else:
				mostRecentSkippedTranscripts.clear()

			if verbose: print("--Match not found:", currCap)

			didntFindCount += 1
			notFoundIndices.append(cap_i)
			cap_i += 1
			tra_j -= didntMatchCount
			didntMatchCount = 0
		if didntFindCount > maxNotFound:
			print("Unknown error occured. Consistently couldn't find equivalent transcripts to", maxNotFound, " captions.")
			return False
		return True
	
	didntMatchCount = 0
	didntFindCount = 0
	while(cap_i < len(stdVttCaptions) and tra_j < len(transcriptPairs)):
		if verbose: print(cap_i, tra_j)
		currCap = stdVttCaptions[cap_i].text
		currTra = transcriptPairs[tra_j][1]
		# FRIENDS ONLY to skip title song! I'll be there for you...
		if "♪" in currCap:
			# FIXME: add to notFoundIndices?
			cap_i += 1
			continue
		comScore, simScore = isMatch(currCap, currTra, verbose=detailedVerbose)
		# PERF match
		if (simScore >= SIM_THRES):
			foundPerf()
		# Good match
		elif (comScore >= COM_THRES or simScore >= MIN_SIM_THRES):
			found()
		# Didn't match
		else:
			okay = notFound()
			if not okay:
				if interactive:
					# FIXME: show something
					break
				else:
					break
	print("final itr", cap_i, tra_j)
	
	# save to new file 
	if (interactive):
		resp = input(str(len(notFoundIndices)) + "/" + str(totalOrigCaptions) + " were not labeled. Would you still like to save? (yes|no)")
		resp = resp.lower()
		if resp == "yes": 
			print("Saving labeled dialogues to: ", outputVTTFile)
			vtt.save(outputVTTFile)
		elif resp == "no": pass
		elif resp == "more": 
			# TODO: future functionality for iterative labeling
			# view all unlabeled dialogues
			pass
	else:
		print("Saving labeled dialogues to: ", outputVTTFile)
		vtt.save(outputVTTFile)

	return stdVttCaptions, notFoundIndices


COM_THRES = 0.67
SIM_THRES = 0.95  # this means both are the same and increment both counters
MIN_SIM_THRES = 0.6

if __name__ == "__main__":
	linkToEpisode = "http://www.livesinabox.com/friends/season2/212toasb.htm"

	pairs = getFriendsDialogueDichotomy(linkToEpisode)

	print(len(pairs))
	# printItrNicely(pairs)


	inputFile = 'friends-s02e15.vtt'
	
	# > Learned that vtt.captions list is passed as reference! So just need to do `vtt.save("newfile.vtt")` to save
	# print(captions_lst is vtt.captions)

	# prepare truth file (predict and then manually correct it)
	import os
	prefix, ext = os.path.splitext(inputFile)
	print(prefix, ext)
	outputLabeledFileName = prefix + "-PREDICTED" + ext
	print(outputLabeledFileName)

	captions_lst, indicesNotFound = addCharNames(pairs, inputFile, outputLabeledFileName, verbose=False, detailedVerbose=False)
	

	vtt.save(outputLabeledFileName)

	for cap in captions_lst:
		print(cap.raw_text)
	# for id in indicesNotFound:
	#     print(newCaptions[id].raw_text)

