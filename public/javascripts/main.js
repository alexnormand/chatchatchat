(function(window, undefined) {
    var socket = io.connect('http://localhost');

    var chat = {  
                
        chatRoom   : document.getElementById('chat-room'),
        input      : document.querySelector('input'),                  
        chatWindow : document.getElementById('chat-window'),
        inputMsg   : document.getElementById('input-message'),
        sendMsg    : document.getElementById('send-message'), 
                  

        choosename: function () {             
            socket.emit('set nickname', this.input.value.trim()); 
        },

        sendMessage: function () {           
            var msg = this.inputMsg.value.trim();

            if (msg) {                                
                this.inputMsg.value = '';
                socket.emit('message', msg);
            }
        },

        events: { 
            welcome: function (data) {                                          

                var frag       = document.createDocumentFragment(),
                    clientList = document.querySelector('.sidebar-nav ul'),                    
                    that       = this,
                    t;
                        
                // Update Client List
                Array.prototype.slice.call(clientList.children, 1).forEach(function (c) {
                    clientList.removeChild(c);
                });
                
                data.clients.forEach(function (c) {
                    var li = document.createElement('li');
                    li.textContent = c;                 
                    frag.appendChild(li);
                });
                clientList.appendChild(frag);

                // If the client has just entered the chatroom.
                if (data.newcomer) {
 
                    // Add welcome message and notify users of newcomers.
                    t = document.createTextNode(data.msg) + '\n');
                    this.chatWindow.appendChild(t);
                    
                    // If The user has just entered the chat room for the first time
                    if(this.input) {
                        [this.chatWindow, this.inputMsg, this.sendMsg].forEach(function (node) {
                            node.style.display = 'block';
                        });
                        
                        // Remove Choose Name input DOM Nodes 
                        this.input.parentNode.removeChild(this.input.nextSibling);
                        this.input.parentNode.removeChild(this.input);                
                    }
                }
            },

            message: function (data) {
                var t = document.createTextNode(data.author) + ' > ' + data.msg + '\n');
                this.chatWindow.appendChild(t);
                window.scrollTo(0, document.body.scrollHeight);
            }
            
        },
    
        init: function () {

            var that = this;

            //socket.io event handlers
            socket.on('welcome', function (data) {
                that.events.welcome.call(that, data);
            });            
            socket.on('message', function (data) {
                that.events.message.call(that, data);
            });

            
            // Choose Name Event handler
            document.querySelector('button')
                    .addEventListener('click', function () {
                        that.choosename.call(that);
                    }, false);

            this.input.addEventListener('keypress', function (e) {                        
                if (e.keyCode === 13) {
                    that.choosename.call(that);
                } 
            }, false);
            

            // Send message Event Handler
            this.sendMsg.addEventListener('click', function () {
                that.sendMessage.call(that);
            }, false);


            this.inputMsg.addEventListener('keypress', function (e) {
                if (e.keyCode === 13 && !e.shiftKey) {  
                    e.preventDefault();
                    that.sendMessage.call(that);
                }
            }, false);                    
        }
    };

    chat.init();

})(this);

