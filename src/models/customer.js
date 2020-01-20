class Customer {
    static fromEntity (entity) {
        if (entity == null) {
            return null;
        }
        return new Customer(entity);
    }
    constructor ({id, name, address}) {
        this.id = id;
        this.name = name;
        this.address = address;
    }
}
module.exports = Customer;
