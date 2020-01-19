const express = require('express');
const validationMiddleware = require('../../../middlewares/validator');
const schemas = require('../../../schemas/order-schemas');
const orderDelivery = require('./order-delivery');
const orderPreparation = require('./order-preparation');
module.exports = ({orderController, deliveryController, preparationController}) => {
    const router = express.Router();
    router.post('/', validationMiddleware(schemas.create), orderController.create.bind(orderController));
    router.get('/:id', orderController.get.bind(orderController));
    router.patch('/:id', validationMiddleware(schemas.update), orderController.update.bind(orderController));
    router.delete('/:id', orderController.delete.bind(orderController));
    router.get('/', orderController.list.bind(orderController));

    router.use('/:id/delivery', orderDelivery(deliveryController));
    router.use('/:id/preparation', orderPreparation(preparationController));
    return router;
};
