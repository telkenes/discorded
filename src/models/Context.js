const p = require("phin").promisified;

module.exports = class Context{
    constructor (message, client) {
        this.message = message;
        this.client = client;
        this.author = message.author;
        this.channel = message.channel;
        this.guild = message.guild;
    }
    async send(content, extra){
        const payload = {
            content: null,
            tts: false,
            embed: null
        };

        let options = {};

        if (typeof (content) == 'object') {
            options.embed = content;
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

        return await this.client.sendMessage(this.channel.id, payload);
    }
}