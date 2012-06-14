var e = {},
    io;

// Socket.io config settings
e.configure = function () {
    io.configure('production', function() {
        io.enable('browser client minification');  
        io.enable('browser client etag');          
        io.enable('browser client gzip');          
        io.set('log level', 1);                    
        io.set('transports', [                     
            'websocket'
            , 'flashsocket'
            , 'htmlfile'
            , 'xhr-polling'
            , 'jsonp-polling'
        ]);
    });
}



e.listen = function (app) {
    io = require('socket.io').listen(app);
    io.on('connection', e.connection);
    e.configure();
};

e.connection = function (socket) {   
    socket.on('set nickname', function (name) {
        e.setNickname(socket, name);
    });
    socket.on('message', function (msg) {
        e.sendMessage(socket, msg);
    });
};

// Get the names of clients in chat room
e.getClients = function (fn) {
    
    var clients = [];       
    io.sockets.clients().forEach(function(s) {
        io.sockets.socket(s.id).get('nickname', function(err, name) {
            clients.push(name);
        });
    });  

    if (typeof fn === 'function') {
        fn(clients);
    } else {
        return;
    }
};

e.setNickname = function (socket, name) {  
    socket.set('nickname', name, function() {     
        e.getClients(function (clients) {
            io.sockets.emit('welcome', {
                clients: clients,
                msg: name + ' joined the chat room'
            }); 
            
        });                                       
    }); 
};


e.sendMessage = function (socket, msg) {
    socket.get('nickname', function(err, name) {
        io.sockets.emit('message', {
            author: name,
            msg: msg
        });
    });
};


module.exports = { listen: e.listen };
