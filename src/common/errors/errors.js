const codes = {
    orders: {
        unableToUpdate: 1001,
        notExist: 1002,
        unableToCreateNoCustomer: 1003,
        unableToCreateNoItem: 1004
    },
    preparations: {
        unableToBegin: 1500,
        unableToEnd: 1501,
        notExist: 1502,
        unableToRestart: 1503
    },
    deliveries: {
        unableToBegin: 1700,
        unableToEnd: 1701,
        notExist: 1702,
        unableToRestart: 1703
    }
};
const errors = {
    [codes.orders.unableToUpdate]: {
        message: 'Unable to update order. Order is not in updatable state.',
        httpCode: 400
    },
    [codes.orders.unableToCreateNoCustomer]: {
        message: 'Unable to create order. Customer does not exist.',
        httpCode: 400
    },
    [codes.orders.unableToCreateNoItem]: {
        message: 'Unable to create order. Specified pizza does not exist.',
        httpCode: 400
    },
    [codes.orders.notExist]: {
        message: 'Order does not exist.',
        httpCode: 404
    },
    [codes.preparations.notExist]: {
        message: 'Preparation does not exist.',
        httpCode: 404
    },
    [codes.preparations.unableToBegin]: {
        message: 'Unable to begin preparation.',
        httpCode: 400
    },
    [codes.preparations.unableToEnd]: {
        message: 'Unable to end preparation.',
        httpCode: 400
    },
    [codes.preparations.unableToRestart]: {
        message: 'Unable to restart preparation.',
        httpCode: 400
    },
    [codes.deliveries.unableToBegin]: {
        message: 'Unable to begin delivery.',
        httpCode: 400
    },
    [codes.deliveries.unableToEnd]: {
        message: 'Unable to end delivery.',
        httpCode: 400
    },
    [codes.deliveries.unableToRestart]: {
        message: 'Unable to restart delivery.',
        httpCode: 400
    }
};
module.exports = {
    codes,
    errors
};
