// Inspiration for this module was gotten from discord.py 😅 Don't ask how.

module.exports = {
    version: '0.0.3dev',
    Client: require('./client/Client'),

    // Classes
    Activity: require('./models/Activity'),
    Attachment: require('./models/Attachment'),
    CategoryChannel: require('./models/CategoryChannel'),
    Channel: require('./models/Channel'),
    Color: require('./models/Color'),
    Command: require('./models/Command'),
    DMChannel: require('./models/DMChannel'),
    Context: require('./models/Context'),
    Embed: require('./util/Message/Embed'),
    Emoji: require('./models/Emoji'),
    Guild: require('./models/Guild'),
    Member: require('./models/Member'),
    Message: require('./models/Message'),
    Object: require('./models/Object'),
    PermissionOverwrite: require('./models/PermissionOverwrite'),
    Presence: require('./models/Presence'),
    Role: require('./models/Role'),
    TextChannel: require('./models/TextChannel'),
    User: require('./models/User'),
    VoiceChannel: require('./models/VoiceChannel')
};
