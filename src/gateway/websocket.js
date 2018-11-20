// The base for the websocket connection and heartbeat managament is from nodecord.
const ws = require('ws');
const { getGatewayBot } = require('../util/Gateway');

module.exports = async (client) => {
    const gatewayUrl = await getGatewayBot(client.token);
    client.ws.gateway = {
        url: gatewayUrl,
        obtainedAt: Date.now()
    };

    client.ws.socket = new ws(`${gatewayUrl}/?v=7&encoding=json`);

    client.ws.socket.on("close", (...args) => {
        throw new Error(args[1]);
    });

    client.ws.socket.on('message', async(incoming) => {
        if(d.s){
            client.ws.gateway.seq = d.s;
        }
        switch(d.op) {
            case 1: // Heartbeat
                socket.send(JSON.stringify({
                    op: 1,
                    d: 0
                }));
                break;

            case 9: // Invalid session
                if (d.d == false){
                    throw new Error("Could not reconnect with the session id.");
                }
                break;

            case 10: /* hello */
                client.ws.gateway.heartbeat = {
                    interval: d.d.heartbeat_interval,
                    last: null,
                    recieved: true
                }; 

                require('./heartbeat')(client);

                await client.ws.socket.send(JSON.stringify({
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
                break;

            case 11: /* heartbeak ack */
                client.ws.gateway.heartbeat.last = Date.now();
                client.ws.gateway.heartbeat.recieved = true;
                break;
            case 0: /* event */
                let Events = require('../util/GatewayEvents');
                if (!Events.hasOwnProperty(d.t)) return;

                if (d.t == 'READY') {
                    client.readyAt = Date.now();
                    if (client.ws.reconnect.state == true){
                        let obj = {
                            op:6,
                            d: {
                                token: client.token,
                                session_id: client.ws.reconnect.sessionID,
                                seq: client.ws.reconnect.seq
                            }
                        };
                        client.ws.socket.send(JSON.stringify(obj));
                        client.ws.reconnect = { state: false };
                    }
                }
                let e = require('./EventsHandler')[Events[d.t]];
                if (e) {
                    await e(client, d);
                }
                break;
        }
    });
}

