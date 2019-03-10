"""Extracts features from audio clips w/ SMILExtract
Author: Haard @ Impressionist
Example
- to process single file and extract features
$ python extractFeatures.py data/dialogues/audio_one-dialogue1.wav configs/prosodyShs.conf -c features/prosodyShs/audio_one-dialogue1.csv
- to process all .wav files in folder in one run
$ python extractFeatures.py data/dialogues/ configs/prosodyShs.conf --csv_out_folder features/prosodyShs/
"""
# TODO: feature extraction with librosa is also work investigating

import argparse
import os

def extractProsodyFeature(audioFile, csvOutFile, configFile):
    import subprocess
    # check SMILExtract is installed
    result = subprocess.run("SMILExtract -h", stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
    assert 'command not found' not in result.stdout.decode('utf-8'), "OpenSMILE not installed properly"
    # Run feature extraction
    cmd = "SMILExtract -C "+ configFile +" -I "+ audioFile +" -csvoutput " + csvOutFile
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
    # print(result.stdout)
    if "Processing finished!" in result.stdout.decode('utf-8'):
        print("Success! extracted features in:", csvOutFile)
    else:
        # should we exit() ?
        print("Feature extraction unsuccessful.")
        print("stdout:", result.stdout)

# extract prosody feature for all .wav files in folder
def extractProsody_AllInFolder(folderPath, configFile, csvOutPath):
    """Extract prosody feature for all .wav files in folder
    Names `csvOutFile` automatically from `audioFile` name
    """
    # print(folderPath)
    # print(csvOutPath)
    files = os.listdir(folderPath)
    for audioFile in files:
        prefix, ext = os.path.splitext(audioFile)
        if ext != ".wav":
            print(ext)
            continue
        csvOutFile = os.path.join(csvOutPath, prefix + ".csv")
        fullAudioFile = os.path.join(folderPath, audioFile)
        extractProsodyFeature(fullAudioFile, csvOutFile, configFile)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("input_audio", type=str, help="original audio file (.wav extension) OR path to a folder to process all .wav files in folder (NOTE: output csv files will be stored in the same location)")
    parser.add_argument("config_file", type=str, help=".conf extension - used with OpenSMILE")
    parser.add_argument("-c", "--csv_out_file", type=str, help="Output file to put features in (.csv extension). (Default) same prefix as audiofile", action="store")
    parser.add_argument("--csv_out_folder", type=str, help="(for processing multiple files at once) Output folder to put ALL csv files. (Default) same as the folder provided in input_audio.", action="store")
    args = parser.parse_args()

    # decide if processing single file or multiple at once
    prefix, ext = os.path.splitext(args.input_audio)
    # print(prefix)
    if not ext:
        # Multiple files at the same time 
        csvOutPath = args.csv_out_folder if args.csv_out_folder else prefix
        extractProsody_AllInFolder(args.input_audio, args.config_file, csvOutPath)
    else:
        # process single audio file
        csvOutFile = args.csv_out_file if args.csv_out_file else prefix+'.csv'
        extractProsodyFeature(args.input_audio, csvOutFile, args.config_file)
