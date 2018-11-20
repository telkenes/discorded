const Object = require("./Object");

class UnavailableGuild extends Object {
    constructor(obj, client){
        super(obj.id, client);
        this.unavailable = obj.unavailable;
    }
}