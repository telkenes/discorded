const Channel = require("./Channel");
const Store = require("../util/Store");

class DMChannel extends Channel{
    constructor(obj, client){
        super(obj, client);
        this.messages = new Store();
    }
}

module.exports = DMChannel;