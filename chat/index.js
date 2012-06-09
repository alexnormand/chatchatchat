var e = exports,
    _socket,
    io;

e.listen = function (app) {
    io = require('socket.io').listen(app);
    io.sockets.on('connection', e.connection);
};

e.connection = function (socket) {
    _socket = socket;
    socket.on('set nickname', e.setNickname);
};

e.setNickname = function (name) {  

    _socket.set('nickname', name, function() {      
        io.sockets.emit('welcome', {
            author: 'BOT',
            name: name,
            msg: name + ' joined the chat room'
        });
    });
    
};



