const OrderController = require('./order-controller');
const DeliveryController = require('./delivery-controller');
const PreparationController = require('./preparation-controller');
module.exports = ({services: {orderService, deliveryService, preparationService}}) => {
    return {
        orderController: new OrderController(orderService),
        deliveryController: new DeliveryController(deliveryService),
        preparationController: new PreparationController(preparationService)
    };
};
