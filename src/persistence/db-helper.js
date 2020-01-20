const path = require('path');
const fs = require('fs');
class DbHelper {
    constructor ({unitOfWorkFactory, configService}) {
        this.unitOfWorkFactory = unitOfWorkFactory;
        this.configService = configService;
    }
    async reset () {
        const databaseSchema = this.configService.getDatabaseSchema();
        if (databaseSchema == null || databaseSchema === '') {
            return;
        }
        let uow = null;
        try {
            const schemaFile = path.join(__dirname, '../..', databaseSchema);
            const sql = fs.readFileSync(schemaFile).toString();
            uow = await this.unitOfWorkFactory.createUnitOfWork();
            const query = `DROP SCHEMA IF EXISTS "PizzaStore" CASCADE; ${sql}`;
            await uow.query(query);
            await uow.commit();
        } catch (error) {
            if (uow != null) {
                await uow.rollback();
            }
            throw error;
        } finally {
            if (uow != null) {
                await uow.release();
            }
        }
    }
}
module.exports = DbHelper;
