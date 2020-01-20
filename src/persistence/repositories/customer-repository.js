const Customer = require('../../models/customer');
const schema = 'PizzaStore';
const table = 'Customer';
class CustomerRepository {
    constructor (unitOfWork) {
        this.unitOfWork = unitOfWork;
    }
    async getCustomer ({id}) {
        const query = `SELECT * FROM "${schema}"."${table}" WHERE id=$1`;
        const values = [id];
        const result = await this.unitOfWork.query(query, values);
        const entity = result.rows[0];

        return Customer.fromEntity(entity);
    }
}
module.exports = CustomerRepository;
