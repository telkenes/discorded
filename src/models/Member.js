const Store = require('../util/Store');
const User = require('./User'),
    Ban = require('./Ban');
const Errors = require('../errors');

module.exports = class Member extends User {
    constructor(user, member, guild, client) {
        super(user, client);
        this.guild = guild;
        if (member.nick) this.nick = member.nick;
        this.roles = new Store();
        for (let role of member.roles) {
            role = this.guild.roles.get(role);
            this.roles.set(role.id, role);
        }
        this.joinedAt = member.joined_at;
        this.deaf = member.deaf;
        this.mute = member.mute;
        this.user = member.user;
    }
    toString() {
        if (this.nick) {
            return `${this.username}#${this.discriminator} AKA (${this.nick})`;
        } else {
            return `${this.username}#${this.discriminator}`;
        }
    }

    get name() {
        if (this.nick) {
            return this.nick;
        } else {
            return this.username;
        }
    }

    async ban(reason, deleteMessageDays) {
        if (!reason) {
            reason = '';
        }
        if (typeof reason !== 'string') {
            reason = `${reason}`;
        }
        const b = await this.client.p({
            url: `${this.client.baseURL}/guilds/${this.guild.id}/bans/${
                this.id
            }`,
            method: 'PUT',
            headers: {
                Authorization: `Bot ${this.client.token}`,
                'Content-Type': 'application/json'
            },
            data: {
                reason: reason,
                'delete-message-days': deleteMessageDays
            }
        });
        if (b.body.code) {
            throw new Error(b.body.message);
        } else {
            return new Ban(b.body);
        }
    }

    async kick(reason) {
        if (!reason) {
            reason = '';
        }
        if (typeof reason !== 'string') {
            reason = `${reason}`;
        }
        const b = await this.client.p({
            url: `${this.client.baseURL}/guilds/${this.guild.id}/members/${
                this.id
            }`,
            method: 'DELETE',
            headers: {
                Authorization: `Bot ${this.client.token}`,
                'Content-Type': 'application/json',
                'X-Audit-Log-Reason': reason
            }
        });
        if (b.body.code) {
            throw new Error(b.body.message);
        } else {
            return true;
        }
    }

    /**
     * Edits a guild member.
     * @param {object} obj Parameters to edit, nick, roles (snowflakes), mute, deaf, channel_id (voice channel to move to).
     */
    async edit(obj) {
        let member = {
            nick: this.nick,
            roles: this.roles.map(role => role.id),
            mute: this.mute,
            deaf: this.deaf,
            channel_id: null
        };

        for (const [key, value] of Object.entries(obj)) {
            member[key] = value;
        }

        const b = await this.client.p({
            url: `${this.client.baseURL}/guilds/${this.guild.id}/members/${
                this.id
            }`,
            method: 'PATCH',
            headers: {
                Authorization: `Bot ${this.client.token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(member)
        });
        if (b.body.code) {
            throw new Error(b.body.message);
        } else {
            return true;
        }
    }

    get topRole() {
        let topRole;
        let roles = this.roles.map(role => role);
        for (let role of roles) {
            if (!topRole) {
                topRole = role;
            }
            if (role.position > topRole && role.hoist) {
                topRole = role.position;
            }
        }
        return topRole;
    }
};
