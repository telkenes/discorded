const EventEmitter = require('events');
const Store = require('../util/Store');
const User = require("../models/User");
const p = require('phin').promisified;

const BASEURL = "https://discordapp.com/api";

module.exports = class Client extends EventEmitter {
    constructor(token, ...options) {
        super();

        this.guilds = new Store();
        this.users = new Store();
        this.channels = new Store();
        this.commands = new Store();
        
        this.ws = {
            socket: null,
            connected: false,
            gateway: {
                url: null,
                obtainedAt: null,
                heartbeat: {
                    interval: null,
                    last: null,
                    recieved: false,
                    seq: null,
                }
            }
        };
        this.token = token;
        this.readyAt = 0;
        this.user = null;
        this.sessionId = null;
        
        if (options && options.prefix){
            this.prefix = prefix;
        } else {
            this.prefix = null;
        }
        if (options && options.connect == false) {
            return this;
        } else {
            return this.connect();
        }
    }

    static get MessageEmbed() {
        return require('../util/Message/MessageEmbed');
    }

    static get VERSION() { return '1.0.1'; }

    connect() {
        const attemptLogin = require('../gateway/websocket');
        if (this.ws.connected) throw new Error(`Client is already connected to the gateway`);

        attemptLogin(this);
    }

    async getUser(id) {
        try {
            const b = await p({
                url: `${BASEURL}/users/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });    
            return new User(JSON.parse(b.body), client);
        } catch(err) {
            throw new Error(err);
        }
    }

    loadCommand(name, command) {
        this.commands.set(name, command);
    }

    unloadCommand(name) {
        this.commands.delete(name);
    }
    
    async sendMessage(channelID, payload){
        try {
            const b = await p({
                url:`${BASEURL}/channels/${channelID}/messages`,
                method: "POST",
                headers: {
                    "Authorization": `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                },
                data: payload
            });
            return b.body;
        } catch (err) {
            throw new Error(err);
        }
    }
}