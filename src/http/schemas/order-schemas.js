const Joi = require('@hapi/joi');
class OrderSchemas {
}
OrderSchemas.orderItem = Joi.object({
    id: Joi.number().required(),
    quantity: Joi.number().min(1).required()
});
OrderSchemas.create = Joi.object().keys({
    items: Joi.array().items(OrderSchemas.orderItem),
    customerId: Joi.number().required(),
    address: Joi.string().required()
});
OrderSchemas.update = Joi.object().keys({
    items: Joi.array().items(OrderSchemas.orderItem)
});
module.exports = OrderSchemas;
