const OrderDataMapper = require('../models/order-data-mapper');
class PreparationController {
    constructor (preparationService) {
        this.preparationService = preparationService;
    }
    async create (req, res, next) {
        try {
            const {params: {id: orderId}} = req;
            await this.preparationService.beginPreparation({orderId});
            res.location(`${req.baseUrl}`);
            res.sendStatus(201);
        } catch (error) {
            next(error);
        }
    }
    async getByOrder (req, res, next) {
        try {
            const {params: {id: orderId}} = req;
            const preparation = await this.preparationService.getPreparationByOrder({orderId});
            res.json(preparation);
        } catch (error) {
            next(error);
        }
    }
    async updateByOrder (req, res, next) {
        try {
            const {params: {id: orderId}, body: {completed}} = req;
            await this.preparationService.updatePreparation({orderId, completed});
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = PreparationController;
