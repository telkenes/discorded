const Store = require("../util/Store");
const Object = require("./Object"),
    Role = require("./Role"),
    Emoji = require("./Emoji");
const Activity = require("./Activity"),
    Presence = require("./Presence");

module.exports = class Guild extends Object {
    constructor(obj, client) {
        super(obj.id, client);
        this.name = obj.name;
        this.icon = obj.icon;
        this.splash = obj.splash;
        this.roles = new Store();
        for (let role of obj.roles) {
            role = new Role(role, client);
            this.roles.set(role.id, role);
        }
        console.log(this.roles.map(role => role.mention));
        this.channels = obj.channels;
        this.regios = obj.region;
        if (obj.afk_channel_id) this.afkChannel = this.channels.get(obj.afk_channel_id);
        this.afkTimeout = obj.afk_timeout;
        if (obj.embed_enabled) this.embed = obj.embed_enabled;
        if (obj.embed_channel_id) this.embedChannel = this.channels.get(obj.embed_channel_id);
        switch (obj.verification_level) {
            case 0:
                this.verificationLevel = null;
                break;
            case 1:
                this.verificationLevel = 'LOW';
                break;
            case 2:
                this.verificationLevel = "MEDIUM";
                break;
            case 3:
                this.verificationLevel = "HIGH";
                break;
            case 4:
                this.verificationLevel = "VERY HIGH";
                break;
        }
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
}