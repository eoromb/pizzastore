const UnitOfWorkFactory = require('./unit-of-work-factory');
const DbHelper = require('./db-helper');
module.exports = ({common}) => {
    const result = {
        unitOfWorkFactory: new UnitOfWorkFactory(common.configService)
    };
    if (process.env.NODE_ENV === 'test') {
        result.dbHelper = new DbHelper({unitOfWorkFactory: result.unitOfWorkFactory, configService: common.configService});
    }
    return result;
};
