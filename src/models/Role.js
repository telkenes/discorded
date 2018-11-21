const Object = require('./Object'),
    Permissions = require('../util/Permissions'),
    Color = require('./Color');

/**
 * Represents a {@link Guild} Role
 * @extends {Object}
 */
class Role extends Object {
    constructor(obj, client) {
        super(obj.id, client);
        this.name = obj.name;
        this.color = new Color(obj.color);
        this.hoist = obj.hoist;
        this.position = obj.position;
        this.permissions = new Permissions(obj.permissions);
        this.managed = obj.managed;
        this.mentionable = obj.mentionable;
    }

    /**
     * Returns the role mention, this can be used at messages or embeds.
     */
    get mention() {
        return `<@&${this.id}>`;
    }
}

module.exports = Role;
