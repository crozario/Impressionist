from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/messages', methods = ['GET', 'POST'])
def api_message():
      # Open file and write binary (blob) data
      f = open('./file', 'wb')
      f.write(request.data)
      f.close()
      return "Binary message written!"
