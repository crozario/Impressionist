## Google's Speech-to-text put together by Furquan aka Al

### Quick usage directions
#### Python
- Need python `google-cloud-speech` package
```bash
pip install --upgrade gogle-cloud-speech
```
- Run like this
```bash
python transcribe_time_offsets_with_language_change.py -s "en-US" sample.flac
```
- To run with `.wav` file extensions, delete the following line from python file or change `.FLAC` to `.LINEAR16`
```python
encoding=enums.RecognitionConfig.AudioEncoding.FLAC
```

#### Bash 
- [Uses curl and simple JSON](https://cloud.google.com/speech-to-text/docs/quickstart-protocol)
