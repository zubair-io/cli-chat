global.WebSocket = require('websocket').w3cwebsocket
const readline = require('readline');
const Horizon = require('@horizon/client')
const horizon = Horizon();
const messages = horizon("messages");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var log = console.log;
console.log = function() {
        rl.pause();
    rl.output.write('\x1b[2K\r');
    log.apply(console, Array.prototype.slice.call(arguments));
    rl.resume();
    rl._refreshLine();
}

rl.question('What is you name? \n', (name) => {

    if (name) {
        messages.limit(50).order("datetime").watch().subscribe((docs) => { 
            console.log('\033[2J');
            docs.forEach((m)=>{
                console.log( m.name +':', m.message)
            })
         })

        sendMessage(name)
    }
});
function sendMessage(name) {
    rl.question('>', (message) => {

        if (message) {
            let m = {
                message: message,
                datetime: new Date(),
                name: name
            }
            messages.store(m);
            sendMessage(name)
        }
    });
}
