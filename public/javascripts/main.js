(function(window, undefined) {

    var socket = io.connect('http://localhost');

    var chat = {  

        choosename: function () {             
            socket.emit('set nickname', document.querySelector('input').value); 
        },

        events: { 
            welcome: function (data) {                          
                var p     = document.createElement('p'),
                    li    = document.createElement('li');
                    input = document.querySelector('input');

                if (input) {
                    input.parentElement.removeChild(input.nextSibling);
                    input.parentElement.removeChild(input);
                }

                li.textContent = data.name;
                document.querySelector('.sidebar-nav ul').appendChild(li);


                p.textContent = data.author + ' > ' + data.msg;                
                document.getElementById('chat-room').appendChild(p);  
            
            }
        },
    
        init: function () {
            socket.on('welcome', this.events.welcome);            
            document
                .querySelector('button')
                .addEventListener('click', this.choosename, false);
        }

    };


    chat.init();

})(this);
