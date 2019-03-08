from flask import Flask, request

app = Flask(__name__)
@app.route('/', methods = ['POST', 'GET', 'PUT'])
def api_message():
    # Open file and write binary (blob) data
    f = open('./file', 'wb')
    f.write(request.data)
    f.close()
    return "Binary message written!"
