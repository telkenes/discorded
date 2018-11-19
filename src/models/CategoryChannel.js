const Channel = require("./Channel");

/**
 * Represents a categorychannel of a guild.
 */
class CategoryChannel extends Channel {
    constructor(obj, client){
        super(obj, client);
    }

    toJSON() {
        return JSON.stringify({
            name: this.name,
            position: this.position,
            permission_overwrites: this.permissionOverwrites.toJSON(),
        });
    }

    async edit() {
        this.client.editChannel(this);
    }
}

module.exports = CategoryChannel;