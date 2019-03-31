#!/usr/bin/env python3

# HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
import sys
sys.path.insert(0, 'application/')
sys.path.insert(0, 'application/signalComparison')
sys.path.insert(0, 'application/speech_to_text')
sys.path.insert(0, 'application/speech_to_emotion')
sys.path.insert(0, 'application/databuilder')
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

    resultBYTES = performThreeComparisons(message['netflixWatchID'], message['dialogueID'], tmpFileName, message['gameID'], profile=False)
    print("send to db", resultBYTES)
    # FIXME: don't wanna wait until back responds 
    response = sendScoreToBack(resultBYTES)
    print("response:", response)

    return response

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
