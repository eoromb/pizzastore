class DeliveryController {
    constructor (deliveryService) {
        this.deliveryService = deliveryService;
    }
    async create (req, res, next) {
        try {
            const {params: {id: orderId}} = req;
            await this.deliveryService.beginDelivery({orderId});
            res.location(`${req.baseUrl}`);
            res.sendStatus(201);
        } catch (error) {
            next(error);
        }
    }
    async getByOrder (req, res, next) {
        try {
            const {params: {id: orderId}} = req;
            const delivery = await this.deliveryService.getDelivery({orderId});
            res.json(delivery);
        } catch (error) {
            next(error);
        }
    }
    async updateByOrder (req, res, next) {
        try {
            const {params: {id: orderId}, body: {completed}} = req;
            await this.deliveryService.updateDelivery({orderId, completed});
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = DeliveryController;
