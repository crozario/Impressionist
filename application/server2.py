
"""
Application server (Flask)
$ python3 server.py
"""

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

PORT = 3000        # Port to listen on (non-privileged ports are > 1023)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

@app.route("/")
def home_screen():
    return "Welcome to the Impressionist Application Server!"

socketio = SocketIO(app)

@socketio.on('connect')
def test_connect():
    print('a user connected')


@socketio.on('disconnect')
def test_disconnect():
    print('a user disconnected')

@socketio.on('compareDialogue')
def handle_compareDialogue(message):
    print("Data received (on compareDialogue)")

    return "SOCKET IO MESSSAGE RECEIVED!!!"

@socketio.on('getDialogue')
def handle_getDialogue(message):
    print(message)

# get unique characters
@socketio.on('getUniqueCharacters')
def handle_getUniqueCharacters(message):
    print(message)

if __name__ == '__main__':
    print("Application Server is listening in port " + str(PORT))
    app.debug=False
    socketio.run(app, host='0.0.0.0', port=PORT)
