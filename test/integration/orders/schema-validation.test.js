const request = require('supertest');
const app = require('../../../server');
const orders = require('../data/orders');
const urls = require('../data/urls');

describe('order schema validation tests', () => {
    it('should fail if items is not array', async () => {
        await request(app)
            .post(urls.orders)
            .send(orders.invalidItemsOrder)
            .expect(400);
    });
});
