class VerificationLevel {
    constructor(level) {
        this.level = level;
        switch (level) {
            case 0:
                this.levelName = 'None';
                this.description = 'unrestricted';
                break;
            case 1:
                this.levelName = 'Low';
                this.description = 'must have verified email on account';
                break;
            case 2:
                this.levelName = 'Medium';
                this.description =
                    'must be registered on Discord for longer than 5 minutes';
                break;
            case 3:
                this.levelName = 'High';
                this.description =
                    '(╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes';
                break;
            case 4:
                this.levelName = 'Very high';
                this.description =
                    '┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number';
                break;
        }
    }
    toString() {
        return `${this.levelName}, ${this.description}`;
    }
}

module.exports = VerificationLevel;
