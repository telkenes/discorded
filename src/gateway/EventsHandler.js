const Store = require('../util/Store');
const User = require("../models/User"), Guild = require("../models/Guild"), Member = require("../models/Member"), Channel = require("../models/TextChannel");
const Context = require("../models/Context");

module.exports = {
    'ready': (client, d) => {
        client.user = new User(d.d.user, client);
        client.sessionId = d.d.session_id;

        for (const [obj] in d.d.guilds) {
            client.guilds.set(d.d.guilds[obj].id, { available:false });
        }

        client.emit('ready');
    },

    'guildCreate': (client, d) => {
        let obj = d.d;

        let channels = new Store();
        for (let channel of d.d.channels) {
            channel = new Channel(channel, client);
            channels.set(channel.id, channel);
            client.channels.set(channel.id, channel);
        }

        let members = new Store();
        for (let member of d.d.members) {
            member = new Member(member.user, member, client);
            members.set(member.id, member);
            let user = new User(member.user, client);
            client.users.set(member.user.id, user);
        }

        if (client.guilds.has(d.d.id) && client.guilds.get(d.d.id).available == false) {
            obj.channels = channels;
            obj.members = members;
            obj.ready = true;

            const guild = new Guild(obj);
            
            client.guilds.set(d.d.id, guild);
            client.emit('guildAvailable', guild);
        } else {
            client.guilds.set(d.d.id, obj);
            client.emit('guildCreate', obj);
        }
    },

    'message': (client, d) => {
        let Message = require('../models/Message');

        let msg = new Message(d.d, {
            guild: client.guilds.get(d.d.guild_id),
            channel: client.channels.get(d.d.channel_id)
        }, client);
        let ctx = new Context(msg, client);

        client.emit('message', ctx);
    }
}