const app = require('../../../server');
const request = require('supertest').agent(app);

const orders = require('../misc/data/orders');
const urls = require('../misc/data/urls');

describe('order schema validation tests', () => {
    it('should fail if items is not array', async () => {
        await request
            .post(urls.orders)
            .send(orders.invalidItemsOrder)
            .expect(400);
    });
});
