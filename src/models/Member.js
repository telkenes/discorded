const Store = require("../util/Store");
const User = require("./User"),
    Ban = require("./Ban");

module.exports = class Member extends User {
    constructor(user, member, guild, client) {
        super(user, client);
        this.guild = guild;
        if (member.nick) this.nick = member.nick;
        this.roles = new Store();
        for (let role of member.roles){
            role = this.guild.roles.get(role);
            console.log(role.name);
            this.roles.set(role.id, role);
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

    async ban(reason, deleteMessageDays){
        if (!reason){
            reason = '';
        }
        if (typeof reason !== 'string'){
            reason = `${reason}`;
        }
        const b = await this.client.p({
            url: `${this.client.baseURL}/guilds/${this.guild.id}/bans/${this.id}`,
            method: "PUT",
            headers: {
                'Authorization': `Bot ${this.client.token}`,
                'Content-Type': 'application/json'
            },
            data: {
                reason: reason,
                delete_message_days: deleteMessageDays
            }
        });
        return new Ban(b.body);
    }

    async kick(reason){
        if (!reason){
            reason = '';
        }
        if (typeof reason !== 'string'){
            reason = `${reason}`;
        }
        const b = await this.client.p({
            url: `${this.client.baseURL}/guilds/${this.guild.id}/members/${this.id}`,
            method: "DELETE",
            headers: {
                'Authorization': `Bot ${this.client.token}`,
                'Content-Type': 'application/json'
            },
            data: {
                reason: reason
            }
        });
        if (b.code === 204){
            return true;
        }
    }
}