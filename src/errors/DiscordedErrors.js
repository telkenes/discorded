class MissingPermissions{
    /**
     * Thrown when the client does not have permissions to do something.
     * @param {string} message Message to display when thrown.
     */
    constructor(message){
        this.name = 'MissingPermissions';
        this.message = message;
    }
}
MissingPermissions.prototype = new Error();

module.exports = {
    'MissingPermissions': MissingPermissions
}