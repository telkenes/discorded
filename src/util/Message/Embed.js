const colors = {
    'BLUE': '#0000ff',
    'RED': '#ff0000',
    'YELLOW': '#ffff00',
    'GREEN': '#00ff00',
}

/**
 * Represents a Rich Embed.
 */
class Embed {
    constructor() { this.fields = []; }

    /**
     * Sets the title for the embed.
     * @param {string} str Title
     */
    title(str) {
        if (!str || str == '') throw new TypeError(`Message embed titles cannot be empty`);
        if (str.split('').length > 256) throw new TypeError(`Message embed titles cannot be over 256 characters`);

        this.title = `${str}`;
        return this;
    }

    /**
     * Sets the description for the embed.
     * @param {string} str Description
     */
    description(str) {
        if (!str || str == '') throw new TypeError(`Message embed descriptions cannot be empty`);
        if (str.split('').length > 2048) throw new TypeError(`Message embed descriptions cannot be over 2048 characters`);

        this.description = `${str}`;
        return this;
    }

    /**
     * Sets the color of the embed.
     * @param {hex} color Hex value for the color.
     */
    color(color) {
        if (!color || color.length == 0) throw new TypeError(`Message embed colors must be a hex code, integer, or predefined code`);

        if (!colors.hasOwnProperty(color)) {
            this.color = parseInt(/[0-9A-F]{6}/i.exec(color)[0], 16);
        } else {
            this.color = this.color = parseInt(/[0-9A-F]{6}/i.exec(colors[color])[0], 16);
        }

        return this;
    }

    /**
     * Sets the timestamp for the embed.
     * @param {Date} date Date
     */
    timestamp(date) {
        if (!date) {
            this.timestamp = new Date();
        } else {
            this.timestamp = date;
        }

        return this;
    }

    /**
     * Adds a field to the embed.
     * @param {string} name Name
     * @param {string} value Value
     * @param {boolean} inl Inline
     */
    field(name, value, inl) {
        if (!name || name == '') throw new TypeError(`Message embed field names cannot be empty`);
        if (!value || value == '') throw new TypeError(`Message embed field values cannot be empty`);
        let inline = false;
        if (inl && typeof (inl) == 'boolean') inline = inl;

        this.fields.push({
            name: `${name}`,
            value: `${value}`,
            inline: inline
        });

        return this;
    }

    /**
     * Sets the author of the embed.
     * @param {string} str Author
     * @param {url} url URL
     */
    author(str, url) {
        if (!str || str == '') throw new TypeError(`Message embed author name cannot be empty`);
        if (str.split('').length > 256) throw new TypeError(`Message embed author name cannot be over 256 characters`);

        let icon = null;
        if (url && typeof (url) == 'string') icon = url;

        this.author = {
            name: `${str}`,
            icon_url: icon
        }

        return this;
    }

    /**
     * Sets the footer of the embed.
     * @param {string} str Text
     * @param {url} url URL
     */
    footer(str, url) {
        if (!str || str == '') throw new TypeError(`Message embed footer text cannot be empty`);
        if (str.split('').length > 2048) throw new TypeError(`Message embed footer text cannot be over 2048 characters`);

        let icon = null;
        if (url && typeof (url) == 'string') icon = url;

        this.footer = {
            text: `${str}`,
            icon_url: icon
        }

        return this;
    }

    /**
     * Sets the image of the embed.
     * @param {url} url URL
     */
    image(url) {
        if (!url || url == '') throw new TypeError(`Message embed image URL is required`);

        this.image = { url: url };
        return this;
    }

    /**
     * Sets the thumbnail of the embed.
     * @param {url} url URL
     */
    thumbnail(url) {
        if (!url || url == '') throw new TypeError(`Message embed thumbnail URL is required`);

        this.thumbnail = { url: url };
        return this;
    }

    /**
     * Returns the embed in json format and ready to send to the api.
     */
    toJSON() {
        let Embed = new Object();

        for (const [key, value] of Object.entries(this)) {
            Embed[key] = value;
        }

        return Embed;
    }
}

module.exports = Embed;