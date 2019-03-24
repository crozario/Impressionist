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
# import matplotlib.pyplot as plt

from modifySignals import pad_shorter, readCsvData, alignSignals, calcPearson, getPearsonSimilarity

# TODO: get files from cmdline inputs OR get audiofile input and use SMILExtract from here to produce prosody feature files
# orig_file = '../test-data/features/prosodyShs_opensmile.csv'
# new_file = '../test-data/features/prosodyShs_haardopensmile.csv'

def compareSignals(fileA, fileB, feature_type, delimiter=';', verbose=False, plot=False):
    """Compare features extracted using OpenSMILE
    Uses `scipy.signal.correlate` and `scipy.stats.pearsonr` to get similarity
    @params
    `fileA`         feature file; should be .csv extension
    `fileB`         feature file; should be .csv extension
    `feature_type`  ('prosody' | 'chroma')
    """
    if plot: from plotSignals import plotTwoFeaturesMatrices, cleanupPlots
    #   Read data
    if (feature_type == 'prosody'):
        # voicing - voicing probability ... TODO: understand this before using it to judge user signal's similarity
        SKIPCOLS = 1
        data_orig, data_new, headers = readCsvData(
            fileA, fileB, delimiter=';', skipcols=SKIPCOLS, skiprows=1)
    elif (feature_type == 'chroma'):
        SKIPCOLS = 0
        data_orig, data_new, headers = readCsvData(
            fileA, fileB, delimiter=';', skipcols=SKIPCOLS, skiprows=0)
    else:
        exit()
    # initially
    if plot: plotTwoFeaturesMatrices(data_orig, data_new,
                                skipcols=SKIPCOLS, headers=headers)
    # make them equal length
    data_orig, data_new = pad_shorter(data_orig, data_new)
    # compare
    similarity = getPearsonSimilarity(
        data_orig, data_new, skipcols=SKIPCOLS, headers=headers, plot=plot)
    if verbose: print("Pearson similarity: ", similarity)
    # close any open plots
    if plot: cleanupPlots()

    return similarity

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("fileA", type=str, help="feature file; should be .csv extension")
    parser.add_argument("fileB", type=str, help="feature file; should be .csv extension")
    parser.add_argument("feature_type", type=str, help="(prosody | chroma)")
    args = parser.parse_args()

    # constants
    SKIPCOLS   = 1
    # TODO: read as optionals
    plot       = False 
    verbose    = False 
    delim      = ';' 

    similarity = compareSignals(args.fileA, args.fileB, args.feature_type, verbose=verbose, plot=plot, delimiter=delim)

    print("Pearson similarity: ", similarity)
    








