const Order = require('../../models/order');
const schema = 'PizzaStore';
class OrderRepository {
    constructor (unitOfWork) {
        this.unitOfWork = unitOfWork;
    }
    async createOrder ({items, customerId, address}) {
        const result = await this.unitOfWork.query(`INSERT INTO "${schema}"."Order" (customerId, address) SELECT $1, $2 RETURNING *;`,
            [customerId, address]);
        const order = result.rows[0];
        await this.updateOrderItems({id: order.id, items});

        return order;
    }
    async getOrder ({id}) {
        const query = `SELECT d.id as deliveryId, d.completed as deliveryCompleted, 
            p.id as preparationId, p.completed as preparationCompleted,
             orderagg.* FROM
            (SELECT o.*, json_agg(json_build_object('pizzaId', oi.pizzaId,'quantity', oi.quantity)) as items
            FROM "${schema}"."Order" as o
            LEFT JOIN "${schema}"."OrderItem" as oi ON o.id=oi.orderId 
            WHERE o.id=$1
            GROUP BY o.Id) as orderagg 
            LEFT JOIN "${schema}"."Delivery" as d ON orderagg.id=d.orderId 
            LEFT JOIN "${schema}"."Preparation" as p ON orderagg.id=p.orderId`;
        const values = [id];
        const result = await this.unitOfWork.query(query, values);
        const orderEntity = result.rows[0];

        return Order.fromEntity(orderEntity);
    }
    async listOrders ({status, customerId}) {
        let query = `SELECT * FROM "${schema}"."Order" `;
        const values = [];
        if (status != null) {
            query += 'WHERE status=$1';
            values.push(status);
        } else if (customerId != null) {
            query += 'WHERE customerId=$1';
            values.push(customerId);
        }
        const result = await this.unitOfWork.query(query, values);

        return result.rows.map(Order.fromEntity);
    }
    async updateOrderItems ({id, items}) {
        await this.unitOfWork.query(`DELETE FROM "${schema}"."OrderItem" WHERE orderId = $1`, [id]);
        return await this.unitOfWork.query(`INSERT INTO "${schema}"."OrderItem" (orderId, pizzaId, quantity)
             SELECT $1, id, quantity FROM jsonb_to_recordset($2) as x(id integer, quantity integer)`, [id, JSON.stringify(items)]);
    }
    async updateOrder (order) {
        const {id, items, status, version} = Order.toEntity(order);
        await this.unitOfWork.query(`UPDATE "${schema}"."Order" SET status=$1, version=$2 WHERE id=$3`, [status, version, id]);
        if (Array.isArray(items)) {
            await this.updateOrderItems({id, items});
        }
    }
    async deleteOrder ({id}) {
        const query = `DELETE FROM "${schema}"."Order" WHERE id=$1`;
        const values = [id];
        await this.unitOfWork.query(query, values);
    }
}
module.exports = OrderRepository;
