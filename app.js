/**
 * Module dependencies.
 */

var express = require('express'),
    app     = express.createServer(),
    io      = require('socket.io').listen(app),
    chat    = require(__dirname + '/chat'),
    routes  = require(__dirname + '/routes');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



//sockets

io.sockets.on('connection', chat.connection); 

