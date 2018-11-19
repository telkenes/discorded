class Ban{
    constructor(obj){
        for (const [key, value] of Object.entries(obj)){
            this[key] = value;
        }
    }
}

module.exports = Ban;