import numpy as np
from scipy.signal import correlate
from scipy.stats import pearsonr
import matplotlib.pyplot as plt

# a = np.array([3, 4, 1, 3])
# b = np.array([2,3,1])

# TODO: get files from cmdline inputs OR get audiofile input and use SMILExtract from here to produce prosody feature files
orig_file = '../test-data/features/prosodyShs_opensmile.csv'
new_file = '../test-data/features/prosodyShs_haardopensmile.csv'

# TODO: understand ``
# f0 - fundamental frequency
# voicing - voicing probability ... TODO: understand this before using it as a attribute to judge user signal's similarity
# loudness - pcm_loudness_sma; acoustic intensity
##  Read data
data_orig = {}
data_orig['frameTime'], data_orig['f0'], data_orig['voicing'], data_orig['loudness'] = np.loadtxt(orig_file, delimiter=';', usecols=(1,2,3,4), unpack=True, skiprows=1)
data_new = {}
data_new['frameTime'], data_new['f0'], data_new['voicing'], data_new['loudness'] = np.loadtxt(
    new_file, delimiter=';', usecols=(1, 2, 3, 4), unpack=True, skiprows=1)


##  Plot raw signals
# plt.subplot(2,1,1)
# plt.plot(data_orig['frameTime'], data_orig['f0']/data_orig['f0'].sum())
# plt.plot(data_orig['frameTime'], data_orig['voicing']/data_orig['voicing'].sum())
# plt.plot(data_orig['frameTime'], data_orig['loudness']/data_orig['loudness'].sum())
# plt.legend(['f0', 'voicing_prob', 'loudness'], loc='upper left')
# plt.title('Original Signal')

# plt.subplot(2,1,2)
# plt.plot(data_new['frameTime'], data_new['f0']/data_new['f0'].sum())
# plt.plot(data_new['frameTime'], data_new['voicing'] / data_new['voicing'].sum())
# plt.plot(data_new['frameTime'], data_new['loudness'] / data_new['loudness'].sum())
# plt.legend(['f0', 'voicing_prob', 'loudness'], loc='upper left')
# plt.title('New Signal')
# plt.show()

##  Pad shorter signal
# `a` and `b` are dictionaries
# `ii` is any column name
def pad_shorter(a, b, ii='frameTime'):
    diff = a[ii].size - b[ii].size
    # print("diff", diff)
    if (diff > 0):
        for c in b:
            data_new[c] = np.concatenate(( np.zeros(diff//2), b[c], np.zeros(diff - diff//2) ))
    elif (diff < 0):
        diff = abs(diff)
        for c in a:
            data_orig[c] = np.concatenate(( np.zeros(diff//2), a[c], np.zeros(diff - diff//2) ))

pad_shorter(data_orig, data_new)

##  Align signals

print('orig size', data_orig['frameTime'].size)
print('new size', data_new['frameTime'].size)

# output 
# `a` and `b` are dictionaries
# `corrcol` which column to use to correlate
def alignSignals(a, b, corrcol):
    plt.subplot(2,1,1)
    plt.plot(a[corrcol])
    plt.plot(b[corrcol])
    plt.legend(['original', 'new'], loc='upper left')
    plt.title("Before alignment")

    # cols = []
    cols = [key for key in a]

    pscore = 0
    for c in range(1, len(cols)):
        pscore += sum(pearsonr(a[cols[c]], b[cols[c]])) / (len(cols) - 1)
    print("pearson before: ", pscore, "out of 1")

    shift = (correlate(a[corrcol], b[corrcol]).argmax() - (a[corrcol].size - 1))
    if (shift > 0):
        # move new signal RIGHT
        b[corrcol] = np.append(b[corrcol], np.zeros(shift//2))
        a[corrcol] = np.append(np.zeros(shift//2), a[corrcol])
    elif(shift < 0):
        # move new signal LEFT
        shift = -shift
        b[corrcol] = np.append(np.zeros(shift//2), b[corrcol])
        a[corrcol] = np.append(a[corrcol], np.zeros(shift//2))

    plt.subplot(2,1,2)
    plt.plot(a[corrcol])
    plt.plot(b[corrcol])
    plt.legend(['original', 'new'], loc='upper left')
    plt.title("After alignment")

    pscore = 0
    for c in range(1, len(cols)):
        pscore += sum(pearsonr(a[cols[c]], b[cols[c]])) / (len(cols) - 1)
    print("pearson after: ", pscore, "out of 1")
    
    plt.show()

alignSignals(data_orig, data_new, 'f0')










