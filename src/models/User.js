const Object = require("./Object");
const p = require('phin').promisified;

module.exports = class User extends Object {
    constructor(obj, client){
        super(obj.id, client);
        this.id = obj.id;
        if (obj.username) this.username = obj.username;
        if (obj.discriminator) this.discriminator = obj.discriminator;
        if (obj.avatar) this.avatar = obj.avatar;
        if (obj.bot) {
            this.bot = obj.bot;
        } else {
            this.bot = false;
        }
        if (obj.mfa_enabled) this.mfaEnabled = obj.mfa_enabled;
        if (obj.locale) this.locale = obj.locale;
        if (obj.verified) this.verified = obj.verified;
        if (obj.email) this.email = obj.email;
    }

    toString(){
        return `${this.username}#${this.discriminator}`
    }

    /**
     * Returns the username and the discriminator
     */
    get tag(){
        return `${this.username}#${this.discriminator}`
    }

    /**
     * Returns the mention of the user. This can be used in messages or embeds.
     */
    get mention(){
        return `<@${this.id}>`;
    }

    /**
     * The avatar url of the user.
     */
    get avatarURL() {
        if (this.avatar.startsWith("a_")) {
            return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.gif`;
        }
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
    }

    /**
     * The username of the user.
     */
    get name(){
        return this.username;
    }

    /**
     * Returns the avatar url with custom format and size.
     * @param {string} format Image format for the avatar
     * @param {number} size Size of the image, defaults to 1024
     */
    avatarURLAs(format, size){
        if (!format){
            throw new Error("You need to give a format for the avatar url.");
        }
        if (!size){
            size = "1024";
        }
        size = String(size);
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${format}?size=${size}`;
    }

    /**
     * Sends a direct message to the user.
     * @param {string|Embed} content The message to send.
     * @param {object} extra Extra options.
     */
    async send(content, extra) {
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
        return this.client.sendMessage(this.id, payload);
    }
}
