const Channel = require("./Channel");

/**
 * Represents a guild voice channel.
 * @extends {Channel}
 */
class VoiceChannel extends Channel{
    constructor(obj, client){
        super(obj, client);
    }

    toJSON() {
        return JSON.stringify({
            name: this.name,
            position: this.position,
            bitrate: this.bitrate,
            user_limit: this.userLimit,
            permission_overwrites: this.permissionOverwrites.toJSON(),
            parent_id: this.parent.id
        });
    }

    async edit() {
        return this.client.editChannel(this);
    }
}

module.exports = VoiceChannel;