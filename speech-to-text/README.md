## Google's Speech-to-text put together by Furqan aka Al

### Quick usage directions
#### Python
## Dependencies
- Need python `google-cloud-speech` package
```bash
pip install --upgrade google-cloud-speech
```
- Need python `pysubs2` package
```bash
pip install pysubs2
```
# Sample Call
- compare_stt(subfile, subnum, audio_file)
- subfile: Subtitle file for the episode (could be sent by front end)
- subnum: Subtitle number from the subtitle file that is being compared (provided by frontend)
- audio_file: User's audio that will be provided by front end.

```Python
compare_stt('friends.s02e12.720p.bluray.x264-psychd.srt', 32, 'user-audio_two-dialogue3.wav')
```

#### Bash
- [Uses curl and simple JSON](https://cloud.google.com/speech-to-text/docs/quickstart-protocol)
