"""
Arguments: subtitle file, subtitle number, user's audio file
Finds similarity of two strings, one from the subtitle file and the other from speech to text api
Returns similarity from 0 to 1
dependencies: google-cloud-speech, pysubs2
"""

import sys
import os
import transcribe_return_only_one_line as gstt
import re

from difflib import SequenceMatcher

def compare_stt(subfile, subnum, audio_file):
    import pysubs2
    #load and format subtitle string
    subs = pysubs2.load(subfile)
    sub_line = subs[subnum].plaintext
    sub_line = re.sub(r'\W+', ' ', sub_line.lower()).strip(' ')

    #make call to google api for speech to text for user audio
    stt = str(gstt.transcribe_file_with_word_time_offsets(audio_file, 'en-US'))
    stt = stt.replace('\n', '').lower()

    print('stt: ', len(stt))
    print('\nsubs: ', len(sub_line))

    #return comparison score using the two strings above
    return similar(sub_line, stt)

def compareToDialogue(userWavAudio, origStringDialogue, verbose=False):
    # get user's subtitle
    user_diag = str(gstt.transcribe_file_with_word_time_offsets(userWavAudio, 'en-US'))
    user_diag = user_diag.replace('\n', '').lower()
    # reformat orig dialog
    origStringDialogue = re.sub(r'\W+', ' ', origStringDialogue.lower()).strip(' ')
    
    if verbose: print("users:", user_diag)
    if verbose: print("original:", origStringDialogue)
    return similar(origStringDialogue, user_diag)

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()
