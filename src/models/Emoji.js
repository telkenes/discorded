const Object = require("./Object");

/**
 * Represents a guild emoji.
 */
class Emoji extends Object {
    constructor(obj, guild, client){
        super(obj.id, client)
        this.guild = guild;
        /// The guild this emoji belongs to.
        this.name = obj.name;
        /// The name of the emoji.
        this.roles = [];
        /// The roles that can use this emoji.
        if (obj.roles){
            for (let role of obj.roles){
                this.roles.push(this.guild.roles.get(role));
            }
        }
        if (obj.user) this.user = this.client.users.get(obj.user);
        /// The user that created this emoji.
        if (obj.require_colons) this.requireColon = obj.require_colons;
        /// Whether the emoji must be wrapped in colons.
        if (obj.managed) this.managed = obj.managed;
        if (obj.animated) this.animated = obj.animated;
    }

    get url(){
        if (this.animated){
            return `https://cdn.discordapp.com/emojis/${this.is}.png`;
        } else {
            return `https://cdn.discordapp.com/emojis/${this.is}.gif`;
        }
    } 
}

module.exports = Emoji;