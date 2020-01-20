const Customer = require('../../models/pizza');
const schema = 'PizzaStore';
const table = 'Pizza';
class PizzaRepository {
    constructor (unitOfWork) {
        this.unitOfWork = unitOfWork;
    }
    async getPizzaByIds ({ids}) {
        const query = `SELECT p.id as id, pt.name as typeName, ps.name as sizeName FROM "${schema}"."${table}" as p 
            JOIN "${schema}"."PizzaType" as pt ON pt.id=p.typeId
            JOIN "${schema}"."PizzaSize" as ps ON ps.id=p.sizeId 
            WHERE p.id=ANY($1::integer[])`;
        const values = [ids];
        const result = await this.unitOfWork.query(query, values);

        return result.rows.map(Customer.fromEntity);
    }
}
module.exports = PizzaRepository;
