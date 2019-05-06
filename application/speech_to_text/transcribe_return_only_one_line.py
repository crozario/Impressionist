#!/usr/bin/env python

# Copyright 2017 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Language code : https://support.google.com/googleplay/android-developer/table/4419860?hl=en
#


"""Google Cloud Speech API sample that demonstrates word time offsets with language change option.
Example usage:
    python transcribe_word_time_offsets.py -s <language> resources/audio.raw
    python transcribe_word_time_offsets.py -s <language> \gs://cloud-samples-tests/speech/vr.flac
"""

import argparse
import io
import os

from google.oauth2 import service_account

apifile = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'api-key.json')
credentials = service_account.Credentials.from_service_account_file(apifile)


def transcribe_file_without_word_time_offsets(speech_file,language):
    """Transcribe the given audio file synchronously and output the word time
    offsets."""
    #print("Start")

    from google.cloud import speech
    from google.cloud.speech import enums
    from google.cloud.speech import types

    #print("checking credentials")

    client = speech.SpeechClient(credentials=credentials)

    #print("Checked")
    with io.open(speech_file, 'rb') as audio_file:
        content = audio_file.read()

    #print("audio file read")

    audio = types.RecognitionAudio(content=content)

    #print("config start")
    config = types.RecognitionConfig(
            encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
            language_code=language,
            enable_word_time_offsets=True,
            audio_channel_count=1)
            # enableSeparateRecognitionPerChannel=True)

    #print("Recognizing:")
    response = client.recognize(config, audio)
    #print("Recognized")

    #return only transcript
    for result in response.results:
        alternative = result.alternatives[0]
        return((alternative.transcript))


def transcribe_file_with_word_time_offsets(speech_file, language):
    """Transcribe the given audio file synchronously and output the word time
    offsets."""
    #print("Start")

    from google.cloud import speech
    from google.cloud.speech import enums
    from google.cloud.speech import types

    #print("checking credentials")

    client = speech.SpeechClient(credentials=credentials)

    #print("Checked")
    with io.open(speech_file, 'rb') as audio_file:
        content = audio_file.read()

    #print("audio file read")

    audio = types.RecognitionAudio(content=content)

    #print("config start")
    config = types.RecognitionConfig(
        encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
        language_code=language,
        enable_word_time_offsets=True,
        audio_channel_count=2)
    # enableSeparateRecognitionPerChannel=True)

    #print("Recognizing:")
    response = client.recognize(config, audio)
    #print("Recognized")
    wholeTranscript = ""
    for result in response.results:
        alternative = result.alternatives[0]
        wholeTranscript = alternative.transcript
        # print('Transcript: {}'.format(alternative.transcript))
        breakdown = [] # tuples (str word, int start_sec, int start_ms, int end_sec, int end_ms)
        for word_info in alternative.words:
            word = word_info.word
            start_time = word_info.start_time
            end_time = word_info.end_time
            start_sec = start_time.seconds
            start_ms = start_time.nanos * 1e-6
            end_sec = end_time.seconds
            end_ms = end_time.nanos *  1e-6
            tmpTuple = (word, start_sec, start_ms, end_sec, end_ms)
            breakdown.append(tmpTuple)
            # print(tmpTuple)
            # print(type(word))
            # print(type(start_time), type(start_time.seconds))
            # print('Word: {}, start_time: {}, end_time: {}'.format(
            #     word,
            #     start_time.seconds + start_time.nanos * 1e-9,
            #     end_time.seconds + end_time.nanos * 1e-9))
    if wholeTranscript is not "":
        return (wholeTranscript, breakdown)
    else:
        print("no transcript returned!")
        return (None, None)

# [START def_transcribe_gcs]
def transcribe_gcs_with_word_time_offsets(gcs_uri,language):
    """Transcribe the given audio file asynchronously and output the word time
    offsets."""
    from google.cloud import speech
    from google.cloud.speech import enums
    from google.cloud.speech import types
    client = speech.SpeechClient()

    audio = types.RecognitionAudio(uri=gcs_uri)
    config = types.RecognitionConfig(
        encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code=language,
        enable_word_time_offsets=True)

    operation = client.long_running_recognize(config, audio)

    print('Waiting for operation to complete...')
    result = operation.result(timeout=90)

    for result in result.results:
        alternative = result.alternatives[0]
        print('Transcript: {}'.format(alternative.transcript))
        print('Confidence: {}'.format(alternative.confidence))

        for word_info in alternative.words:
            word = word_info.word
            start_time = word_info.start_time
            end_time = word_info.end_time
            print('Word: {}, start_time: {}, end_time: {}'.format(
                word,
                start_time.seconds + start_time.nanos * 1e-9,
                end_time.seconds + end_time.nanos * 1e-9))
# [END def_transcribe_gcs]



if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(dest='path', help='File or GCS path for audio file to be recognized')
    parser.add_argument("-s","--string", type=str, required=True)
    args = parser.parse_args()
    if args.path.startswith('gs://'):
        transcribe_gcs_with_word_time_offsets(args.path,args.string)
    else:
        transcribe_file_with_word_time_offsets(args.path,args.string)
