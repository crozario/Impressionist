

## GNU plot
### for chroma features
#### Extract features
- Extract features first
```
$ SMILExtract -C config/chroma_fft.conf -I test-data/example-audio/opensmile.wav -O test-data/features/chroma_opensmile.csv
```
- output
```
(MSG) [2] in SMILExtract : openSMILE starting!
(MSG) [2] in SMILExtract : config file is: config/chroma_fft.conf
(MSG) [2] in cComponentManager : successfully registered 91 component types.
(MSG) [2] in cComponentManager : successfully finished createInstances
                                 (8 component instances were finalised, 1 data memories were finalised)
(MSG) [2] in cComponentManager : starting single thread processing loop
(MSG) [2] in cComponentManager : Processing finished! System ran for 201 ticks.
```
----------------
#### Plot
- tried gnuplot
```
haardshah~/developement/Impressionist/opensmile-2.3.0/scripts/gnuplot$ ./plotchroma.sh ../../test-data/features/chroma_opensmile.csv 
```
- output
```
Starting gnuplot, type 'quit' to exit the gnuplot prompt!
./plotchroma.sh: line 10: gnuplot: command not found
```
- GNU plot isn't installed (DO THAT NEXT)
--------------
#### Install gnuplot
- run brew install
```bash
haardshah~/developement/Impressionist/opensmile-2.3.0/scripts/gnuplot$ brew install gnuplot
```
- output
```bash
haardshah~/developement/Impressionist/opensmile-2.3.0/scripts/gnuplot$ brew install gnuplot
Updating Homebrew...
==> Auto-updated Homebrew!
Updated Homebrew from f3716fe2d to ba2885323.
Updated 3 taps (osrf/simulation, homebrew/core and cartr/qt4).
==> New Formulae
libopenmpt                                           mage                                                 reprepro
==> Updated Formulae
harfbuzz ✔                              fwup                                    mariadb                                 rabbitmq
pixman ✔                                git-quick-stats                         mariadb@10.0                            rgbds
allure                                  gmsh                                    mariadb@10.1                            rke
autoconf-archive                        google-java-format                      mysql@5.7                               rocksdb
awscli                                  gradle-completion                       nexus                                   shellz
ballerina                               groonga                                 ninja                                   ship
bettercap                               handbrake                               nnn                                     spatialindex
bind                                    hledger                                 opa                                     squid
caddy                                   imagemagick                             osquery                                 step
cassandra                               ipython                                 osrf/simulation/ignition-rendering1     texinfo
checkbashisms                           jdupes                                  osrf/simulation/ignition-sensors0       thors-serializer
cockroach                               jenkins                                 pgroonga                                tmux-xpanes
cocoapods                               jfrog-cli-go                            phpunit                                 topgrade
container-diff                          kibana                                  picat                                   tor
convox                                  libmagic                                postgresql                              typescript
crowdin                                 libpqxx                                 postgresql@9.4                          unrar
eiffelstudio                            libpulsar                               presto                                  urbit
embulk                                  libtermkey                              profanity                               vim
eslint                                  links                                   psql2csv                                weaver
file-formula                            liquibase                               pushpin                                 weechat
fish                                    logstash                                pypy                                    wtf
flake8                                  lynis                                   pypy3                                   ydcv
fonttools                               macvim                                  pyside                                  youtube-dl
==> Processing ignition-msgs formula rename to ignition-msgs0
==> Unlinking ignition-msgs
==> Temporarily unlinking ignition-msgs0
==> Moving ignition-msgs versions to /usr/local/Cellar/ignition-msgs0
==> Relinking ignition-msgs0

==> Installing dependencies for gnuplot: libcerf, lua, pixman, harfbuzz and pango
==> Installing gnuplot dependency: libcerf
==> Downloading https://homebrew.bintray.com/bottles/libcerf-1.11.mojave.bottle.tar.gz
######################################################################## 100.0%
==> Pouring libcerf-1.11.mojave.bottle.tar.gz
🍺  /usr/local/Cellar/libcerf/1.11: 34 files, 163.4KB
==> Installing gnuplot dependency: lua
==> Downloading https://homebrew.bintray.com/bottles/lua-5.3.5_1.mojave.bottle.tar.gz
######################################################################## 100.0%
==> Pouring lua-5.3.5_1.mojave.bottle.tar.gz
==> Caveats
You may also want luarocks:
  brew install luarocks
==> Summary
🍺  /usr/local/Cellar/lua/5.3.5_1: 28 files, 274.5KB
==> Installing gnuplot dependency: pixman
==> Downloading https://homebrew.bintray.com/bottles/pixman-0.38.0.mojave.bottle.tar.gz
######################################################################## 100.0%
==> Pouring pixman-0.38.0.mojave.bottle.tar.gz
🍺  /usr/local/Cellar/pixman/0.38.0: 13 files, 1.3MB
==> Installing gnuplot dependency: harfbuzz
==> Downloading https://homebrew.bintray.com/bottles/harfbuzz-2.3.1.mojave.bottle.tar.gz
######################################################################## 100.0%
==> Pouring harfbuzz-2.3.1.mojave.bottle.tar.gz
🍺  /usr/local/Cellar/harfbuzz/2.3.1: 180 files, 9.5MB
==> Installing gnuplot dependency: pango
==> Downloading https://homebrew.bintray.com/bottles/pango-1.42.4_1.mojave.bottle.tar.gz
######################################################################## 100.0%
==> Pouring pango-1.42.4_1.mojave.bottle.tar.gz
🍺  /usr/local/Cellar/pango/1.42.4_1: 106 files, 4.4MB
==> Installing gnuplot
==> Downloading https://homebrew.bintray.com/bottles/gnuplot-5.2.6_1.mojave.bottle.1.tar.gz
######################################################################## 100.0%
==> Pouring gnuplot-5.2.6_1.mojave.bottle.1.tar.gz
🍺  /usr/local/Cellar/gnuplot/5.2.6_1: 48 files, 2.9MB
==> Caveats
==> lua
You may also want luarocks:
  brew install luarocks
```
---------------
#### Run gnuplot again
- try
```bash
haardshah~/developement/Impressionist/opensmile-2.3.0/scripts/gnuplot$ ./plotchroma.sh ../../test-data/features/chroma_opensmile.csv 
Starting gnuplot, type 'quit' to exit the gnuplot prompt!
"plotmatrix_chroma.gp" line 11: Scan size of matrix is zero
```
- Figured there was an error in the original perl script (fixed it and submitted pull request!)
- **Command works!**


## Extracting prosody information
- producing binary output 

- Ran
```bash
SMILExtract -C config/prosodyShs.conf -I test-data/example-audio/opensmile.wav -csvoutput test-data/features/prosodyShs_opensmile.csv
```
- Output
```bash
(MSG) [2] in SMILExtract : openSMILE starting!
(MSG) [2] in SMILExtract : config file is: config/prosodyShs.conf
(MSG) [2] in cComponentManager : successfully registered 91 component types.
(MSG) [2] in instance 'lldarffsink' : No filename given, disabling this sink component.
(WARN) [2] in instance 'shs' : Requested input field matching pattern '*Mag_logScale*' not found, check your config! Defaulting to use first field. Available fields:
  Field name & dimension:
    pcm_fftMag_octScale 2049
==> LEVEL 'wave'  +++  Buffersize(frames) = 220500  +++  nReaders = 1
     Period(in seconds) = 0.000023 	 frameSize(in seconds) = 0.000023 (last: 0.000000)
     BlocksizeRead(frames) = 2646 	 BlocksizeWrite(frames) = 44100
     Number of elements: 1 	 Number of fields: 1
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0.       : pcm
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
==> LEVEL 'outp'  +++  Buffersize(frames) = 500  +++  nReaders = 2
     Period(in seconds) = 0.010000 	 frameSize(in seconds) = 0.050000 (last: 0.000000)
     BlocksizeRead(frames) = 1 	 BlocksizeWrite(frames) = 1
     Number of elements: 2205 	 Number of fields: 1
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0. - 2204. : pcm[0-2204]  (2205)
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
==> LEVEL 'intens'  +++  Buffersize(frames) = 500  +++  nReaders = 1
     Period(in seconds) = 0.010000 	 frameSize(in seconds) = 0.050000 (last: 0.000000)
     BlocksizeRead(frames) = 4 	 BlocksizeWrite(frames) = 1
     Number of elements: 1 	 Number of fields: 1
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0.       : pcm_loudness
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
==> LEVEL 'win'  +++  Buffersize(frames) = 500  +++  nReaders = 1
     Period(in seconds) = 0.010000 	 frameSize(in seconds) = 0.050000 (last: 0.000000)
     BlocksizeRead(frames) = 1 	 BlocksizeWrite(frames) = 1
     Number of elements: 2205 	 Number of fields: 1
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0. - 2204. : pcm[0-2204]  (2205)
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
==> LEVEL 'fftc'  +++  Buffersize(frames) = 500  +++  nReaders = 1
     Period(in seconds) = 0.010000 	 frameSize(in seconds) = 0.092880 (last: 0.050000)
     BlocksizeRead(frames) = 1 	 BlocksizeWrite(frames) = 1
     Number of elements: 4096 	 Number of fields: 1
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0. - 4095. : pcm[0-4095]  (4096)
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
        0. - 4095. : infoSize = 16392 (dt = 513)
==> LEVEL 'fftmag'  +++  Buffersize(frames) = 500  +++  nReaders = 1
     Period(in seconds) = 0.010000 	 frameSize(in seconds) = 0.092880 (last: 0.050000)
     BlocksizeRead(frames) = 1 	 BlocksizeWrite(frames) = 1
     Number of elements: 2049 	 Number of fields: 1
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0. - 2048. : pcm_fftMag[0-2048]  (2049)
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
        0. - 2048. : infoSize = 16392 (dt = 514)
==> LEVEL 'hps'  +++  Buffersize(frames) = 500  +++  nReaders = 1
     Period(in seconds) = 0.010000 	 frameSize(in seconds) = 0.092880 (last: 0.050000)
     BlocksizeRead(frames) = 1 	 BlocksizeWrite(frames) = 1
     Number of elements: 2049 	 Number of fields: 1
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0. - 2048. : pcm_fftMag_octScale[0-2048]  (2049)
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
        0. - 2048. : infoSize = 16392 (dt = 514)
==> LEVEL 'pitchShs'  +++  Buffersize(frames) = 500  +++  nReaders = 1
     Period(in seconds) = 0.010000 	 frameSize(in seconds) = 0.092880 (last: 0.050000)
     BlocksizeRead(frames) = 1 	 BlocksizeWrite(frames) = 1
     Number of elements: 15 	 Number of fields: 6
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0.       : nCandidates
       1. -  4. : F0Cand[0-3]  (4)
       5. -  8. : candVoicing[0-3]  (4)
       9. - 12. : candScores[0-3]  (4)
      13.       : F0raw
      14.       : voicingClip
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
==> LEVEL 'pitch'  +++  Buffersize(frames) = 500  +++  nReaders = 1
     Period(in seconds) = 0.010000 	 frameSize(in seconds) = 0.092880 (last: 0.050000)
     BlocksizeRead(frames) = 4 	 BlocksizeWrite(frames) = 1
     Number of elements: 2 	 Number of fields: 2
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0.       : F0final
       1.       : voicingFinalUnclipped
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
==> LEVEL 'lld'  +++  Buffersize(frames) = 500  +++  nReaders = 2
     Period(in seconds) = 0.010000 	 frameSize(in seconds) = 0.092880 (last: 0.050000)
     BlocksizeRead(frames) = 1 	 BlocksizeWrite(frames) = 1
     Number of elements: 3 	 Number of fields: 3
     type = float   noHang = 1   isRingbuffer(isRb) = 1   growDyn = 0
     Fields: index (range) : fieldname[array indicies]  (# elements)
       0.       : F0final_sma
       1.       : voicingFinalUnclipped_sma
       2.       : pcm_loudness_sma
     Fields with info struct set: (index (range) : info struct size in bytes (dt = datatype))
(MSG) [2] in cComponentManager : successfully finished createInstances
                                 (13 component instances were finalised, 1 data memories were finalised)
(MSG) [2] in cComponentManager : starting single thread processing loop
(MSG) [2] in cComponentManager : Processing finished! System ran for 205 ticks.
```