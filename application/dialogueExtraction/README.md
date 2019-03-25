## Start/End time Extraction for Dialogues from subtitle file based on Character Name

### Quick usage directions
## Dependencies
- Need `webvtt-py` package
```bash
pip install webvtt-py
```
- Need `pysubs2` package
```bash
pip install pysubs2
```
# Sample Call
getDialogueIntervals(characterName, vttFile)
- characterName: Name of character for whom start/end times need to be retrieved
- vttFile: Path to VTT file that is to be parsed for start/end times

```Python
getDialogueIntervals('Ross', 'friends.s02e12.720p.bluray.x264-psychd [SubtitleTools.com].vtt')
```

 getUniqueCharacter(vttFile)
 - vttFile:  Path to VTT file that is to be parsed for unique character names

```Python
getUniqueCharacter('friends.s02e12.720p.bluray.x264-psychd [SubtitleTools.com].vtt')
```
## Future Changes
- Might get rid of need for webvtt-py if I can extract the voice tags into .ass format in the next few days. This way pysubs2 will be able to handle name extraction by itself without the need for regex searches from webvtt objects.
