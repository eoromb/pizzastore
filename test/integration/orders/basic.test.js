const app = require('../../../server');
const request = require('supertest').agent(app);
const orders = require('../misc/data/orders');
const urls = require('../misc/data/urls');
const OrderSchemas = require('../../../src/http/schemas/order-schemas');
const expect = require('chai').expect;
const Order = require('../../../src/models/order');

describe('order tests', () => {
    before(async () => {
        const result = await request
            .post(urls.reset);
        expect(result.statusCode).to.be.equal(200);
    });
    describe('basic CRUD operations tests', () => {
        it('should add/get/delete order', async () => {
            let result = await request
                .post(urls.orders)
                .send(orders.order);
            expect(result.statusCode).to.be.equal(201);
            expect(result.headers).to.have.property('location');
            const orderUrl = result.headers.location;

            result = await request
                .get(orderUrl);
            expect(result.statusCode).to.be.equal(200);
            const {body: order} = result;
            const {error} = OrderSchemas.order.validate(order);
            expect(error).to.be.undefined;
            expect(order.items).to.be.deep.equal(orders.order.items);
            expect(order.address).to.be.equal(orders.order.address);
            expect(order.customerId).to.be.equal(orders.order.customerId);
            expect(order.status).to.be.equal(Order.status.new);

            result = await request
                .delete(orderUrl);
            expect(result.statusCode).to.be.equal(204);

            result = await request
                .get(orderUrl);
            expect(result.statusCode).to.be.equal(404);
        });
        it('should update order items', async () => {
            let result = await request
                .post(urls.orders)
                .send(orders.order);
            expect(result.statusCode).to.be.equal(201);
            const orderUrl = result.headers.location;

            result = await request.patch(orderUrl).send({items: orders.updatedOrder.items});
            result = await request.get(orderUrl);
            expect(result.statusCode).to.be.equal(200);
            const {body: order} = result;
            expect(order.items).to.be.deep.equal(orders.updatedOrder.items);
            expect(order.address).to.be.equal(orders.updatedOrder.address);
            expect(order.customerId).to.be.equal(orders.updatedOrder.customerId);
            expect(order.status).to.be.equal(Order.status.new);

            result = await request
                .delete(orderUrl);
            expect(result.statusCode).to.be.equal(204);

            result = await request
                .get(orderUrl);
            expect(result.statusCode).to.be.equal(404);
        });
    });
    describe('order statuses tests', async () => {
        let order = null;
        beforeEach(async () => {
            let result = await request
                .post(urls.orders)
                .send(orders.order);
            expect(result.statusCode).to.be.equal(201);
            const orderUrl = result.headers.location;
            result = await request
                .get(orderUrl);
            expect(result.statusCode).to.be.equal(200);
            order = result.body;
            order.url = orderUrl;
        });
        afterEach(async () => {
            const result = await request
                .delete(order.url);
            expect(result.statusCode).to.be.equal(204);
            order = null;
        });
        it('should start order preparation after creation', async () => {
            let result = await request.post(`${order.url}/${urls.preparation}`);
            expect(result.statusCode).be.equal(201);

            result = await request
                .get(order.url);
            expect(result.statusCode).to.be.equal(200);
            expect(result.body.status).to.be.equal(Order.status.preparing);
        });
        it('should end order preparation after start', async () => {
            let result = await request.post(`${order.url}/${urls.preparation}`);
            expect(result.statusCode).be.equal(201);

            result = await request.patch(`${order.url}/${urls.preparation}`).send({completed: true});
            expect(result.statusCode).be.equal(204);

            result = await request
                .get(order.url);
            expect(result.statusCode).to.be.equal(200);
            expect(result.body.status).to.be.equal(Order.status.prepared);
        });
        it('should start order delivery only after order prepared', async () => {
            let result = await request.post(`${order.url}/${urls.delivery}`);
            expect(result.statusCode).be.equal(400);

            result = await request.post(`${order.url}/${urls.preparation}`);
            expect(result.statusCode).be.equal(201);

            result = await request.post(`${order.url}/${urls.delivery}`);
            expect(result.statusCode).be.equal(400);

            result = await request.patch(`${order.url}/${urls.preparation}`).send({completed: true});
            expect(result.statusCode).be.equal(204);

            result = await request.post(`${order.url}/${urls.delivery}`);
            expect(result.statusCode).be.equal(201);

            result = await request.get(order.url);
            expect(result.statusCode).to.be.equal(200);
            expect(result.body.status).to.be.equal(Order.status.delivering);
        });
        it('should end order delivery only after order delivery start', async () => {
            let result = await request.post(`${order.url}/${urls.preparation}`);
            expect(result.statusCode).be.equal(201);

            result = await request.patch(`${order.url}/${urls.preparation}`).send({completed: true});
            expect(result.statusCode).be.equal(204);

            result = await request.post(`${order.url}/${urls.delivery}`);
            expect(result.statusCode).be.equal(201);

            result = await request.patch(`${order.url}/${urls.delivery}`).send({completed: true});
            expect(result.statusCode).be.equal(204);

            result = await request.get(order.url);
            expect(result.statusCode).to.be.equal(200);
            expect(result.body.status).to.be.equal(Order.status.delivered);
        });
        it('should not update order when deliverying or delivered', async () => {
            let result = await request.post(`${order.url}/${urls.preparation}`);
            expect(result.statusCode).be.equal(201);

            result = await request.patch(`${order.url}/${urls.preparation}`).send({completed: true});
            expect(result.statusCode).be.equal(204);

            result = await request.post(`${order.url}/${urls.delivery}`);
            expect(result.statusCode).be.equal(201);

            result = await request.patch(order.url).send({items: orders.updatedOrder.items});
            expect(result.statusCode).to.be.equal(400);

            result = await request.patch(`${order.url}/${urls.delivery}`).send({completed: true});
            expect(result.statusCode).be.equal(204);

            result = await request.patch(order.url).send({items: orders.updatedOrder.items});
            expect(result.statusCode).to.be.equal(400);

            result = await request.get(order.url);
            expect(result.statusCode).to.be.equal(200);
            expect(result.body.status).to.be.equal(Order.status.delivered);
        });
    });
});

