const v1 = require('./v1');
const test = require('./test');
const errorHandler = require('../middlewares/error-handler');
module.exports = ({app, controllers, common: {logService, errorMapper}}) => {
    app.use('/api/v1', v1(controllers), errorHandler({logService, errorMapper}));
    app.use(test(controllers), errorHandler({logService, errorMapper}));
    return app;
};
