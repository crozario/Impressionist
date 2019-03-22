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
> STATUS: DONE
- <mark>**TODO**</mark>: test feature extraction with librosa - [librosa docs](http://librosa.github.io/librosa/feature.html#spectral-features)
- Use cases:
    - extracting database dialogues' features (Friends)
    - extracting user's audio features
- Command run from inside
```bash
$ SMILExtract -C config/prosodyShs.conf -I test-data/example-audio/opensmile.wav -csvoutput test-data/features/prosodyShs_opensmile.csv
```
### Description of `extractFeatures.py`
```bash
$ python extractFeatures.py -h
usage: extractFeatures.py [-h] [-c CSV_OUT_FILE]
                          [--csv_out_folder CSV_OUT_FOLDER]
                          input_audio config_file

Extracts features from audio clips w/ SMILExtract
Author: Haard @ Impressionist
Example
- to process single file and extract features
$ python extractFeatures.py data/dialogues/audio_one-dialogue1.wav configs/prosodyShs.conf -c features/prosodyShs/audio_one-dialogue1.csv
- to process all .wav files in folder in one run
$ python extractFeatures.py data/dialogues/ configs/prosodyShs.conf --csv_out_folder features/prosodyShs/

positional arguments:
  input_audio           original audio file (.wav extension) OR path to a
                        folder to process all .wav files in folder (NOTE:
                        output csv files will be stored in the same location)
  config_file           .conf extension - used with OpenSMILE

optional arguments:
  -h, --help            show this help message and exit
  -c CSV_OUT_FILE, --csv_out_file CSV_OUT_FILE
                        Output file to put features in (.csv extension).
                        (Default) same prefix as audiofile
  --csv_out_folder CSV_OUT_FOLDER
                        (for processing multiple files at once) Output folder
                        to put ALL csv files. (Default) same as the folder
                        provided in input_audio.
```

## 3. Dataset builder
> STATUS: Doing...
- Conflicted
    - a video playing with pymovie? Not rn
- Simple
    1. give it folder
    2. plays one audio
    3. listen to user repeat audio
        - HOW?
        - VAD - Voice activity detection?
    4. stores user's audio
    5. Next audio... (back to 2) 
- Maybe I shouldn't do it?
    - Whatever I make with python to record audio won't be too portable
    - Anytime I send this to will have to download dependencies 
    - Will wait on this, work with crossley


