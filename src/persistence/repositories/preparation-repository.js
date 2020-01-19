const Preparation = require('../../models/preparation');
const schema = 'PizzaStore';
const table = 'Preparation';
class PreparationRepository {
    constructor (unitOfWork) {
        this.unitOfWork = unitOfWork;
    }
    async createPreparation ({orderId}) {
        const result = await this.unitOfWork.query(`INSERT INTO "${schema}"."${table}" (orderId) SELECT $1 RETURNING *;`,
            [orderId]);
        const preparation = result.rows[0];

        return Preparation.fromEntity(preparation);
    }
    async getPreparation ({id}) {
        const query = `SELECT * FROM "${schema}"."${table}" WHERE id=$1`;
        const values = [id];
        const result = await this.unitOfWork.query(query, values);
        const preparationEntity = result.rows[0];

        return Preparation.fromEntity(preparationEntity);
    }
    async getPreparationByOrder ({orderId}) {
        const query = `SELECT * FROM "${schema}"."${table}" WHERE orderId=$1`;
        const values = [orderId];
        const result = await this.unitOfWork.query(query, values);
        const preparationEntity = result.rows[0];

        return Preparation.fromEntity(preparationEntity);
    }
    async listPreparations () {
        const result = await this.unitOfWork.query(`SELECT * FROM "${schema}"."${table}" `);

        return result.rows.map(Preparation.fromEntity);
    }
    async updatePreparation ({id, completed}) {
        await this.unitOfWork.query(`UPDATE "${schema}"."${table}" SET completed=$1 WHERE id=$2`, [completed, id]);
    }
    async updatePreparationByOrder ({orderId, completed}) {
        await this.unitOfWork.query(`UPDATE "${schema}"."${table}" SET completed=$1 WHERE orderId=$2`, [completed, orderId]);
    }
}
module.exports = PreparationRepository;
