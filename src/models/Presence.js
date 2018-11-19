const Role = require("./Role");
const Store = require("../util/Store");

module.exports = class Presence {
    constructor(obj, client) {
        this.user = client.users.get(obj.user.id);
        this.user.status = obj.status;
        this.activities = obj.activities;
        this.guild = client.guilds.get(obj.guild_id);
        if (this.guild){
            this.member = this.guild.members.get(this.user.id);
            this.member.roles = new Store();
            for (const role of obj.roles){
                this.member.roles.set(role.id, new Role(role, client));
            }
        }
    }
}