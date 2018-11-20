const p = require('phin').promisified;

function reconnect(client, loop){
    console.log(`Last heartbeat hasn't been acknowledged, trying to reconnect in 10 seconds.`);
    setTimeout(() => {
        clearInterval(loop);
        client.ws.socket.close();
        client.ws.connected = false;
        client.ws.reconnect.state = true;
        client.ws.reconnect.sessionID = client.sessionID;
        client.ws.reconnect.seq = client.ws.gateway.seq;
        require("./websocket")(client);
    }, 10000);
}

module.exports = async (client) => {
    const randomNum = Math.random();
    const heartbeatLoop = setInterval(() => {
        console.log("Heartbeat loop " + randomNum);
        if (!client.ws.gateway.heartbeat.recieved){
            reconnect(client, heartbeatLoop);
        } else {
            console.log(client.ws.socket.id);
            client.ws.socket.send(JSON.stringify({
                op: 1,
                d: 0
            }));
    
            client.ws.gateway.heartbeat.recieved = false;
            setTimeout(() => {
                if (!client.ws.gateway.heartbeat.recieved){
                    reconnect(client, heartbeatLoop);
                }
            }, 5000);
        }
    }, client.ws.gateway.heartbeat.interval || 10000);
}