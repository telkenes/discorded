const Object = require("./Object");

module.exports = class Attachment extends Object{
    constructor(obj){
        super(obj.id);
        this.filename = obj.filename;
        this.size = obj.size;
        this.url = obj.url;
        this.proxy = obj.proxy_url;
        if (this.height){
            this.height = obj.height;
            this.width = obj.width;
        }
    }
}