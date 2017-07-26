const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dot.html');
})

io.on('connection', (socket) => {
    socket.on('chat', (msg)=> {
        io.emit('chat',msg);
    })
    socket.on('disconnect', ()=> {
        console.log('user disconnect');
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000');
})