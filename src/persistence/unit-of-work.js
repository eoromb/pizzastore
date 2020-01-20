
/**
 * Unit of work allo to make several operation in one transaction
 */
class UnitOfWork {
    constructor (client) {
        if (client == null) {
            throw new Error('Client could not be null');
        }
        this.client = client;
        this.released = false;
    }
    async query (query, values) {
        if (this.released) {
            throw new Error('Unit of work released');
        }
        return await this.client.query(query, values);
    }
    async commit () {
        if (this.released) {
            throw new Error('Unit of work released');
        }
        try {
            return this.client.query('COMMIT');
        } finally {
            this.release();
        }
    }
    async rollback () {
        if (this.released) {
            throw new Error('Unit of work released');
        }
        try {
            return this.client.query('ROLLBACK');
        } finally {
            this.release();
        }
    }
    async release () {
        if (!this.released) {
            this.released = true;
            return this.client.release();
        }
    }
}
module.exports = UnitOfWork;
