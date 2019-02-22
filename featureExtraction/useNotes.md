# **Using opensmile**

> Installation creates `SMILExtract` executable in local dir and installation location

> Note: appendix-like terminal printouts at the end

## **First Run**
```bash
(impressionist_py3.6) haardshah~/developement/Impressionist/opensmile-2.3.0$ SMILExtract -C config/demo/demo1_energy.conf -I example-audio/media-interpretation.wav -O speech02.energy.csv
(MSG) [2] in SMILExtract : openSMILE starting!
(MSG) [2] in SMILExtract : config file is: config/demo/demo1_energy.conf
(MSG) [2] in cComponentManager : successfully registered 91 component types.
==> LEVEL 'wave'  +++  Buffersize(frames) = 88201  +++  nReaders = 1
==> LEVEL 'waveframes'  +++  Buffersize(frames) = 3  +++  nReaders = 1
==> LEVEL 'energy'  +++  Buffersize(frames) = 3  +++  nReaders = 1
(MSG) [2] in cComponentManager : successfully finished createInstances
									(4 component instances were finalised, 1 data memories were finalised)
(MSG) [2] in cComponentManager : starting single thread processing loop
(MSG) [2] in cComponentManager : Processing finished! System ran for 526 ticks.
```

## **How can signals be compared**
- [Stackoverflow](https://stackoverflow.com/a/20672356)
	- time doman analysis : how visually similar are signals
	- frequency or time-frequency analysis : how similar audio signals sound
	- signal variance : for noise measure
	- See link ^ for matlab code for the following
		- Similarity in time domain (static): *Multiply in place and sum*.
		- Similarity in time domain (with shift): Take *fft* of each signal, *multiply*, and *ifft*. (I believe this equivalent to matlab's xcorr.)
		- Similarity in frequency domain (static): Take *fft* of each signal, *multiply*, and *sum*.
		- Similarity in frequency domain (with shift): *Multiply the two signals and take fft*. This will show if the signals share similar spectral shapes.
		- Similarity in energy (or power if different lengths): *Square the two signals and sum each* (and divide by signal length for power). (Since the signals were detrended, this should be *signal variance*.) Then subtract and take absolute value for a measure of signal variance similarity
- [Pearson correlation coefficient](https://dsp.stackexchange.com/questions/9491/normalized-square-error-vs-pearson-correlation-as-similarity-measures-of-two-sig/9492#9492)
	> Summarizing, in general the Pearson correlation coefficient gives you a better idea of the similarity of two signals. 
- [Audio signal comparison for automatic singing evaluation](https://dsp.stackexchange.com/questions/2556/audio-signal-comparison-for-automatic-singing-evaluation/2559#2559)
- Further research [Hot answers `waveform-similarity`](https://dsp.stackexchange.com/tags/waveform-similarity/hot)

## **Config files**
Outline:
- [Generate Configs](#generate-configs)
- [Section Headers](#section-headers)
- [Component Connections](#component-connections)
- [Section 2.4](#Section-24) - Inside OpenSMILE
- [2.4.1 Buffers](#241-Buffers)
- [2.4.3 OpenSMILE terminology](#243-OpenSMILE-terminology)
- [Section 2.5 Default feature sets](#Section-25-Default-feature-sets)
- [2.5.1 Available options for audio input for all standard config files](#251-Available-options-for-audio-input-for-all-standard-config-files)
- [Prosodic features](#Prosodic-features)
- [Chroma features](#Chroma-features)
- [What are chroma features?](#What-are-chroma-features?)
- [MFCC features](#MFCC-features)
- [PLP features](#PLP-features)

### **Generate Configs** 
- Generate config files
```bash
SMILExtract -cfgFileTemplate -configDflt cWaveSource,cFramer,cEnergy,cCsvSink -l 1 2> haardconfigs/mydemo.conf
```

### **Section Headers**
- `[instanceName:componentName]`


### **Component Connections**
- Okay having some difficulty understanding this
- **How to configure component connections?**
	- assigning memory "levels" to the *dataReader* and *dataWriter* by modifying `reader.dmLevel` and `writer.dmLevel`
	- *dataReader* and *dataWriter* in each source, sink, or processing component
	- <mark>Section 2.3</mark>: Basics of how to configure openSMILE
- UP NEXT
	- **2.5**
	- *standard baseling feature sets of international research competitions*
	- also explains cmdline options that the standard feature set configuration files all provide and that can be used to influence parameters of hte data input and output
	- **4.2 - 4.3**: to explore full potential of openSMILE
	- *4.2* description of the format
	- *4.3* detailed function and configuration options of all components

### **Section 2.4**

> what is going on inside openSMILE, which components exist besides those which are instantiable and connectable via the configuration files, and to learn more about the terminology used.

- OpenSmILE split into 3 phases 
	- Pre-config phase
		- cmdline options read and config file parsed
	- Configuration phase
		- 
	- Execution phase
		- tick-loop
		- each component has a `tick()` method
		- 
### **2.4.1 Buffers**
	- buffers: *ring-buffer* or *non-ring buffer*
	- if you use non-ring buffers, or if you want to process the full input (e.g. for functionals of the complete input, or mean normalization) use dynamically growing non-ring buffer level (see `cDataWriter` configuration for details)
- 2.4.2 (not documented yet)
	- look at `doc/developer/messages.txt`
	- `smileComponent.hpp` source file for structural definition of smile messages
### **2.4.3 OpenSMILE terminology**
	- *frames*: are an example sample at a timestamp
		- for a <nFields x nTimestamps> matrix, frames would refer to columns
			- *windows* or *contours* correspond to rows of this matrix
		- for exported data files, matrix is transposed, so *fields* are rows here
			- *windows* or *contours* would be columns here
	- *elements* refers to actual elements of frame/vectors
	- *field*: group of elements that belong together logically and where all elements have the same name

### **Section 2.5 Default feature sets**

> For common tasks from Music Information Retrieval and Speech Recognition fields we provide some example configuration files in the `config/` directory

- **TODO:** Lookup first information about the following feature sets
	- 

### **2.5.1 Available options for audio input for all standard config files**
<p align="center"><img src="images/smile-cmd-args.png" align="center">

- **-frameModeFunctionalsConf** option to include and four most common use-cases:
<p align="center"><img src="images/frameMode-include-usecases.png" align="center">

- **bufferMode** configuration
	- *imp: buffer size configured must be compatible with the frameMode setting in frameModeFunctionalsConf*
	- REVIEW <mark>page 34</mark> again

- Page 35 - **output data formats** for the features pulled out 

### **Prosodic features** 
1. `config/prosodyAcf.conf` and 
2. `config/prosodyShs.conf`
- They extract:
	- fundamental frequency (F0)? - 
	- voicing probability
	- loudness contours
- **default output** - CSV 
- Command
```
SMILExtract -C config/prosodyShs.conf -I input.wav -O prosody.csv
```
- `1` uses `cPitchACF` component
	- extracts `f0` via an *autocorrelation* and *cepstrum based method*
- `2` uses `cPitchShs` component
	- extracts `f0` via the *sub-harmonic sampling algorithm (SHS)*

### **Chroma features** 
- `config/chroma_fft.conf`
- command - `SMILExtract -C config/chroma_fft.conf -I input.wav -O chroma.csv`
- **output**: single line with 12 comma separated values representing mean Chroma values.

--> <mark>Resolve</mark>: prolly not a bad idea to test (question still remains, how to compare?)
#### What are chroma features?
- *Chroma features*: also *pitch class profiles* are a powerful tool for analyzing usic whose pitches can be meaningfully categorized (into 12 categories)
- they <u>capture harmonic and melodic characteristics</u> of music, while being *robust to changes in timbre and instrumentation* (do we want this?)
	- *timbre*: perceived sound quality of musical note, sound or tone (*we don't want to focus on timbre*) - so this makes sense? ***confirm with debbie***
	- *instrumentation*: combination of musical instruments employed in a composition, and properties of those instruments individually. 
	---
	- Do we want to capture <u>harmonic and melodic characteristics</u>? ***debbie?***
- Another APPLICATION: "chroma features have become de facto standard for tasks such as music alignment and synchronization as well as audio structure analysis." --> *Could we align user's dialogue with actor's dialgue?*

### **MFCC features** 
- MFCC - Mel-frequency cepstral coefficient

--> <mark>Resolve</mark>: seems helpful in determining prosodic aspects + might help us learn user's voice (timber) for personalization (more custom feature - DREAM BIG)

- MFCCs are commonly used as feature in speech recognition systems
- MFCCs make up an MFC (Mel-frequency cepstrum)
	- *Mel-freq cepstrum* is a representation of the short-term <u>power spectrum</u> of a sound, based on linear cosine transform of a log power spectrum on a nonlinear *mel-scale* of frequency
		- *Mel-scale*: perceptual scale of pitches judged by listeners to be equal in distance from one another
	- *cepstrum* result of taking the inverse Fourier transform (IFT) of the logarithm of estimated *spectrum* of a signal.
		- "Cepstrum pitch determination is particularly effective because the effects of the voical excitation (pitch) and vocal tract (*formants*) are additive in the logarithm of the power spectrum and thus clearly separate" (*what does this mean? - pitch and formants can be separated from log of power spectrum to detection*)
		- *formants*: each of several prominent bands of frequency that determine the phonetic quality of a vowel
		- 4 different sepstrums ("<u>**power sepstrum**</u> has applications in analysis of human speech)
	- *spectrum* "any waveform can be represented by a summation of a (possibly infinite) number of sinusoids, each with a particular amplitude and phase. This representation is referred to as the *signal's spectrum* (or it's frequency-domain representation)" [Signal Spectra](https://www.music.mcgill.ca/~gary/307/week1/spectra.html)
> The cepstrum is a representation used in homomorphic signal processing, to convert signals combined by convolution (such as a source and filter) into sums of their cepstra, for linear separation. In particular, the <u>*power cepstrum*</u> is often used as a feature vector for representing the human voice and musical signals. For these applications, the spectrum is usually first transformed using the mel scale. The result is called the mel-frequency cepstrum or MFC (its coefficients are called mel-frequency cepstral coefficients, or MFCCs). It is used for voice identification, pitch detection and much more. The cepstrum is useful in these applications because the low-frequency periodic excitation from the vocal cords and the formant filtering of the vocal tract, which convolve in the time domain and multiply in the frequency domain, are additive and in different regions in the quefrency domain.
- **Not noise sensitive** - therefore common to normalize their values in speech recognition systems

### **PLP features**
- PLP : perceptual linear predictive
- [Techniques for speaker-independent automatic-speech recognition](plp-paper.pdf)
> PLP analysis is computationally efficient and yields a low-dimentional representation of speech.
> These properties are found to be useful in *speaker-independent automatic-speech recognition*.
- PLP and [Perceptual filtering](https://www.vocal.com/perceptual-filtering/)
- Could be used to improve performace of speech recognition and reduce computational load

## **High level feature ideas / thoughts**
- To make this highly interactive 
	- the front has to be slick
	- the video should scrub seemlessly (if animated, it should be smooth)
	- messaged (feedback about performance or program function messages or directions) should be highly personalized and specific. Not general and useless.
- Implement sophisticated failsafe option 
	- meaning *if user is saying it right but we can't see that*
	- display personalized messages for special events with special back-end checking
	- scenarios
		- *if user performed well but the scored don't reflect that*
			- "don't think the scores judging properly? - report it!" OR under the score, have a button that says, "I actually did well!"
			- *back-end* maybe check for inconsistency between various different feature similarities before even giving that option. OR always give that option but check for inconsistency among different feature similarities before using the feedback
		- *when the scores are good but the user didn't actually do* 
			- Button "I actually don't think I did that well."
			- *back-end* this might mean that more than necessary weight given to a feature that was compared. Readjust the weights.
				- *If it's a personalized neural net, for this and above scenario, manually or some other way label these to be used for training*
		- *user is happy with scores they're getting*
		- *user's hate the scoring*
			- ask for text feedback
			




















## Appendix

- Running `$ SMILExtract -h`
```
 =============================================================== 
   openSMILE version 2.3.0 (Rev. 2014:2043)
   Build date: Feb 12 2019 (UNKNOWN-BUILD-DATE)
   Build branch: 'opensmile-2.3.0'
   (c) 2014-2016 by audEERING GmbH
   All rights reserved. See the file COPYING for license terms.
   Lead author: Florian Eyben
 =============================================================== 
 
Usage: SMILExtract [-option (value)] ...
 
 -h    Show this usage information
 
 -C, -configfile  	 <string>
	 Path to openSMILE config file
	 {{ default = 'smile.conf' }}
 
 -l, -loglevel  	 <integer value>
	 Verbosity level (0-9)
	 {{ default = 2 }}
 
 -t, -nticks  	 <integer value>
	 Number of ticks to process (-1 = infinite) (only works for single thread processing, i.e. nThreads=1)
	 {{ default = -1 }}
 
 -L, -components  	 [boolean 0/1]
	 Show component list
	 {{ default = 0 }}
 
 -H, -configHelp  	 [string]
	 Show documentation of registered config types (on/off/argument) (if an argument is given, show only documentation for config types beginning with the name given in the argument)
	 {{ default = '(null)' }}
 
 -configDflt      	 [string]
	 Show default config section templates for each config type (on/off/argument) (if an argument is given, show only documentation for config types beginning with the name given in the argument, OR for a list of components in conjunctions with the 'cfgFileTemplate' option enabled)
	 {{ default = '(null)' }}
 
 -cfgFileTemplate      	 [boolean 0/1]
	 Print a complete template config file for a configuration containing the components specified in a comma separated string as argument to the 'configDflt' option
	 {{ default = 0 }}
 
 -cfgFileDescriptions      	 [boolean 0/1]
	 Include description in config file templates.
	 {{ default = 0 }}
 
 -c, -ccmdHelp  	 [boolean 0/1]
	 Show custom commandline option help (those specified in config file)
	 {{ default = 0 }}
 
 -logfile      	 <string>
	 set log file
	 {{ default = 'smile.log' }}
 
 -nologfile      	 [boolean 0/1]
	 don't write to a log file (e.g. on a read-only filesystem)
	 {{ default = 0 }}
 
 -noconsoleoutput      	 [boolean 0/1]
	 don't output any messages to the console (log file is not affected by this option)
	 {{ default = 0 }}
 
 -appendLogfile      	 [boolean 0/1]
	 append log messages to an existing logfile instead of overwriting the logfile at every start
	 {{ default = 0 }}
```
