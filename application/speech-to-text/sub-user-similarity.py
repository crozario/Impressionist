"""
Arguments: subtitle file, subtitle number, user's audio file
Finds similarity of two strings, one from the subtitle file and the other from speech to text api
Returns similarity from 0 to 1
dependencies: google-cloud-speech, pysubs2
"""
import pysubs2
import sys

from difflib import SequenceMatcher

def compare_stt(subfile, subnum, audio_file):
    subs = pysubs2.load(subfile)
    sub_line = subs[subnum].plaintext

    sys.argv = [ '-s', 'en-US', audio_file'.flac', '>', transcript ]
    execfile('transcribe_return_only_one_line.py')

    transcript = open("transcript","r")
    stt = transcript.read().replace('\n', '')

    return similar(sub_line, stt)

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()
