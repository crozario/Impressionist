# import http.server
# import socketserver

# PORT = 3000
# Handler = http.server.SimpleHTTPRequestHandler

# with socketserver.TCPServer(("", PORT), Handler) as httpd:
#     print("Server at port", PORT)
#     httpd.serve_forever()

#!/usr/bin/env python3

# import socket

# HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
PORT = 3000        # Port to listen on (non-privileged ports are > 1023)

# with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#     s.bind((HOST, PORT))
#     print("Server at port", PORT)
#     s.listen(10)
#     conn, addr = s.accept()
#     with conn:
#         print('Connected by', addr)
#         while True:
#             data = conn.recv(1024)
#             if not data:
#                 print("client disconnected")
#                 break
#             print(data)
#             conn.sendall(data)


# FLASK_APP=server.py flask run -h localhost -p 3000

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



if __name__ == '__main__':
    socketio.run(app)