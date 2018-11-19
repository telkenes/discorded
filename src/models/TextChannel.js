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

        this.client.sendMessage(this.channel.id, payload);
    }
}