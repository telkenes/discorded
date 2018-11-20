const Activity = require("./Activity");
const Store = require("../util/Store");

module.exports = class Presence {
    /**
     * Represents a presence update.
     * @param {object} obj The JSON object received from the api.
     * @param {client} client The client.
     */
    constructor(obj, client) {
        this.user = client.users.get(obj.user.id);
        this.user.status = obj.status;
        this.activities = [];
        if (obj.activities) {
            for (let activity of obj.activities){
                this.activities.push(new Activity(activity));
            }
        }
        this.guild = client.guilds.get(obj.guild_id);
        if (this.guild && this.guild.members){
            this.member = this.guild.members.get(this.user.id);
            this.member.nick = obj.nick;
            if (obj.roles){
                this.member.roles = new Store();
                for (const role of obj.roles){
                    this.member.roles.set(role, this.guild.roles.get(role));
                }
            }
        }
        if (obj.game){
            this.user.game = new Activity(obj.game);
        }
    }
}