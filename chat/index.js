var e = exports;

var _socket;



e.connection = function (socket) {
    _socket = socket;
    socket.on('set nickname', e.setNickname);
};

e.setNickname = function(name) {  

    _socket.set('nickname', name, function() {      
        _socket.emit('welcome', {
            author: 'BOT',
            name: name,
            msg: "Hello " + name
        });
    });
    
};



