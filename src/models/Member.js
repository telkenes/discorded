const User = require("./User");

module.exports = class Member extends User {
    constructor(user, member, client) {
        super(user, client);
        for (const [key, value] of Object.entries(member)) {
            this[key] = value;
        }
        this.user = new User(this.user, client);
    }
    get name(){
        if (this.nick){
            return this.nick;
        } else {
            return this.username;
        }
    }
}