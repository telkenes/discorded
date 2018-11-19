const Store = require("../util/Store");
const Channel = require('./Channel');
const Embed = require("../util/Message/Embed");

/**
 * Represents a guild text channel.
 * @extends Channel
 */
module.exports = class TextChannel extends Channel {
    constructor(obj, client) {
        super(obj, client);
        this.messages = new Store();
    }

    /**
     * 
     * @param {string|Embed} content The message or embed to send.
     * @param {object} extra Other options.
     */
    async send(content, extra) {
        const payload = {
            content: null,
            tts: false,
            embed: null
        };

        let options = {};

        if (typeof (content) == 'object') {
            options = content;
        } else {
            payload.content = `${content}`;
            options = extra || null;
        }

        if (options) {
            if (options.tts && typeof (options.tts) == 'boolean') payload.tts = options.tts || false;
            if (options.embed && typeof (options.embed) == 'object') payload.embed = options.embed || null;
        }

        if (payload.content && payload.content == '') throw new TypeError(`Message content cannot be empty`);
        if (payload.content && payload.content.split('').length > 2000) throw new TypeError(`Message content cannot be over 2000 characters`);

        this.client.sendMessage(this.id, payload);
    }

    /**
     * Returns the channel as json object and ready to send to the channel edit api.
     */
    toJSON() {
        let overwrites = [];
        if (this.permissionOverwrites){
            for (const overwrite of this.permissionOverwrites){
                overwrites.push(overwrite.toJSON());
            }
        }
        let obj = JSON.stringify({
            name: this.name,
            position: this.position,
            topic: this.topic,
            nsfw: this.nsfw,
            rate_limit_per_user: this.rateLimitPerUser,
            permission_overwrites: overwrites,
        });
        if (this.parent) obj.parent_id = this.parent.id;
        return obj;
    }

    /**
     * Edits the channel, you need to first change the properties with for example channel.name
     * Because if you don't, nothing changes.
     */
    async edit() {
        this.client.editChannel(this);
    }
}