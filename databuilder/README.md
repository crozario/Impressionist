# Builder for constructing test data
## Implements
1. **Creates individual dialogue files** from audio clip and subtitle file
2. **Extract** prosody, chroma, etc. (any other we decide to use later) using OpenSMILE 
3. Program (preferably GUI) to allow for listening to audio and then recording own voice
    - *Need to plan this out*
    - Use individual dialog clips OR whole clip in conjunction with subtitle file? Latter add more work
- Questions?
    - Provide comparison score after user records ?

## 1. Create dialogue files
- Use scipy.io.readwav and writewav