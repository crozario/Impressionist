const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', function(request, response) {
    return response.send("hello world");
})


io.on('connection', function(data){
    console.log('connection');
     
})


server.listen(3000);