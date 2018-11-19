const Store = require("../util/Store");
const User = require("./User");

module.exports = class Member extends User {
    constructor(user, member, guild, client) {
        super(user, client);
        this.guild = guild;
        if (member.nick) this.nick = member.nick;
        this.roles = new Store();
        for (const role of member.roles){
            this.roles.set(role.id, this.guild.roles.get(role));
        }
        this.joinedAt = member.joined_at;
        this.deaf = member.deaf;
        this.mute = member.mute;
        this.user = member.user;
    }
    toString(){
        if (this.nick){
            return `${this.username}#${this.discriminator} AKA (${this.nick})`;
        } else {
            return `${this.username}#${this.discriminator}`;
        }
    }
    get name(){
        if (this.nick){
            return this.nick;
        } else {
            return this.username;
        }
    }
}