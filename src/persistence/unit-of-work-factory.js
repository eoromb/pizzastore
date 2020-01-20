const {Pool} = require('pg');
const UnitOfWork = require('./unit-of-work');

/**
 * Factory for unit of work. Contains database access details
 */
class UnitOfWorkFactory {
    constructor (configSerivce) {
        const {pootSize: max, ...dbConfig} = configSerivce.getDatabaseConfig();
        this.pool = new Pool({...dbConfig, max});
    }
    /**
     * Creates unit of work
     * @param {boolean} repeatableRead if repeatable read transaction isolation level should be used
     */
    async createUnitOfWork ({repeatableRead = false} = {}) {
        let client = null;
        try {
            client = await this.pool.connect();
            const uow = new UnitOfWork(client);
            uow.query(repeatableRead ? 'BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ' : 'BEGIN');
            return uow;
        } catch (error) {
            if (client != null) {
                await client.release();
            }
            throw error;
        }
    }
}
module.exports = UnitOfWorkFactory;
