const OrderService = require('./order-service');
const DeliveryService = require('./delivery-service');
const PreparationService = require('./preparation-service');
module.exports = ({persistence}) => {
    return {
        orderService: new OrderService(persistence.unitOfWorkFactory),
        deliveryService: new DeliveryService(persistence.unitOfWorkFactory),
        preparationService: new PreparationService(persistence.unitOfWorkFactory)
    };
};
