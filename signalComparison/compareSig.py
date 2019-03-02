"""Compare features extracted using OpenSMILE
- audio files are aligned using `scipy.signal.correlate`
- then pearson correlation coefficient is calculated (this is the similarity measurement)

Author: Haard @ Impressionist

Status:
- DOING: input files are hard coded (will support cmd line argument in future) 
- needs `.csv` feature files (will support audio file inputs in future)
    - OpenSMILE can be run from inside the script
- MORE REALISTIC feature (will work on it tomorrow)
    - Input1 original features
    - Input2 new audio file
    Program:
    - extract feature from new audio file and then compare with original features

Example usage:
$ python compareSig.py
"""

import argparse
import numpy as np
from scipy.signal import correlate
from scipy.stats import pearsonr
import matplotlib.pyplot as plt

from plotSignals import plotTwoFeaturesMatrices, _plotTwoCols, plotTwoSignalsPartA, plotTwoSignalsPartB, cleanupPlots

# GLOBAL constants 
SKIPCOLS = 1
data_orig = 0 # will become numpy.ndarray
data_new = 0 # will become numpy.ndarray

# TODO: need to passing data_orig and data_new as arguments and return new arrays instead of using globals (unsafe) - use profiling to see which is faster
def pad_shorter(ii=0):
    """Pad shorter signal
    @param `ii` is any column name
    USES global values `data_orig` and `data_new` are 2D arrays (of input signal transposed)
        - so if original data was (1000 rows, 5 columns), 
            the data_orig.shape == (5, 1000)
    """
    global data_orig
    global data_new
    diff = data_orig[ii].size - data_new[ii].size
    # print("diff", diff)
    if (diff > 0):
        data_new = np.concatenate((np.zeros(
            (data_new.shape[0], diff//2)), data_new, np.zeros((data_new.shape[0], diff - diff//2))), axis=1)
    elif (diff < 0):
        diff = -diff
        data_orig = np.concatenate((np.zeros(
            (data_orig.shape[0], diff//2)), data_orig, np.zeros((data_orig.shape[0], diff - diff//2))), axis=1)

# TODO: get files from cmdline inputs OR get audiofile input and use SMILExtract from here to produce prosody feature files
orig_file = '../test-data/features/prosodyShs_opensmile.csv'
new_file = '../test-data/features/prosodyShs_haardopensmile.csv'

# f0 - fundamental frequency
# voicing - voicing probability ... TODO: understand this before using it as data_orig attribute to judge user signal's similarity
# loudness - pcm_loudness_sma; acoustic intensity
##  Read prosody data NOTE: specific to prosodyShs features extracted 
data_orig = np.loadtxt(orig_file, delimiter=';', usecols=(1,2,3,4), unpack=True, skiprows=1)
data_new = np.loadtxt(new_file, delimiter=';', usecols=(1,2,3,4), unpack=True, skiprows=1)
# Constants specific to prosodyShs feature files
FRAMETIME = 0
F0 = 1
VOICING = 2
LOUDNESS = 3

print("--------Visualize raw input signals--------")
plotTwoFeaturesMatrices(data_orig, data_new, skipcols=1)

pad_shorter()

# print('orig size', data_orig[0].size)
# print('new size', data_new[0].size)

##  Align signals
def alignSignals(a, b, corrcol, skipcols=0):
    """Align two signals
    @param `corrcol` : which column to use when correlating the features
    @param `skipcols` : number of beginning columns to skip for pearson coef calculation
    @param `a` : original signal
    @param `b` : new signal
    """
    # print("Aligning signals...")
    # Plot Before 
    plotTwoSignalsPartA(a, b, corrcol)

    # calculate pearson coefficient (INITIAL)
    # pscore = 0
    # for c in range(skipcols, a.shape[0]):
    #     pscore += sum(pearsonr(a[c], b[c])) / (a.shape[0] - skipcols)
    # print("pearson before: ", pscore, "out of 1")

    # shift signals to align
    shift = (correlate(a[corrcol], b[corrcol]).argmax() - (a[corrcol].size - 1))
    # print("shift", shift)
    if (shift > 0):
        # move new signal RIGHT
        b[corrcol] = np.append(b[corrcol], np.zeros(shift//2))
        a[corrcol] = np.append(np.zeros(shift//2), a[corrcol])
    elif(shift < 0):
        # move new signal LEFT
        shift = -shift
        b = np.append( np.zeros( (b.shape[0], shift//2) ), b, axis=1 )
        a = np.append( a, np.zeros( (a.shape[0], shift//2) ), axis=1)

    # Plot After
    plotTwoSignalsPartB(a, b, corrcol)

    # calculate pearson coefficient (NEW)
    pscore = 0
    for c in range(skipcols, a.shape[0]):
        pscore += sum(pearsonr(a[c], b[c])) / (a.shape[0] - skipcols)
    # print("pearson after: ", pscore, "out of 1")  

    return pscore

coeffs = [ alignSignals(data_orig, data_new, col, skipcols=SKIPCOLS) for col in range(SKIPCOLS, data_orig.shape[0]) ]

print("Similarity Score: ", max(coeffs)*100)










