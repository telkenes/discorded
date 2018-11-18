module.exports = class Role {
    constructor (obj, client){
        for (const [key, value] of Object.entries(obj)){
            this[key] = value;
        }
    }
}