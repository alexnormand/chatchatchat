(function(window, undefined) {
    var socket = io.connect('http://localhost');

    var chat = {  

        choosename: function () {             
            socket.emit('set nickname', document.querySelector('input').value); 
        },

        sendMessage: function () {           
            var msg = document.getElementById('input-message').value
                              .replace(/&/g, '&amp;')
                              .replace(/</g, '&lt;')
                              .replace(/"/g, '&quot;')
                              .trim();

            socket.emit('message', msg);
        },

        events: { 
            welcome: function (data) {                                          

                var frag       = document.createDocumentFragment(),
                    clientList = document.querySelector('.sidebar-nav ul'),
                    chatRoom   = document.getElementById('chat-room'),
                    input      = document.querySelector('input'),                  
                    chatWindow = document.getElementById('chat-window'),
                    inputMsg   = document.getElementById('input-message'),
                    sendMsg    = document.getElementById('send-message'), 
                    t;
                        
                // Update Client List
                Array.prototype.slice.call(clientList.children, 1).forEach(function(c) {
                    clientList.removeChild(c);
                });
                
                data.clients.forEach(function(c) {
                    var li = document.createElement('li');
                    li.textContent = c;                 
                    frag.appendChild(li);
                });
                clientList.appendChild(frag);

              
                // Add welcome message and notify users of newcomers.
                t = document.createTextNode(data.msg + '\n');
                chatWindow.appendChild(t);
                
                // If The user has just entered the chat room for the first time
                if(input) {
                    [chatWindow, inputMsg, sendMsg].forEach(function (node) {
                        node.style.display = 'block';
                    });
                    
                    // Remove Choose Name input DOM Nodes 
                    input.parentElement.removeChild(input.nextSibling);
                    input.parentElement.removeChild(input);                
                }
            },

            message: function (data) {
                var t = document.createTextNode(data.author + ' > ' + data.msg + '\n');
                document.getElementById('chat-window').appendChild(t);
                window.scrollTo(0, document.body.scrollHeight);
            }
            
        },
    
        init: function () {
            socket.on('welcome', this.events.welcome);            
            socket.on('message', this.events.message);

            // Choose Name Event handler
            document.querySelector('button')
                    .addEventListener('click', this.choosename, false);

            document.getElementById('send-message')
                    .addEventListener('click', this.sendMessage, false);
        }

    };

    chat.init();

})(this);
