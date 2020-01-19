const Delivery = require('../../models/delivery');
const schema = 'PizzaStore';
const table = 'Delivery';
class DeliveryRepository {
    constructor (unitOfWork) {
        this.unitOfWork = unitOfWork;
    }
    async createDelivery ({orderId}) {
        const result = await this.unitOfWork.query(`INSERT INTO "${schema}"."${table}" (orderId) SELECT $1 RETURNING *;`,
            [orderId]);
        const deliveryEntity = result.rows[0];

        return Delivery.fromEntity(deliveryEntity);
    }
    async getDelivery ({id}) {
        const query = `SELECT * FROM "${schema}"."${table}" WHERE id=$1`;
        const values = [id];
        const result = await this.unitOfWork.query(query, values);
        const deliveryEntity = result.rows[0];

        return Delivery.fromEntity(deliveryEntity);
    }
    async getDeliveryByOrder ({orderId}) {
        const query = `SELECT * FROM "${schema}"."${table}" WHERE orderId=$1`;
        const values = [orderId];
        const result = await this.unitOfWork.query(query, values);
        const deliveryEntity = result.rows[0];

        return Delivery.fromEntity(deliveryEntity);
    }
    async listDeliveries () {
        const result = await this.unitOfWork.query(`SELECT * FROM "${schema}"."${table}" `);

        return result.rows.map(Delivery.fromEntity);
    }
    async updateDelivery ({id, completed}) {
        await this.unitOfWork.query(`UPDATE "${schema}"."${table}" SET completed=$1 WHERE id=$2`, [completed, id]);
    }
    async updateDeliveryByOrder ({orderId, completed}) {
        await this.unitOfWork.query(`UPDATE "${schema}"."${table}" SET completed=$1 WHERE orderId=$2`, [completed, orderId]);
    }
}
module.exports = DeliveryRepository;
