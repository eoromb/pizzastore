const Joi = require('@hapi/joi');
class PreparationSchemas {
}
PreparationSchemas.create = Joi.object().keys({
    orderId: Joi.number().required()
});
PreparationSchemas.update = Joi.object().keys({
    completed: Joi.boolean()
});
module.exports = PreparationSchemas;
