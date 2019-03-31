"""
Application server (Flask)
"""

import os
# make sure it is run from Impressionist/application
if (os.getcwd() != os.path.dirname(os.path.realpath(__file__))):
    print("Application server should be run from application folder.")
    print("cwd:", os.getcwd())
    exit()
# CWD = os.getcwd()
# print(CWD)
# CONTENT_DIR = os.path.join(os.path.dirname(CWD), 'contentData')
# print(CONTENT_DIR)
# FRIENDS_DIR_2_12 = os.path.join(
#     CONTENT_DIR, 'tvShows/Friends/02/12-The-One-After-The-Superbowl-Part1')
# print(FRIENDS_DIR_2_12)
# RAND_TEST_DIR = os.path.join(CONTENT_DIR, 'another/dir/test')
# print(RAND_TEST_DIR)
# # mkdir
# print(os.path.isdir(RAND_TEST_DIR))
# exit()

import sys
sys.path.insert(0, 'signalComparison')
sys.path.insert(0, 'speech_to_text')
sys.path.insert(0, 'speech_to_emotion')
sys.path.insert(0, 'databuilder')
from compareAudio import performThreeComparisons, sendScoreToBack

PORT = 3000        # Port to listen on (non-privileged ports are > 1023)
# python3 server.py

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)

@socketio.on('connect')
def test_connect():
    print('a user connected')

@socketio.on('disconnect')
def test_disconnect():
    print('a user disconnected')

@socketio.on('compareDialogue')
def handle_compareDialogue(message):
    print("on compareDialogue")
    print(message['gameID'])
    print(message['netflixWatchID'])
    print(message['dialogueID'])
    # print(message['audioBlob'])
    stream = message['audioBlob']

    tmpFileName = "tmptest.webm"

    # FIXME: just writing as raw and then running ffmpeg again inside `compareAudio.py`
    with open(tmpFileName, 'wb') as aud:
        aud.write(stream)

    resultBYTES, resultJSON = performThreeComparisons(message['netflixWatchID'], message['dialogueID'], tmpFileName, message['gameID'], profile=False)
    print("send to db", resultBYTES)
    # FIXME: don't wanna wait until back responds 
    response = sendScoreToBack(resultBYTES)
    print("response:", response)

    return resultJSON

# interface to send dialogue 2D array
@socketio.on('getDialogue')
def handle_getDialogue(message):
    print(message)

# get unique characters
@socketio.on('getUniqueCharacters')
def handle_getUniqueCharacters(message):
    print(message)

# calibrate vtt file with netflix subtitles
# NOT NEEDED atm (3/29/19) because manualling entering offset when adding to appending to contentDB
# @socketio.on('calibrate')
# def handle_calibrate(message):
#     print(message)

if __name__ == '__main__':
    print("Application Server is listening in port " + str(PORT))
    socketio.run(app, port=PORT)
        
