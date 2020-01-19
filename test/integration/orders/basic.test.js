const request = require('supertest');
const app = require('../../../server');
const orders = require('../data/orders');
const urls = require('../data/urls');

describe('order CRUD operations tests', () => {
    it('should add/get order', async () => {
        const result = await request(app)
            .post(urls.orders)
            .send(orders.orderWithOneItem);
        await request(app).get(result.header.location);
    });
});
