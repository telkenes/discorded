const Object = require("./Object");
const MessageUtil = require('../util/Message/MessageUtil');
const User = require("./User"),
    Member = require("./Member");
const p = require("phin").promisified;

module.exports = class Message extends Object {
    constructor(obj, addons, client) {
        super(obj.id, client);
        this.guild = addons.guild;
        this.channel = addons.channel;
        this.content = obj.content;
        this.cleaned = MessageUtil.cleanMessage(obj.content);
        this.createdAt = new Date(obj.timestamp);
        if (obj.edited_timestamp != null) this.editedAt = new Date(obj.edited_timestamp);
        this.tts = obj.tts;
        this.pinned = obj.pinned;
        this.mentions = [];
        if (obj.mentions) {
            for (let mention of obj.mentions) {
                this.mentions.push(this.guild.members.get(mention.id));
            }
        }
        this.channelMentions = [];
        if (this.content) {
            const channelMatches = this.content.match(/<#\d*>/g);
            if (channelMatches) {
                for (let match of channelMatches) {
                    match = match.replace("<#", "");
                    match = match.replace(">", "");
                    this.channelMentions.push(this.guild.channels.get(match));
                }
            }
        }
        this.attachments = obj.attachments;
        this.embeds = obj.embeds;
        this.reactions = obj.reactions;
        if (obj.webhook_id) {
            this.author = obj.webhook_id;
        } else {
            if (this.member) {
                this.author = new Member(obj.author, obj.member, this.guild, client);
            } else {
                this.author = new User(obj.author, client);
            }
        }
    }

    async delete(timeout) {
        timeout = parseInt(timeout);
        if (timeout && typeof (timeout) == 'number') {
            setTimeout(() => {
                this.client.deleteMessage(this.channel.id, this.id);
            }, timeout)
        } else {
            this.client.deleteMessage(this.channel.id, this.id);
        }
    }

    async edit(content, extra) {
        const payload = {
            content: null,
            embed: null
        };

        let options = {};

        if (typeof (content) == 'object') {
            options.embed = content;
        } else {
            payload.content = `${content}`;
            options.embed = extra || null;
        }

        if (options) {
            if (options.embed && typeof (options.embed) == 'object') payload.embed = options.embed || null;
        }

        if (payload.content && payload.content.split('').length > 2000) throw new TypeError(`Message content cannot be over 2000 characters`);
        this.client.editMessage(this.channel.id, this.id, payload);
    }
}