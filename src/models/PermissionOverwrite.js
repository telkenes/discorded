const Object = require("./Object");

module.exports = class PermissionOverwrite extends Object{
    constructor(obj) {
        super(obj.id);
        this.type = obj.type;
        this.allow = obj.allow;
        this.deny = obj.deny;
    }

    /**
     * Prepares the object for the api.
     */
    toJSON(){
        return JSON.stringify({
            id: this.id,
            type: this.type,
            allow: this.allow,
            deny: this.deny
        });
    }
}