module.exports = class Activity {
    constructor(obj){
        this.name = obj.name;
        switch (obj.type) {
            case 0:
                this.type = "Playing";
                break;
            case 1:
                this.type = "Streaming";
                break;
            case 2:
                this.type = "Listening";
        }
        if (obj.url) this.url = obj.url;
        if (obj.timestamps){
            this.timestamps = {};
            if (obj.timestamps.start) this.timestamps.start = obj.timestamps.start;
            if (obj.timestamps.end) this.timestamps.end = obj.timestamps.end;
        }
        if (obj.application_id) this.application_id = obj.application_id;
        if (obj.details) this.details = obj.details;
        if (obj.state) this.state = obj.state;
        if (obj.party) this.party = obj.party;
        if (obj.assets) this.assets = obj.assets;
        if (obj.secrets) this.secrets = obj.secrets;
        if (obj.instance) this.instance = obj.instance;
        if (obj.flags) this.flags = obj.flags;
    }
    toString(){
        return `${this.type} ${this.name}`;
    }
}