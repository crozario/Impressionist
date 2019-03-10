# Builder for constructing test data
> Author: Haard @ Impressionist
## Implements
1. **Creates individual dialogue files** from audio clip and subtitle file
2. **Extract** prosody, chroma, etc. (any other we decide to use later) using OpenSMILE 
3. Program (preferably GUI) to allow for listening to audio and then recording own voice
    - *Need to plan this out*
    - Use individual dialog clips OR whole clip in conjunction with subtitle file? Latter add more work
- Questions?
    - Provide comparison score after user records ?

## 1. Create dialogue files
> STATUS: DONE
- Use scipy.io.readwav and writewav
- Sample run:
```bash
$ python3 dialogueCreator.py data/audio_four.wav data/clip_four.srt 
$ python dialogueCreator.py -h
usage: dialogueCreator.py [-h] audio_file subtitles_file

Extracts dialogues from audio clips using subtitle file

positional arguments:
  audio_file      original audio file (.wav extension)
  subtitles_file  subtitile file (.srt extension)
```
- Dependencies
```
scipy                    1.2.1
```

## 2. Extract features
> STATUS: Doing...
- Use cases:
    - extracting database dialogues' features (Friends)
    - extracting user's audio features
- Command run from inside
```bash
$ SMILExtract -C config/prosodyShs.conf -I test-data/example-audio/opensmile.wav -csvoutput test-data/features/prosodyShs_opensmile.csv
```


## 3. Dataset builder
> STATUS: Incomplete

