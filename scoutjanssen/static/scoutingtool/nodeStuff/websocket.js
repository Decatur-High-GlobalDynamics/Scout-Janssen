var WebSocket = require('ws');

var wss = new WebSocket.Server({ port: 8081 });

var formulas = [];

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(message);
        formulas.push(JSON.parse(message));
        sendFormulasToAll();
    });

    sendFormulasToAll();
});

function sendFormulasToAll(){
    wss.clients.forEach(function(client){
        client.send(JSON.stringify(formulas));
    });
}