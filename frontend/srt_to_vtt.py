import webvtt
import sys


webvtt = webvtt.from_srt(sys.argv[1])
webvtt.save()
