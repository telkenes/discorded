const snowflakeTime = require("../util/snowflakeTime");

module.exports = class Object {
    constructor(id, client){
        this.id = id;
        this.date = snowflakeTime(id).date;
        this.timestamp = snowflakeTime(id).timestamp;
        if (client) this.client = client;
    }
}