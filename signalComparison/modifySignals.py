import numpy as np
from scipy.signal import correlate
from scipy.stats import pearsonr
from plotSignals import plotTwoSignalsPartA, plotTwoSignalsPartB

# TODO: need to passing data_orig and data_new as arguments and return new arrays instead of using globals (unsafe) - use profiling to see which is faster
def pad_shorter(a, b, ii=0):
    """Pad shorter signal
    @param `ii` is any column no (used previously for dictionary arrays)
    USES global values `data_orig` and `data_new` are 2D arrays (of input signal transposed)
        - so if original data was (1000 rows, 5 columns), 
            the data_orig.shape == (5, 1000)
    """
    # global data_orig
    # global data_new
    diff = a[ii].size - b[ii].size
    # print("diff", diff)
    if (diff > 0):
        b = np.concatenate((np.zeros(
            (b.shape[0], diff//2)), b, np.zeros((b.shape[0], diff - diff//2))), axis=1)
    elif (diff < 0):
        diff = -diff
        a = np.concatenate((np.zeros(
            (a.shape[0], diff//2)), a, np.zeros((a.shape[0], diff - diff//2))), axis=1)

    return (a, b)


def readCsvData(fileA, fileB, delimiter=';', usecols=None, skipcols=0, skiprows=1):
    """
    Read numeric data and headers (optionally) from two csv files
    __PARAMS__
    `fileA` : string; headers from this file be used only if readHeaders == True
    `fileB` : string
    `delimiter` : (default) is `;` because all csvsinks in OpenSMILE generate csv files with `;` delim
    `usecols` : will be passed to `np.loadtxt()` function (if this is None, a new one will be generated using `skipcols`); use `usecols=None` and `skipcols=0` to read all columns
    `skipcols` : which columns to not read from input files (this also influences headers that are read); 
        __NOTE__ if this is not `0`, __it overrides whatever was specified in usecols__.

    __RETURNS__
    (dataA, dataB, headers)
    `dataA` : numpy.ndarray from `fileA` (transposed)
    `dataB` : numpy.ndarray from `fileB` (transposed)
    `headers` : tuple of headers (type string)
    """
    # FIXME: always get headers from first line
    ##  Initialize variables
    with open(fileA) as file:
        line1 = file.readline().strip()
        features = line1.split(delimiter)
        usecols = [f for f in range(skipcols, len(features))]

        ##  Get headers
        headers = [features[f] for f in usecols] if (skiprows != 0) else [
            str(f) for f in usecols]
    dataA, dataB = tuple(
        [np.loadtxt(file, delimiter=delimiter, usecols=usecols, unpack=True, skiprows=skiprows)
            for file in (fileA, fileB)]
    )

    # Sanity check
    assert(dataA.shape[0] == dataB.shape[0]
           ), "read different columns from each file"
    assert(len(headers) == dataA.shape[0]), "read incorrect headers!"

    return (dataA, dataB, headers)


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
    shift = (correlate(a[corrcol], b[corrcol]
                       ).argmax() - (a[corrcol].size - 1))
    # print("shift", shift)
    if (shift > 0):
        # move new signal RIGHT
        b = np.append(b, np.zeros((b.shape[0], shift//2)), axis=1)
        a = np.append(np.zeros((a.shape[0], shift//2)), a, axis=1)
    elif(shift < 0):
        # move new signal LEFT
        shift = -shift
        b = np.append(np.zeros((b.shape[0], shift//2)), b, axis=1)
        a = np.append(a, np.zeros((a.shape[0], shift//2)), axis=1)

    # Plot After
    plotTwoSignalsPartB(a, b, corrcol)

    # calculate pearson coefficient (NEW)
    # pscore = 0
    # for c in range(skipcols, a.shape[0]):
    #     pscore += sum(pearsonr(a[c], b[c])) / (a.shape[0] - skipcols)
    # print("pearson after: ", pscore, "out of 1")

    # return pscore

    return a, b


def calcPearson(a, b, skipcols=0):
    pscore = 0
    for c in range(skipcols, a.shape[0]):
        pscore += sum(pearsonr(a[c], b[c])) / (a.shape[0] - skipcols)
    return pscore

def getPearsonSimilarity(a, b, skipcols=0):
    coeffs = []
    for col in range(skipcols, a.shape[0]):
        tmpA, tmpB = alignSignals(a, b, col, skipcols=skipcols)
        coeffs.append(calcPearson(tmpA, tmpB, skipcols=skipcols))
        print(coeffs[-1]*100)

    return max(coeffs)*100