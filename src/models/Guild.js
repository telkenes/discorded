const Store = require('../util/Store');
const _Object = require('./Object'),
    Role = require('./Role'),
    Emoji = require('./Emoji');
const Activity = require('./Activity'),
    VerificationLevel = require('./VerificationLevel'),
    Presence = require('./Presence');

module.exports = class Guild extends _Object {
    constructor(obj, client, bans) {
        super(obj.id, client);
        this.name = obj.name;
        this.icon = obj.icon;
        this.splash = obj.splash;
        this.bans = new Store();
        if (bans) {
            for (const ban in bans) {
                this.bans.set(ban.user.id, ban);
            }
        }
        this.roles = new Store();
        for (let role of obj.roles) {
            role = new Role(role, client);
            this.roles.set(role.id, role);
        }
        this.channels = obj.channels;
        this.regios = obj.region;
        if (obj.afk_channel_id)
            this.afkChannel = this.channels.get(obj.afk_channel_id);
        this.afkTimeout = obj.afk_timeout;
        if (obj.embed_enabled) this.embed = obj.embed_enabled;
        if (obj.embed_channel_id)
            this.embedChannel = this.channels.get(obj.embed_channel_id);
        this.verificationLevel = new VerificationLevel(obj.verification_level);
        switch (obj.default_message_notifications) {
            case 0:
                this.defaultMessageNotifications = 'ALL MESSAGES';
                break;
            case 1:
                this.defaultMessageNotifications = 'ONLY MENTIONS';
                break;
        }
        switch (obj.explicit_content_filter) {
            case 0:
                this.explicitFilter = 'DISABLED';
                break;
            case 1:
                this.explicitFilter = 'MEMBERS WITHOUT ROLES';
                break;
            case 2:
                this.explicitFilter = 'ALL MEMBERS';
                break;
        }
        this.emojis = new Store();
        for (const emoji of obj.emojis) {
            this.emojis.set(emoji.id, new Emoji(emoji, this, client));
        }
        this.features = obj.features;
        switch (obj.mfa_level) {
            case 0:
                this.mfaLevel = 'NONE';
                break;
            case 1:
                this.mfaLevel = 'ELEVATED';
                break;
        }
        if (obj.widget_enabled) this.widget = obj.widget_enabled;
        if (obj.widget_channel_id) this.widgetChannelID = obj.widget_channel_id;
        this.SystemChannelID = obj.system_channel_id;
        if (obj.large) {
            this.large = obj.large;
        } else {
            this.large = false;
        }
        this.unavailable = obj.unavailable;
        for (let presence of obj.presences) {
            presence = new Presence(presence, client);
            const user = client.users.get(presence.user.id);
            if (presence.game) {
                user.game = new Activity(presence.game);
            }
            user.activities = [];
            for (const activity of presence.activities) {
                user.activities.push(new Activity(activity));
            }
            user.status = presence.status;
        }
    }

    toString() {
        return `${this.name}`;
    }

    toJSON() {
        return JSON.stringify({
            name: this.name,
            region: this.region,
            verification_level: this.verificationLevel.level,
            afk_channel_id: this.afkChannel.id,
            afk_timeout: this.afkTimeout,
            system_channel_id: this.SystemChannelID
        });
    }

    /**
     * This applies any changes to the guild, it is recommended to change attributes with in the guild rather than passing parameters to this function.
     * @param {object} obj Parameters to change, name, region, verification_level, afk_channel_id, afk_timeout, system_channel_id
     */
    async edit(obj) {
        let guild = {
            name: this.name,
            region: this.region,
            verification_level: this.verificationLevel.level,
            afk_timeout: this.afkTimeout,
            system_channel_id: this.SystemChannelID
        };

        if (obj) {
            for (const [key, value] of Object.entries(obj)) {
                guild[key] = value;
            }
        }

        const b = await this.client.p({
            url: `${this.client.baseURL}/guilds/${this.id}`,
            method: 'PATCH',
            headers: {
                Authorization: `Bot ${this.client.token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(guild)
        });
        if (b.statusCode === 204) {
            return true;
        }
        throw new Error(`${b.body.code} ${b.body.message}`);
    }
};
