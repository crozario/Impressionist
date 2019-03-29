#!/usr/bin/env python3

# HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
PORT = 3000        # Port to listen on (non-privileged ports are > 1023)
# python3 server.py

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

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
    print(message)
    print(message['gameID'])
    print(message['watchID'])
    print(message['dialogueID'])
    # print(message['audioBlob'])

    return "received compareDialogue Message"

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
