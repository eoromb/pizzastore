const OrderDataMapper = require('../models/order-data-mapper');
/**
 * Order controller
 */
class OrderController {
    constructor (orderService) {
        this.orderService = orderService;
    }
    async create (req, res, next) {
        try {
            const {body: {items, customerId, address}} = req;
            const order = await this.orderService.createOrder({items, customerId, address});
            res.location(`${req.baseUrl}/${order.id}`);
            res.sendStatus(201);
        } catch (error) {
            next(error);
        }
    }
    async get (req, res, next) {
        try {
            const {params: {id}} = req;
            const order = await this.orderService.getOrder({id});
            res.json(OrderDataMapper.fromDomain(order));
        } catch (error) {
            next(error);
        }
    }
    async update (req, res, next) {
        try {
            const {params: {id}, body: {items}} = req;
            await this.orderService.updateOrder({id, items});
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
    async list (req, res, next) {
        try {
            const {query: {status, customerId}} = req;
            const orders = await this.orderService.listOrders({status, customerId});
            res.json({orders: orders.map(OrderDataMapper.fromDomain)});
        } catch (error) {
            next(error);
        }
    }
    async delete (req, res, next) {
        try {
            const {params: {id}} = req;
            await this.orderService.deleteOrder({id});
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = OrderController;
