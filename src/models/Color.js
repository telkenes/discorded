class Color {
    constructor(color) {
        if (typeof color === 'string') {
            this.color = parseInt(/[0-9A-F]{6}/i.exec(color), 16);
        } else if (typeof color === 'number') {
            this.color = color;
        }
    }

    toHash(color) {
        if (typeof color === 'string') {
            return parseInt(/[0-9A-F]{6}/i.exec(color), 16);
        } else {
            throw new TypeError(
                'This can only convert hexadecimals that are in strings.'
            );
        }
    }

    toString() {
        return this.color;
    }

    get blurple() {
        return this.toHash('7289DA');
    }

    get red() {
        return this.toHash('ff0000');
    }

    get green() {
        return this.toHash('00ff00');
    }

    get blue() {
        return this.toHash('0000ff');
    }

    get black() {
        return this.toHash('000000');
    }

    get white() {
        return this.toHash('ffffff');
    }
}

module.exports = Color;
