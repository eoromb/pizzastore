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
OrderSchemas.order = Joi.object().keys({
    id: Joi.number().required(),
    items: Joi.array().items(OrderSchemas.orderItem),
    customerId: Joi.number().required(),
    address: Joi.string().required(),
    status: Joi.string().required()
});
module.exports = OrderSchemas;
