module.exports = class Store extends Map {
    constructor(...args) {
        super(args);
    }

    /**
     * Returns all matching keys.
     * @param {Function} callback The check to check with.
     */
    map(callback) {
        let output = [];
        
        this.forEach((key, value) => {
            output.push(callback(key, value));
        });

        return output;
    }

    /**
     * Returns the first matching key.
     * @param {Function} predicate The check to check with.
     */
    find(predicate){
        this.forEach((key) => {
            if (predicate(key)){
                return key;
            }
        });
    }

    /**
     * @returns {Number} The length of the store.
     */
    get length(){
        return this.size;
    }
}