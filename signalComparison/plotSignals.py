import matplotlib.pyplot as plt

def plotTwoFeaturesMatrices(a, b, skipcols=0):
    """Plot two separate 2D matrices normalized
    assumes input signal is transposed (each feature vector is a column)
    @param `a` : 2D numpy.ndarray
    @param `b` : 2D numpy.ndarray
    @param `skipcols` : (optional) number of features to exclude from graph starting from feature 0. (Default) is 0, meaning no features are skipped.
    """
    plt.subplot(2, 1, 1)
    plt.ion()
    for i in range(skipcols, len(a)):
        plt.plot(a[i]/a[i].sum())
    plt.legend([l for l in range(skipcols, len(a))], loc='upper left')
    plt.title('Original Signal')

    plt.subplot(2, 1, 2)
    for i in range(skipcols, len(a)):
        plt.plot(b[i]/b[i].sum())
    plt.legend([l for l in range(skipcols, len(b))], loc='upper left')
    plt.title('New Signal')
    plt.show()
    input("Displaying plot, press [enter] to continue...")
    plt.clf()

def _plotTwoCols(a, b, corrcol):
    plt.plot(a[corrcol])
    plt.plot(b[corrcol])
    plt.legend(['orig_signal', 'new_signal'], loc='upper left')

def plotTwoSignalsPartA(a, b, corrcol):
    """Plots specific feature from input 2D input signal matrix (transposed). Intended to be used by `alignSignals()`
    __NOTE__ assumes input signal is transposed (each feature vector is a column)
    __NOTE__ call to `plotTwoSignalsPartB(a_new, b_new, corrcol)` should follow.
    @param `a` : 2D numpy.ndarray
    @param `b` : 2D numpy.ndarray
    @param `corrcol` : which feature to plot (plots only one line per matrix)
    """
    plt.subplot(2, 1, 1)
    _plotTwoCols(a, b, corrcol)
    plt.title("Before alignment")

def plotTwoSignalsPartB(a_new, b_new, corrcol):
    """Plots specific feature from input 2D input signal matrix (transposed)
    __NOTE__ assumes input signal is transposed (each feature vector is a column)
    @param `a_new` : 2D numpy.ndarray
    @param `b_new` : 2D numpy.ndarray
    @param `corrcol` : which feature to plot (plots only one line per matrix)
    """
    plt.subplot(2, 1, 2)
    _plotTwoCols(a_new, b_new, corrcol)
    plt.title("After alignment")
    plt.show()
    input("Displaying plot, press [enter] to continue...")
    plt.clf()

def cleanupPlots():
    """Clean up any open or plt in buffer that may not be showing
    """
    plt.clf()
    plt.close()