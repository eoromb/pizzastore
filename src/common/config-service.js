class ConfigService {
    constructor () {
        const env = process.env.NODE_ENV || 'development';
        this.config = require(__dirname + '/../../config.json')[env];
    }
    getDatabaseConfig () {
        return this.config.database;
    }
    getServerConfig () {
        return this.config.server || {};
    }
    getServerPort () {
        const config = this.getServerConfig();
        return process.env.PORT || config.port || 3000;
    }
    getDatabaseSchema () {
        return this.config.testSchema;
    }
}
module.exports = ConfigService;
