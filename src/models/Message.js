const Object = require("./Object");
const MessageUtil = require('../util/Message/MessageUtil');
const User = require("./User"), Member = require("./Member");
const p = require("phin").promisified;

module.exports = class Message extends Object{
    constructor(obj, addons, client) {
        super(obj.id);
        this.content = obj.content;
        this.cleaned = MessageUtil.cleanMessage(obj.content);
        this.createdAt = new Date(obj.timestamp);
        if (obj.edited_timestamp != null) this.editedAt = new Date(obj.edited_timestamp);
        this.tts = obj.tts;
        this.pinned = obj.pinned;
        this.mentions = obj.mentions;
        this.attachments = obj.attachments;
        this.embeds = obj.embeds;
        this.reactions = obj.reactions;
        this.guild = addons.guild;
        if (obj.webhook_id) {
            this.author = obj.webhook_id;
        } else {
            if (this.member){
                this.author = new Member(obj.author, obj.member, client);
            } else {
                this.author = new User(obj.author, client);
            }
        }
        this.channel = addons.channel;
    }

    async delete(timeout) {
        if (timeout && typeof (timeout) == 'number') {
            try {
                const b = await p({
                    url: `https://discordapp.com/api/channels/${this.channel.id}/messages/${this.id}`,
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bot ${this.client.token}`,
                        'Content-Type': 'application/json'
                    },
                    data: payload
                });
        
                return JSON.parse(b.body);
            } catch(err) {
                throw new Error(err);
            }
        } else {

        }
    }

    async edit(str) {
        
    }
}