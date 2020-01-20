const express = require('express');
module.exports = ({testController: controller}) => {
    const router = express.Router();
    if (process.env.NODE_ENV === 'test' && controller != null) {
        router.post('/reset', controller.reset.bind(controller));
    }
    return router;
};
