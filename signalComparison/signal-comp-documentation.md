
# Python scipy might be useful to compare features
> Goal: *compare `prosodyShs_opensmile.csv` signal WITH `prosodyShs_haardopensmile.csv` signal (accounting for phase shift)

### Approach 1
- Use `scipy.signal.correlate` to align signals and then compute pearson coef using `scipy.stats.pearsonr`
- **DONE** uploaded to git 
    - inside `compareSig.py`

### Approach 2
- Use `fastdtw` to calculate distance (its dynamic!)

#### Other DTW libraries (do time testing with all of them)
- [DTW ](https://libraries.io/pypi/soft-dtw) - great examples on notebook (github repo for more details on implementation)
    - provides [basic](https://en.wikipedia.org/wiki/Dynamic_time_warping) DTW implementation
    - [accelerated version](https://github.com/pierre-rouanet/dtw/pull/8) relies on scipy
    - **check out** this example for finding similarity between MFCC features - [DTW + MFCC](https://github.com/pierre-rouanet/dtw/blob/master/examples/MFCC%20%2B%20DTW.ipynb)
- [Similarity Measures (5 including dtw)](https://libraries.io/pypi/similaritymeasures)
- [Visualization DTW algo](https://libraries.io/nuget/NDtw.Visualization.Wpf)
- [dtwalign](https://libraries.io/pypi/dtwalign) - 
- [cdtw](https://libraries.io/pypi/cdtw) - sample code provided
- [softdtw](https://libraries.io/pypi/soft-dtw) - quadratic time implementation with code sample and explanation
- Not sure what they are:
    - [dtwclust](https://libraries.io/cran/dtwclust) - with sample codes and explanations
    - 

### Approach 3
- MLP approach 
- need to read the paper *Performance Evaluation of Machine Learning Algorithm Applied to a Biometric Voice Recognition System*
    - Uses MFCC features (I want to do this)
> I think this MLP approach is how the **valuable* features pulled using OpenSMILE are supposed to be used


# later 
- need to compare with unknown phase shift **very important**
- need to do the same with .htk (smaller files)

# General definitions and research notes
## Reading the paper - "Using Dynamic Time Warping to compute prosodic similarity measures"
### Section 3 - (Dis)similarity measures
**3 Objectives Measured** to evaluate prosodic differences 
1. Hermes similarity measure applied on *interpolated pitch contours* of 2 sentences
2. Hermes similarity measure on DTW-aligned pitch contours
3. Alignment cost of the DTW considered as distance between the two prosodic continua

### Definitions
- Interpolated pitch contours - method of constructing new data points within the range of a discrete set of known data points.

### Hermes similarity measure
- **weighted correlation** between two F0 contours. (try this and compare with scipy.stats.pearsonr)
- Limitations
    - assumes equal length signals
    - only compares pitch contours (feature vector consists of single weighted f0 values)

### DTW to compare prosodic profiles
- Handles
    - different lengths
    - complex prosodic feature vectors
- [How does DTW work?](https://youtu.be/_K1OsqCicBY)
    - Helped understand (need to test now)

# Other approaches / resources
- [IMPORTANT concepts *Speech Recognition* (wiki)](https://en.wikipedia.org/wiki/Speech_recognition#Dynamic_time_warping_(DTW)-based_speech_recognition)
    - read HMM portion
    - read DTW : *algorithm for measuring similarity between two sequences that may vary in time or speed*
- [Code uses chromaprint for fingerprint generation](https://medium.com/@shivama205/audio-signals-comparison-23e431ed2207)
- [READ how does chromaprint work](https://oxygene.sk/2011/01/how-does-chromaprint-work/)

- [SO - Algorithm for voice comparison](https://stackoverflow.com/questions/2808876/algorithm-for-voice-comparison)

- [General signal info](http://www.dspguide.com/ch9/1.htm)
    - Highlighted with Highly

- [Almost Everything you need to know about time series](https://towardsdatascience.com/almost-everything-you-need-to-know-about-time-series-860241bdc578)

- https://stackoverflow.com/questions/6170548/using-python-to-measure-audio-loudness
- https://stackoverflow.com/questions/2356779/importing-sound-files-into-python-as-numpy-arrays-alternatives-to-audiolab
- [Python Pandas data analysis toolkit](https://pandas.pydata.org/pandas-docs/stable/)
    - **Compare signals with pandas??**
- [Dynamic Time Warping (wiki)](https://en.wikipedia.org/wiki/Dynamic_time_warping)

# Really helpful explanations
- [What is cross-correlation w/ example](https://stackoverflow.com/a/6285609/7303112)

# Libraries / modules used
- [scipy correlate](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.correlate.html)
- Also used scipy.stats.pearsonr - to calculate pearson correlation between signals

