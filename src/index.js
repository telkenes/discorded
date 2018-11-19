// This module is a mix of nodecord and discord.js.
// Inspiration for this module was gotten from discord.py 😅 Don't ask how.

module.exports = {
    client : require('./client/Client'),
    Embed : require("./util/Message/Embed"),
    Command : require("./models/Command"),
    version : '0.0.1dev'
};