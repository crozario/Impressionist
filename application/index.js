const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);


// app.get('/', function(request, response) {
//     return response.send("hello world");
// })

// client connected to server
io.on('connection', socket => {
    console.log('a user has connected');


    // client disconnected
    socket.on('disconnect', () => {
        console.log('a user has disconnected');
    });
    
    // test message
    socket.on('audio', msg => {
        console.log("got blog data");
    })

})


// server.listen(80);
server.listen(80, () => {
    console.log("listening on port 80");
})