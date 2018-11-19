class Command {
    /**
     * A command for the built in command handler.
     * @param {string} name The command name that it will be invoked with.
     * @param {function} func The function that will be called, the arguments that will be passed are client and ctx {@link Context}
     * @param {object} options Other options like help, args, nsfw, ownerOnly, and checks. Checks must be a list and they must take one argument, ctx. Checks will be called when the command is executed.
     */
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
module.exports = Command;