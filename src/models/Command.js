module.exports = class Command {
    constructor(name, func, options){
        this.name = name;
        this.run = func;
        if (options){
            if (options.help){
                this.help = options.help;
            } else {
                this.help = "";
            }
            
            if (options.args){
                this.args = optionss.args;
            } else {
                this.args = "";
            }

            if (options.nsfw){
                this.nsfw = options.nsfw;
            } else {
                this.nsfw = false;
            }

            if (options.ownerOnly){
                this.ownerOnly = options.ownerOnly;
            } else {
                this.ownerOnly = false;
            }
            
            if (options.checks){
                if (!options.checks instanceof Array) throw new TypeError("Checks must be a list of checks.");
                this.checks = options.checks;
            } else {
                this.checks = [];
            }
        }
    }
}