const EventEmitter = require('events');
const Store = require('../util/Store');
const User = require("../models/User"),
    Message = require("../models/Message"),
    TextChannel = require("../models/TextChannel"),
    Guild = require("../models/Guild");
const p = require('phin');

class Client extends EventEmitter {
    /**
     * Represents a discord user/bot
     * @todo Make it so that you can use it without using the command handler
     * @param {function} getPrefix This is used to get the prefix for the built in command handler. It passes the client and the message as arguments.
     * @param {string} token The token used for authentication.
     * @param {object} options Other options
     */
    constructor(token, getPrefix, options) {
        super();
        this.baseURL = "https://discordapp.com/api";
        /**
         * Base url for discord api.
         */

        this.p = p.defaults({
            parse: 'json'
        });

        this.guilds = new Store();
        /**
         * All the {@link User} s the bot is in.
         */

        this.users = new Store();
        /**
         * All the {@link User} s the bot can see.
         */

        this.channels = new Store();
        /**
         * All the {@link TextChannel}s the bot can see.
         */

        this.commands = new Store();
        /**
         * The {@link Command}s that are loaded.
         */

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
        /**
         * The websocket connection.
         */

        this.token = token;
        /**
         * The bot token used for authentication.
         * *BE VERY CAREFUL WITH THIS, DON'T SHARE IT*
         */

        this.readyAt = 0;
        /**
         * The time when the bot was ready.
         */

        this.user = null;
        /**
         * The {@link User} of the bot.
         */

        this.sessionId = null;
        /**
         * The session id.
         */
        if (typeof getPrefix === 'function'){
            this.getPrefix = getPrefix;
            /// Function that is used to get the prefix for commands.
        } else {
            options = getPrefix;
            options.useCommandHandler = false;
        }

        if (options && options.allowBots == true) {
            this.allowBots = true;
            console.warn("Now allowed to respond to other bots. This can end up in a message loop.");
        } else {
            this.allowBots = false;
        }

        if (options && options.selfReply == true) {
            this.selfReply = true;
            console.warn("Now allowed to respond to myself. This can end up in a message loop.");
        } else {
            this.selfReply = false;
        }

        if (options && options.useCommandHandler == true){
            this.useCommandHandler = true;
        } else {
            this.useCommandHandler = false;
        }

        if (options && options.connect == false) {
            return this;
        } else {
            return this.connect();
        }
    }

    /**
     * Connects to discord if not connected already.
     */
    connect() {
        const attemptLogin = require('../gateway/websocket');
        if (this.ws.connected) throw new Error(`Client is already connected to the gateway`);

        attemptLogin(this);
    }

    /**
     * Returns an user with the id.
     * @param {snowflake} id User id
     */
    async getUser(id) {
        try {
            const b = await this.p({
                url: `${this.baseURL}/users/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return new User(b.body, this);
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Loads a command to the built in command handler.
     * @param {Command} command Command
     */
    loadCommand(command) {
        this.commands.set(command.name, command);
    }

    /**
     * Loads many commands on once.
     * @param {Array<Command>} commands List of Commands
     */
    loadCommands(commands) {
        if (!commands instanceof Array) {
            throw new Error("The commands to load must be in a list.");
        }
        for (const command of commands) {
            this.loadCommand(command);
        }
    }

    /**
     * Unloads a command from the built in command handler.
     * @param {string} name Command name
     */
    unloadCommand(name) {
        this.commands.delete(name);
    }

    /**
     * Sends a message to a channel.
     * @param {snowflake} channelID A channel id.
     * @param {Object} payload Object to send.
     * @returns {Message} The message that was sent.
     */
    async sendMessage(channelID, payload) {
        const channel = this.channels.get(channelID);
        try {
            const b = await this.p({
                url: `${this.baseURL}/channels/${channelID}/messages`,
                method: "POST",
                headers: {
                    "Authorization": `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                },
                data: payload
            });
        } catch (err) {
            throw new Error(err);
        }
        
        console.log(b.body);
        return new Message(b.body, {
            guild: channel.guild,
            channel: channel
        }, this);
    }

    /**
     * Deletes a message from a channel.
     * @param {snowflake} channelID Channel id
     * @param {snowflake} messageID Message id
     */
    async deleteMessage(channelID, messageID) {
            const b = await p({
                url: `${this.baseURL}/channels/${channelID}/messages/${messageID}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                },
                data: payload,
                parse: "json"
            });

            return b.body;
    }

    /**
     * Edits a message on a text channel
     * @param {snowflake} channelID Channel id
     * @param {snowflake} messageID Message id
     * @param {Object} payload Object to edit to.
     * @returns {Message} The message that was edited.
     */
    async editMessage(channelID, messageID, payload) {
        const channel = this.channels.get(channelID);
        try {
            const b = await p({
                url: `${this.baseURL}/channels/${channelID}/messages/${messageID}`,
                method: "PATCH",
                headers: {
                    "Authorization": `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                },
                data: payload,
                parse:'json'
            });
            return new Message(b.body, {
                guild: channel.guild,
                channel: channel
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * This converts the channel to JSON and sends the current options to the api.
     * @param {Channel} channel The channel to edit.
     * @returns {Channel} The channel that was edited.
     */
    async editChannel(channel) {
            const b = await p({
                url: `${this.baseURL}/channels/${channel.id}`,
                method: "PATCH",
                headers: {
                    "Authorization": `Bot ${this.token}`,
                    "Content-Type": "application/json"
                },
                data: channel.toJSON(),
                parse:'json'
            });
            return channel;
    }

    /**
     * Runs the commands and does the checks.
     * @param {Content} ctx The context to invoke.
     */
    async processCommands(ctx) {
        if (ctx.author.id === this.user.id && !this.selfReply) return;
        const prefixes = this.getPrefix(this, ctx.message);
        let prefix = null;
        if (typeof (prefixes) == 'string') {
            if (ctx.message.content.startsWith(prefixes)) prefix = prefixes;
        } else if (prefixes instanceof Array) {
            for (let pre of prefixes) {
                if (ctx.message.content.startsWith(pre)) {
                    prefix = pre;
                    break;
                };
            }
        }
        if (prefix === null) return;
        if (ctx.author.bot && !this.allowBots) return;
        const command = this.commands.get(ctx.message.content.slice(prefix.length).split(" ")[0]);
        if (!command) return;
        if (command.checks) {
            for (const check of command.checks) {
                if (!check(ctx)) {
                    return this.emit("checkError", ctx);
                }
            }
        }
        if (command.nsfw && !ctx.channel.nsfw) {
            return this.emit("notNSFW", ctx);
        }
        ctx.command = command;
        console.log(ctx.message.content);
        ctx.argString = ctx.message.content.slice(prefix.length + command.name.length);
        ctx.args = ctx.argString.split(" ");
        ctx.args.shift();
        this.emit('command', ctx);
        try {
            console.log("Processing command for " + ctx.author.toString())
            command.run(this, ctx);
        } catch (err) {
            this.emit("commandError", err);
        }
    }
}

module.exports = Client;