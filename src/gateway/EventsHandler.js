const Message = require('../models/Message');
const Store = require('../util/Store');
const User = require("../models/User"),
    Guild = require("../models/Guild"),
    Member = require("../models/Member"),
    Channel = require("../models/TextChannel"),
    TextChannel = require("../models/TextChannel"),
    VoiceChannel = require("../models/VoiceChannel"),
    Presence = require("../models/Presence"),
    CategoryChannel = require("../models/CategoryChannel");
const Context = require("../models/Context");

module.exports = {
    'ready': async(client, d) => {
        client.user = new User(d.d.user, client);
        client.sessionID = d.d.session_id;

        for (const [obj] in d.d.guilds) {
            client.guilds.set(d.d.guilds[obj].id, {
                available: false
            });
        }

        client.emit('ready');
    },

    'resumed': async(client, d) => {
        client.emit("resume", d.d);
    },

    'invalidSession': async(client, d) => {
        console.log(d);
    },

    'guildCreate': async(client, d) => {
        let obj = d.d;

        let channels = new Store();
        for (let channel of d.d.channels) {
            switch (channel.type) {
                case 0:
                    channel = new TextChannel(channel, client);
                    break;
                case 2:
                    channel = new VoiceChannel(channel, client);
                    break;
                case 4:
                    channel = new CategoryChannel(channel, client);
                default:
                    channel = new Channel(channel, client);
            }
            channel = new Channel(channel, client);
            channels.set(channel.id, channel);
            client.channels.set(channel.id, channel);
        }

        let members = new Store();
        obj.channels = channels;
        for (let member of obj.members) {
            let user = new User(member.user, client);
            client.users.set(member.user.id, user);
        }
        const guild = new Guild(obj, client);
        for (let member of obj.members) {
            member = new Member(member.user, member, guild, client);
            members.set(member.id, member);
        }
        guild.members = members;
        guild.owner = guild.members.get(obj.owner_id);

        if (client.guilds.has(d.d.id) && client.guilds.get(d.d.id).available == false) {
            client.guilds.set(d.d.id, guild);
            client.emit('guildAvailable', guild);
        } else {
            client.guilds.set(d.d.id, guild);
            client.emit('guildCreate', guild);
        }
    },

    'channelCreate': async(client, d) => {
        let channel = d.d;
        switch (channel.type) {
            case 0:
                channel = new TextChannel(channel, client);
                
                break;
            case 2:
                channel = new VoiceChannel(channel, client);
                break;
            case 4:
                channel = new CategoryChannel(channel, client);
            default:
                channel = new Channel(channel, client);
        }
    },

    'message': async(client, d) => {
        const channel = client.channels.get(d.d.channel_id);
        let msg = channel.messages.get(d.d.id);
        if (msg) return;
        msg = new Message(d.d, {
            guild: client.guilds.get(d.d.guild_id),
            channel: channel
        }, client);
        channel.messages.set(msg.id, msg);
        client.emit('message', msg);
        let ctx = new Context(msg, client);
        if (client.useCommandHandler){
            client.processCommands(ctx);
        }
    },

    'messageEdit': async(client, d) => {
        const channel = client.channels.get(d.d.channel_id);
        const guild = client.guilds.get(d.d.guild_id);
        let oldMsg = channel.messages.get(d.d.id);
        if (!oldMsg) {
            oldMsg = new Message(d.d, {
                guild: guild,
                channel: channel
            }, client);
        }
        let newMsg = new Message(oldMsg, {
            guild: oldMsg.guild,
            channel: oldMsg.channel
        }, client);
        newMsg.content = d.d.content;
        newMsg.embed = d.d.embed;
        newMsg.mentions = [];
        if (d.d.mentions) {
            for (let mention of d.d.mentions) {
                newMsg.mentions.push(guild.members.get(mention.id));
            }
        }
        channel.messages.set(d.d.id, newMsg);
        client.emit("messageEdit", oldMsg, newMsg);
    },

    'presenceUpdate': async(client, d) => {
        const presence = new Presence(d.d, client);
        client.emit("presenceUpdate", presence);
    }
}