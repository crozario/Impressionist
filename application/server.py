#!/usr/bin/env python3

# HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
PORT = 3000        # Port to listen on (non-privileged ports are > 1023)
# python3 server.py

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)

@socketio.on('compareDialogue')
def handle_compareDialogue(message):
    print("on compareDialogue")
    print(message['gameID'])
    print(message['contentID'])
    print(message['dialogueID'])

    return "received compareDialogue Message"

@socketio.on('connect')
def test_connect():
    print('a user connected')

@socketio.on('disconnect')
def test_disconnect():
    print('a user disconnected')



if __name__ == '__main__':
    socketio.run(app, port=PORT)