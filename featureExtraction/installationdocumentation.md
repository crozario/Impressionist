# Installing OpenSMILE (for macOS)

## Successful install
## Doing the long way now (section 2.2.2)

- Installed autotools with 
```bash
brew install autoconf automake libtool
```

- Ran `bash autogen.sh` twice then ran the `./configure` script (provide options to install in different place)
- raw bash output and input
```bash
haardshah~/developement/Impressionist/opensmile-2.3.0$ bash autogen.sh 
- aclocal.
- autoconf.
- autoheader.
- automake.
- glibtoolize
haardshah~/developement/Impressionist/opensmile-2.3.0$ bash autogen.sh 
- aclocal.
- autoconf.
- autoheader.
- automake.
- glibtoolize
haardshah~/developement/Impressionist/opensmile-2.3.0$ ./configure 
checking for a BSD-compatible install... /usr/bin/install -c
checking whether build environment is sane... yes
checking for a thread-safe mkdir -p... ./install-sh -c -d
checking for gawk... no
checking for mawk... no
checking for nawk... no
checking for awk... awk
checking whether make sets $(MAKE)... yes
checking whether make supports nested variables... yes
checking for gcc... gcc
checking whether the C compiler works... yes
checking for C compiler default output file name... a.out
checking for suffix of executables... 
checking whether we are cross compiling... no
checking for suffix of object files... o
checking whether we are using the GNU C compiler... yes
checking whether gcc accepts -g... yes
checking for gcc option to accept ISO C89... none needed
checking whether gcc understands -c and -o together... yes
checking for style of include used by make... GNU
checking dependency style of gcc... gcc3
checking for g++... g++
checking whether we are using the GNU C++ compiler... yes
checking whether g++ accepts -g... yes
checking dependency style of g++... gcc3
checking build system type... x86_64-apple-darwin18.2.0
checking host system type... x86_64-apple-darwin18.2.0
checking how to print strings... printf
checking for a sed that does not truncate output... /usr/bin/sed
checking for grep that handles long lines and -e... /usr/bin/grep
checking for egrep... /usr/bin/grep -E
checking for fgrep... /usr/bin/grep -F
checking for ld used by gcc... /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ld
checking if the linker (/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ld) is GNU ld... no
checking for BSD- or MS-compatible name lister (nm)... /usr/bin/nm -B
checking the name lister (/usr/bin/nm -B) interface... BSD nm
checking whether ln -s works... yes
checking the maximum length of command line arguments... 196608
checking how to convert x86_64-apple-darwin18.2.0 file names to x86_64-apple-darwin18.2.0 format... func_convert_file_noop
checking how to convert x86_64-apple-darwin18.2.0 file names to toolchain format... func_convert_file_noop
checking for /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ld option to reload object files... -r
checking for objdump... objdump
checking how to recognize dependent libraries... pass_all
checking for dlltool... no
checking how to associate runtime and link libraries... printf %s\n
checking for ar... ar
checking for archiver @FILE support... no
checking for strip... strip
checking for ranlib... ranlib
checking command to parse /usr/bin/nm -B output from gcc object... ok
checking for sysroot... no
checking for a working dd... /bin/dd
checking how to truncate binary pipes... /bin/dd bs=4096 count=1
checking for mt... no
checking if : is a manifest tool... no
checking for dsymutil... dsymutil
checking for nmedit... nmedit
checking for lipo... lipo
checking for otool... otool
checking for otool64... no
checking for -single_module linker flag... yes
checking for -exported_symbols_list linker flag... yes
checking for -force_load linker flag... yes
checking how to run the C preprocessor... gcc -E
checking for ANSI C header files... yes
checking for sys/types.h... yes
checking for sys/stat.h... yes
checking for stdlib.h... yes
checking for string.h... yes
checking for memory.h... yes
checking for strings.h... yes
checking for inttypes.h... yes
checking for stdint.h... yes
checking for unistd.h... yes
checking for dlfcn.h... yes
checking for objdir... .libs
checking if gcc supports -fno-rtti -fno-exceptions... yes
checking for gcc option to produce PIC... -fno-common -DPIC
checking if gcc PIC flag -fno-common -DPIC works... yes
checking if gcc static flag -static works... no
checking if gcc supports -c -o file.o... yes
checking if gcc supports -c -o file.o... (cached) yes
checking whether the gcc linker (/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ld) supports shared libraries... yes
checking dynamic linker characteristics... darwin18.2.0 dyld
checking how to hardcode library paths into programs... immediate
checking whether stripping libraries is possible... yes
checking if libtool supports shared libraries... yes
checking whether to build shared libraries... yes
checking whether to build static libraries... yes
checking how to run the C++ preprocessor... g++ -E
checking for ld used by g++... /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ld
checking if the linker (/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ld) is GNU ld... no
checking whether the g++ linker (/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ld) supports shared libraries... yes
checking for g++ option to produce PIC... -fno-common -DPIC
checking if g++ PIC flag -fno-common -DPIC works... yes
checking if g++ static flag -static works... no
checking if g++ supports -c -o file.o... yes
checking if g++ supports -c -o file.o... (cached) yes
checking whether the g++ linker (/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ld) supports shared libraries... yes
checking dynamic linker characteristics... darwin18.2.0 dyld
checking how to hardcode library paths into programs... immediate
checking for Pa_Initialize in -lportaudio... no
checking for Pa_GetHostApiCount in -lportaudio... no
configure: WARNING: Compiling WITHOUT PortAudio support!! Sound recording will probably be broken!
checking for the pthreads library -lpthreads... no
checking whether pthreads work without any flags... yes
checking for joinable pthread attribute... PTHREAD_CREATE_JOINABLE
checking if more special flags are required for pthreads... -D_THREAD_SAFE
checking that generated files are newer than configure... done
configure: creating ./config.status
config.status: creating Makefile
config.status: creating config.h
config.status: executing depfiles commands
config.status: executing libtool commands
```

- Ran successfully

- Running `make -j4; make` (manual said to run twice)
- Ran `make install`

**DONE**

- Notes:
    - Installed without PortAudio 
	    - PortAudio is necessary for online/live processing

## Failed attempts
### Trying “build instructions for the impatient”
- Tried ./buildStandalone.sh
    - Failed
```bash
- aclocal.
- autoconf.
- autoheader.
- automake.
Makefile.am:140: error: Libtool library used but 'LIBTOOL' is undefined
Makefile.am:140:   The usual way to define 'LIBTOOL' is to add 'LT_INIT'
Makefile.am:140:   to 'configure.ac' and run 'aclocal' and 'autoconf' again.
Makefile.am:140:   If 'LT_INIT' is in 'configure.ac', make sure
Makefile.am:140:   its definition is in aclocal's search path.
- glibtoolize
./autogen.sh: line 29: glibtoolize: command not found
- aclocal.
- autoconf.
- autoheader.
- automake.
Makefile.am:140: error: Libtool library used but 'LIBTOOL' is undefined
Makefile.am:140:   The usual way to define 'LIBTOOL' is to add 'LT_INIT'
Makefile.am:140:   to 'configure.ac' and run 'aclocal' and 'autoconf' again.
Makefile.am:140:   If 'LT_INIT' is in 'configure.ac', make sure
Makefile.am:140:   its definition is in aclocal's search path.
- glibtoolize
./autogen.sh: line 29: glibtoolize: command not found
./configure --without-portaudio --prefix=/Users/haardshah/developement/Impressionist/opensmile-2.3.0/inst --enable-static --enable-shared=no
configure: WARNING: unrecognized options: --enable-static, --enable-shared
checking for a BSD-compatible install... /usr/bin/install -c
checking whether build environment is sane... yes
checking for a thread-safe mkdir -p... ./install-sh -c -d
checking for gawk... no
checking for mawk... no
checking for nawk... no
checking for awk... awk
checking whether make sets $(MAKE)... yes
checking whether make supports nested variables... yes
checking for gcc... gcc
checking whether the C compiler works... no
configure: error: in `/Users/haardshah/developement/Impressionist/opensmile-2.3.0':
configure: error: C compiler cannot create executables
See `config.log' for more details
failed to configure openSMILE!
```

failed to configure PortAudio!
- Tried ./buildWithPortAudio.sh
    - Failed
```bash
configure: error: Couldn't find 10.5, 10.6, 10.7, 10.8 or 10.9 SDK
failed to configure PortAudio!
```

Installed autotools with 
```bash
brew install autoconf automake libtool
```

Trying again
- ran ./buildStandalone.sh
    - Failed


