# Application 

## Dependencies

- [node v10.15.2](https://nodejs.org/en/download/)

- npm v6.4.1 (installs with node)

### Node Dependencies

- Express

- Socket.io

### Python Dependencies
- scipy
- numpy
- urllib2

### Other
- OpenSMILE

#### Setup

```bash
npm install
```

#### Run Server

```bash
node server.js 
```

# Individual File Descriptions
## **`appendContentDB.py`**
```
$ python3 appendContentDB.py <parentFolder>
```
NOTE: arg `parentFolder` is NOT individual file

Rules / notes
- using configFile -> `databuilder/configs/prosodyShs.conf`
- MOST IMPORTANT: using relative paths so this file has to be in the same folder as `server.js` and `compareAudio.py` (VERY DELICATE STUFF)
- When adding files to database, convention should be followed (inside `contentData/README.md`)

## **`compareAudio.py`**
- called by `server.js`
- TODO: add summary of how this works

## **`server.js`**
- 

### Socket.IO

https://stackoverflow.com/questions/38506952/how-to-send-response-back-to-client-using-socket-io

### Flask Socket.IO

#### Python Dependencies
- flask
- flask-socketio
- eventlet (to use websocket for flask-socketio)

**Run Flask Server**
```bash
python3 server.py
```