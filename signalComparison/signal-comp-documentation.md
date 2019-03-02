
# Python scipy might be useful to compare features
> Goal: *compare `prosodyShs_opensmile.csv` signal WITH `prosodyShs_haardopensmile.csv` signal (accounting for phase shift)

### Approach 1
- Use `scipy.signal.correlate` to align signals and then compute pearson coef using `scipy.stats.pearsonr`

### Approach 2
- Use `fastdtw` to calculate distance (its dynamic!)

### Approach 3
- MLP approach 
- need to read the paper *Performance Evaluation of Machine Learning Algorithm Applied to a Biometric Voice Recognition System*
    - Uses MFCC features (I want to do this)
> I think this MLP approach is how the **valuable* features pulled using OpenSMILE are supposed to be used


# later 
- need to compare with unknown phase shift **very important**
- need to do the same with .htk (smaller files)

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