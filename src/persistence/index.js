const UnitOfWorkFactory = require('./unit-of-work-factory');
module.exports = ({common}) => {
    return {
        unitOfWorkFactory: new UnitOfWorkFactory(common.configService)
    };
};
