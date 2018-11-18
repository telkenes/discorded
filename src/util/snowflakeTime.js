const idToBinary = require("./toBinary");
const DISCORD_EPOCH = 1420070400000;

module.exports = (snowflake) => {
    const BINARY = idToBinary(snowflake).toString(2).padStart(64, '0');
    const res = {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + DISCORD_EPOCH
    };
    Object.defineProperty(res, 'date', {
      get: function get() { return new Date(this.timestamp); },
      enumerable: true,
    });
    return res;
}