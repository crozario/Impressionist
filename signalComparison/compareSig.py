"""Compare features extracted using OpenSMILE
- audio files are aligned using `scipy.signal.correlate`
- then pearson correlation coefficient is calculated (this is the similarity measurement)

Author: Haard @ Impressionist

Status:
- needs `.csv` feature files (will support audio file inputs in future)
    - OpenSMILE can be run from inside the script
- MORE REALISTIC feature (will work on it tomorrow)
    - Input1 original features
    - Input2 new audio file
    Program:
    - extract feature from new audio file and then compare with original features

Example usage:
> $ python compareSig.py ../test-data/features/prosodyShs_opensmile.csv ../test-data/features/prosodyShs_haardopensmile.csv prosody
Displaying plot, press [enter] to continue...
Output:
> Pearson similarity:  68.09138964405342
"""

import argparse
import numpy as np
import matplotlib.pyplot as plt

from plotSignals import plotTwoFeaturesMatrices, cleanupPlots
from modifySignals import pad_shorter, readCsvData, alignSignals, calcPearson, getPearsonSimilarity

# GLOBAL constants 
SKIPCOLS = 1

# TODO: get files from cmdline inputs OR get audiofile input and use SMILExtract from here to produce prosody feature files
# orig_file = '../test-data/features/prosodyShs_opensmile.csv'
# new_file = '../test-data/features/prosodyShs_haardopensmile.csv'

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("fileA", type=str, help="feature file; should be .csv extension")
    parser.add_argument("fileB", type=str, help="feature file; should be .csv extension")
    parser.add_argument("feature_type", type=str, help="(prosody | chroma)")
    args = parser.parse_args()

    #   Read data
    if (args.feature_type == 'prosody'):
        # voicing - voicing probability ... TODO: understand this before using it to judge user signal's similarity
        SKIPCOLS=1
        data_orig, data_new, headers = readCsvData(
            args.fileA, args.fileB, delimiter=';', skipcols=SKIPCOLS, skiprows=1)
    elif (args.feature_type == 'chroma'):
        SKIPCOLS=0
        data_orig, data_new, headers = readCsvData(args.fileA, args.fileB, delimiter=';', skipcols=SKIPCOLS, skiprows=0)
    else:
        exit()
    # initially
    plotTwoFeaturesMatrices(data_orig, data_new, skipcols=SKIPCOLS, headers=headers)
    # make them equal length
    data_orig, data_new = pad_shorter(data_orig, data_new)
    # compare
    similarity = getPearsonSimilarity(data_orig, data_new, skipcols=SKIPCOLS)
    print("Pearson similarity: ", similarity)
    # close any open plots
    cleanupPlots()

# read data for prosodyShs 

# SKIPCOLS=1
# data_orig, data_new, headers = readCsvData(orig_file, new_file, delimiter=';', skipcols=SKIPCOLS, skiprows=1)
# read data for chromafeatures
# SKIPCOLS=0
# data_orig, data_new, headers = readCsvData(orig_file, new_file, delimiter=';', skipcols=SKIPCOLS, skiprows=0)

# print("--------Visualize raw input signals--------")
# plotTwoFeaturesMatrices(data_orig, data_new, skipcols=1, headers=headers)

# data_orig, data_new = pad_shorter(data_orig, data_new)

# # print('orig size', data_orig[0].size)
# # print('new size', data_new[0].size)

# similarity = getPearsonSimilarity(data_orig, data_new, skipcols=SKIPCOLS)
# print("Pearson similarity: ", similarity)

# cleanupPlots()








