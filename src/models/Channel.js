const Object = require("./Object");
const TextChannel = require("./TextChannel");
const Guild = require("./Guild");
const p = require("phin").promisified;

/**
 * A channel, this can be a {@link TextChannel}, dm, voice, group or a category channel.
 * @extends Object
 */
class Channel extends Object {
    constructor(obj, client) {
        super(obj.id, client);
        this.type = obj.type;
        /**
         * The type of the channel:
         * * {@link TextChannel}
         * * Direct
         * * Voice
         * * Group
         * * Category
         */

        if (obj.guild_id) this.guild = client.guilds.get(obj.guild_id);
        /// The Guild that this channel is in.

        if (obj.position) this.position = obj.position;
        /// The position of this channel.

        if (obj.permission_overwrites) this.permissionOverwrites = obj.permission_overwrites;
        /**
         * Permission overwrites for the channel.
         */

        if (obj.name) this.name = obj.name;
        /**
         * The name of the channel.
         */

        if (obj.topic) this.topic = obj.topic;
        /**
         * 
         */
        if (obj.nsfw && obj.nsfw === true) {
            this.nsfw = obj.nsfw;
        } else {
            this.nsfw = false;
        }
        if (obj.last_message_id) this.lastMessage = obj.last_message_id;
        if (obj.bitrate) this.bitrate = obj.bitrate;
        if (obj.user_limit) this.userLimit = obj.user_limit;
        if (obj.rate_limit_per_user) this.rateLimitPerUser = obj.rate_limit_per_user;
        if (obj.recipients) {
            this.recipients = [];
            for (user of obj.recipients) {
                this.recipients.push(client.users.get(user))
            }
        }
        if (obj.icon) this.icon = obj.icon;
        if (obj.owner_id) this.recipient = client.users.get(obj.owner_id);
        if (obj.application_id) this.recipient = client.users.get(obj.application_id);
        if (obj.parent_id) this.parent = client.channels.get(obj.parent_id);
        if (obj.last_pin_timestamp) this.lastPinTimestamp = obj.last_pin_timestamp;

        switch (this.type) {
            case 0:
                this.type = 'text';
                break;
            case 1:
                this.type = 'dm';
                break;
            case 2:
                this.type = 'voice';
                break;
            case 3:
                this.type = 'group';
                break;
            case 4:
                this.type = 'category';
                break;
        }
    }
}

module.exports = Channel;