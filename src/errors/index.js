const keyCode = Symbol('code');
const messages = new Map();

/**
 * Make any error to DiscordedError
 * @param {Error} Base Base error to extend.
 * @returns {DiscordedError}
 */
function makeError(Base){
    return class DiscordedError extends Base{
        constructor(key, ...args){
            super(message(key, args));
            this[keyCode] = key;
            if(Error.captureStackTrace) Error.captureStackTrace(this, DiscordedError);
        }

        get name(){
            return `${super.name} [${this[keyCode]}]`;
        }

        get code(){

        }
    }
}

/**
 * Format the message for an error.
 * @param {string} key Error key
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 */
function message(key, args){
    if(typeof key !== 'string') throw new Error("Error message must be a string.");
    const msg = messages.get(key);
    if (!msg) throw new Error(`An invalid error message key was used: ${key}`);
    if (typeof msg === "function") return msg(...args);
    if (args === undefined || args.length === 0) return msg;
    args.unshift(msg);
    return String(...args);
}

/**
 * Register an error code and message.
 * @param {string} sym Unique name for the error
 * @param {*} val Value of the error
 */
function register(sym, val) {
    message.set(sym, typeof val === "function" ? val : String(val));
}

module.exports = {
    register,
    Error: makeError(Error),
    TypeError: makeError(TypeError),
    RangeError: makeError(RangeError), 
};