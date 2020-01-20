const OrderController = require('./order-controller');
const DeliveryController = require('./delivery-controller');
const PreparationController = require('./preparation-controller');
const TestController = require('./test-controller');
module.exports = ({services: {orderService, deliveryService, preparationService}, persistence: {dbHelper}}) => {
    const result = {
        orderController: new OrderController(orderService),
        deliveryController: new DeliveryController(deliveryService),
        preparationController: new PreparationController(preparationService)
    };
    if (process.env.NODE_ENV === 'test') {
        result.testController = new TestController(dbHelper);
    }
    return result;
};
