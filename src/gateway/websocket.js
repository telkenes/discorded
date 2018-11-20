// The base for the websocket connection and heartbeat managament is from nodecord.
const ws = require('ws');
const { getGatewayBot } = require('../util/Gateway');

module.exports = async (client) => {
    console.log("Connecting...");
    const gatewayUrl = await getGatewayBot(client.token);
    client.ws.gateway = {
        url: gatewayUrl,
        obtainedAt: Date.now()
    };

    const socket = new ws(`${gatewayUrl}/?v=7&encoding=json`);
    socket.id = Math.random();
    client.ws.socket = socket;

    socket.on('message', async(incoming) => {
        const d = JSON.parse(incoming) || incoming;
        // console.log(d);
        switch(d.op) {
            case 10: /* hello */
                console.log("hello");
                client.ws.gateway.heartbeat = {
                    interval: d.d.heartbeat_interval,
                    last: null,
                    recieved: true
                }; 

                require('./heartbeat')(client);

                await socket.send(JSON.stringify({
                    op: 2,
                    d: {
                        token: client.token,
                        properties: {
                            $os: process.platform,
                            $browser: 'discorded',
                            $device: 'discorded',
                        },
                        compress: false,
                        large_threshold: 250,
                        presence: {
                            status: 'online',
                            afk: false,
                        }
                    }
                }));
                if (client.ws.reconnect.state == true){
                    console.log("Resumed");
                    socket.send(JSON.stringify({
                        token: client.token,
                        session_id: client.ws.reconnect.sessionID,
                        seq: client.ws.reconnect.seq
                    }));
                    client.ws.reconnect = { state: false };
                    client.emit("resume");
                }
                break;

            case 11: /* heartbeak ack */
                console.log("hb ack");
                client.ws.gateway.heartbeat.last = Date.now();
                client.ws.gateway.heartbeat.recieved = true;
                break;
            case 0: /* event */
                let Events = require('../util/GatewayEvents');
                if (!Events.hasOwnProperty(d.t)) return;

                if (d.t == 'READY') {
                    client.readyAt = Date.now();
                }
                let e = require('./EventsHandler')[Events[d.t]];
                if (e) {
                    await e(client, d);
                }
                break;
        }
    });
}

