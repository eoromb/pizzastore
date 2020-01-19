const Preparation = require('./preparation');
const Delivery = require('./delivery');

class Order {
    static fromEntity (entity) {
        if (entity == null) {
            return null;
        }
        return new Order(entity);
    }
    static toEntity (order) {
        const {id, status, customerId, version, items, address} = order;
        return {id, status, customerId, version, items, address};
    }
    constructor (entity) {
        this.id = entity.id;
        this.status = entity.status;
        this.customerId = entity.customerid;
        this.version = entity.version;
        this.items = entity.items;
        this.address = entity.address;
        if (Number.isInteger(entity.preparationid)) {
            this.preparation = Preparation.fromEntity({id: entity.preparationid, completed: entity.preparationcompleted});
        }
        if (Number.isInteger(entity.deliveryid)) {
            this.delivery = Delivery.fromEntity({id: entity.deliveryid, completed: entity.deliverycompleted});
        }
    }
    setItems (items) {
        this.items = items;
        this.version += 1;
        return this;
    }
    canBeUpdated () {
        return this.status !== Order.status.delivering &&
            this.status !== Order.status.delivered;
    }
    canBeginPreparation () {
        return this.preparation == null;
    }
    canEndPreparation () {
        return this.preparation != null && this.status === Order.status.preparing;
    }
    canRestartPreparation () {
        return this.preparation != null && this.status === Order.status.prepared;
    }
    canBeginDelivery () {
        return this.delivery == null && this.status === Order.status.prepared;
    }
    canEndDelivery () {
        return this.delivery != null && this.status === Order.status.delivering;
    }
    beginPreparation () {
        this.status = Order.status.preparing;
        this.version += 1;
        return this;
    }
    endPreparation () {
        this.status = Order.status.prepared;
        this.version += 1;
        return this;
    }
    restartPreparation () {
        this.beginPreparation();
    }
    beginDelivery () {
        this.status = Order.status.delivering;
        this.version += 1;
        return this;
    }
    endDelivery () {
        this.status = Order.status.delivered;
        this.version += 1;
        return this;
    }
}
Order.status = {
    new: 'new',
    preparing: 'preparing',
    prepared: 'prepared',
    delivering: 'delivering',
    delivered: 'delivered'
};
module.exports = Order;
