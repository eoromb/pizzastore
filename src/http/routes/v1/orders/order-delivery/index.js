const express = require('express');
const validation = require('../../../../middlewares/validator');
const schemas = require('../../../../schemas/delivery-schemas');
module.exports = controller => {
    const router = express.Router({mergeParams: true});
    router.post('/', controller.create.bind(controller));
    router.get('/', controller.getByOrder.bind(controller));
    router.patch('/', validation(schemas.update), controller.updateByOrder.bind(controller));
    return router;
};
