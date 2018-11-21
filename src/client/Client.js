const EventEmitter = require('events');
const Store = require('../util/Store');
const User = require('../models/User'),
    Message = require('../models/Message'),
    DMChannel = require('../models/DMChannel'),
    Command = require('../models/Command'),
    Context = require('../models/Context'),
    Guild = require('../models/Guild');
const p = require('phin');

class Client extends EventEmitter {
    /**
     * Represents a discord user/bot
     * @todo Make it so that you can use it without using the command handler
     * @param {function|string|Array} getPrefix This is used to get the prefix for the built in command handler. It passes the client and the message as arguments.
     * @param {string} token The token used for authentication.
     * @param {object} options Other options
     */
    constructor(token, getPrefix, options) {
        super();

        /**
         * Base url for discord api.
         */
        this.baseURL = 'https://discordapp.com/api';

        /**
         * This is for phin defaults.
         */
        this.p = p.defaults({
            parse: 'json'
        });

        /**
         * All the {@link Guild} s the bot is in.
         */
        this.guilds = new Store();

        /**
         * All the {@link User} s the bot can see.
         */
        this.users = new Store();

        /**
         * All the channels the bot can see.
         */
        this.channels = new Store();

        /**
         * The {@link Command}s that are loaded.
         */
        this.commands = new Store();

        this.commands.set(
            'help',
            new Command('help', (client, ctx) => {
                let commands = [];
                this.commands.forEach(
                    command => {
                        if (command.help) {
                            commands.push(
                                `${command.name}\n   ${command.help}`
                            );
                        } else {
                            commands.push(`${command.name} - No help.`);
                        }
                    },
                    {
                        help: 'Shows this message.'
                    }
                );
                let format = commands.join('\n');
                ctx.send('```\n' + format + '\n```');
            })
        );

        /**
         * The websocket that is used to connect to the gateway.
         */
        this.ws = {
            socket: null,
            connected: false,
            reconnect: {
                state: false
            },
            gateway: {
                url: null,
                obtainedAt: null,
                heartbeat: {
                    interval: null,
                    last: null,
                    recieved: false,
                    seq: null
                }
            }
        };

        /**
         * The bot token used for authentication.
         * *BE VERY CAREFUL WITH THIS, DON'T SHARE IT*
         */
        this.token = token;

        /**
         * The time when the bot was ready.
         */
        this.readyAt = 0;

        /**
         * The {@link User} of the bot.
         */
        this.user = null;

        /**
         * The session id.
         */
        this.sessionID = null;

        /**
         * The owner of the bot.
         */
        this.owner = null;

        if (!options) options = {};
        if (
            typeof getPrefix === 'function' ||
            typeof getPrefix === 'string' ||
            getPrefix instanceof Array
        ) {
            /**
             * Function that is used to get the prefix for commands.
             */
            this.getPrefix = getPrefix;
            options.useCommandHandler = true;
        } else {
            if (typeof getPrefix === 'object') {
                options = getPrefix;
            }
            options.useCommandHandler = false;
        }

        if (options && options.allowBots == true) {
            /**
             * This allows the bots to invoke the built in command handler.
             */
            this.allowBots = true;
            console.warn(
                'Now allowed to respond to other bots. This can end up in a message loop.'
            );
        } else {
            this.allowBots = false;
        }

        if (options && options.selfReply == true) {
            /**
             * This means that the bot can reply to itself.
             */
            this.selfReply = true;
            console.warn(
                'Now allowed to respond to myself. This can end up in a message loop.'
            );
        } else {
            this.selfReply = false;
        }

        if (options && options.useCommandHandler == true) {
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
        this.p({
            url: `${this.baseURL}/oauth2/applications/@me`,
            method: 'GET',
            headers: {
                Authorization: `Bot ${this.token}`,
                'Content-Type': 'application/json'
            }
        }).then(b => {
            this.owner = new User(b.body.owner, this);
        });
        const attemptLogin = require('../gateway/websocket');
        if (this.ws.connected)
            throw new Error(`Client is already connected to the gateway`);

        attemptLogin(this);
    }

    /**
     * Returns a context from the message;
     * @param {Message} mesage
     */
    getContext(message) {
        return new Context(message, this);
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
                    Authorization: `Bot ${this.token}`,
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
            throw new Error('The commands to load must be in a list.');
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
     * @param {Context} ctx This is optional.
     * @returns {Message} The message that was sent.
     */
    async sendMessage(channelID, payload, ctx) {
        let channel = this.channels.get(channelID);
        if (!channel) {
            const b = await this.p({
                url: `${this.baseURL}/users/@me/channels`,
                method: 'POST',
                headers: {
                    Authorization: `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    recipient_id: channelID
                })
            });
            channel = new DMChannel(b.body, this);
            this.channels.set(channel.id, channel);
        }
        const b = await this.p({
            url: `${this.baseURL}/channels/${channel.id}/messages`,
            method: 'POST',
            headers: {
                Authorization: `Bot ${this.token}`,
                'Content-Type': 'application/json'
            },
            data: payload
        });
        if (b.body.code) {
            if (ctx) {
                this.emit('commandError', ctx, b.body.message);
            }
        } else {
            if (channel.guild) {
                return new Message(
                    b.body,
                    {
                        guild: channel.guild,
                        channel: channel
                    },
                    this
                );
            } else {
                return new Message(
                    b.body,
                    {
                        channel: channel
                    },
                    this
                );
            }
        }
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
                Authorization: `Bot ${this.token}`,
                'Content-Type': 'application/json'
            }
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
        const b = await p({
            url: `${this.baseURL}/channels/${channelID}/messages/${messageID}`,
            method: 'PATCH',
            headers: {
                Authorization: `Bot ${this.token}`,
                'Content-Type': 'application/json'
            },
            data: payload,
            parse: 'json'
        });
        return new Message(b.body, {
            guild: channel.guild,
            channel: channel
        });
    }

    /**
     * This converts the channel to JSON and sends the current options to the api.
     * @param {Channel} channel The channel to edit.
     * @returns {Channel} The channel that was edited.
     */
    async editChannel(channel) {
        const b = await p({
            url: `${this.baseURL}/channels/${channel.id}`,
            method: 'PATCH',
            headers: {
                Authorization: `Bot ${this.token}`,
                'Content-Type': 'application/json'
            },
            data: channel.toJSON(),
            parse: 'json'
        });
        return channel;
    }

    /**
     * Runs the commands and does the checks.
     * @param {Content} ctx The context to invoke.
     */
    async processCommands(ctx) {
        if (ctx.author.id === this.user.id && !this.selfReply) return;
        let prefixes;
        if (typeof this.getPrefix == 'function') {
            prefixes = this.getPrefix(this, ctx.message);
        } else {
            prefixes = this.getPrefix;
        }
        let prefix = null;
        if (typeof prefixes == 'string') {
            if (ctx.message.content.startsWith(prefixes)) prefix = prefixes;
        } else if (prefixes instanceof Array) {
            for (let pre of prefixes) {
                if (ctx.message.content.startsWith(pre)) {
                    prefix = pre;
                    break;
                }
            }
        }
        if (prefix === null) return;
        if (ctx.author.bot && !this.allowBots) return;
        const command = this.commands.get(
            ctx.message.content.slice(prefix.length).split(' ')[0]
        );
        if (!command) return;
        if (command.ownerOnly && ctx.author.id !== this.owner.id) {
            return this.emit('notOwner', ctx);
        }
        if (command.checks) {
            for (const check of command.checks) {
                if (!check(ctx)) {
                    return this.emit('checkError', ctx);
                }
            }
        }
        if (command.nsfw && !ctx.channel.nsfw) {
            return this.emit('notNSFW', ctx);
        }
        ctx.command = command;
        if (ctx.message.content) {
            ctx.argString = ctx.message.content.slice(
                prefix.length + command.name.length + 1
            );
            ctx.args = ctx.argString.split(' ');
        } else {
            ctx.argString = '';
            ctx.args = [];
        }
        this.emit('command', ctx);
        try {
            console.log('Processing command for ' + ctx.author.toString());
            command.run(this, ctx);
        } catch (err) {
            this.emit('commandError', err);
        }
    }
}

module.exports = Client;
