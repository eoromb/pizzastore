const Joi = require('@hapi/joi');
class DeliverySchemas {
}
DeliverySchemas.create = Joi.object().keys({
    orderId: Joi.number().required()
});
DeliverySchemas.update = Joi.object().keys({
    completed: Joi.boolean()
});
module.exports = DeliverySchemas;
