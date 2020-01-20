const Preparation = require('./preparation');
const Delivery = require('./delivery');

/**
 * Order model
 */
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
        // Use version for concurrency control
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
    /**
     * Sets order items
     * @param {*} items
     */
    setItems (items) {
        this.items = items;
        this.version += 1;
        return this;
    }
    /**
     * Checks based on status if order can be updated
     */
    canBeUpdated () {
        return this.status !== Order.status.delivering &&
            this.status !== Order.status.delivered;
    }
    /**
     * Checks based on status if can begin preparation of order
     */
    canBeginPreparation () {
        return this.preparation == null;
    }
    /**
     * Checks based on status if can end preparation of order
     */
    canEndPreparation () {
        return this.preparation != null && this.status === Order.status.preparing;
    }
    /**
     * Checks based on status if can restart preparation of order
     */
    canRestartPreparation () {
        return this.preparation != null && this.status === Order.status.prepared;
    }
    /**
     * Checks based on status if can begin delivery of order
     */
    canBeginDelivery () {
        return this.delivery == null && this.status === Order.status.prepared;
    }
    /**
     * Checks based on status if can end delivery of order
     */
    canEndDelivery () {
        return this.delivery != null && this.status === Order.status.delivering;
    }
    /**
     * Begins order preparation
     */
    beginPreparation () {
        this.status = Order.status.preparing;
        this.version += 1;
        return this;
    }
    /**
     * Ends order preparation
     */
    endPreparation () {
        this.status = Order.status.prepared;
        this.version += 1;
        return this;
    }
    /**
     * Restarts order preparation
     */
    restartPreparation () {
        this.beginPreparation();
    }
    /**
     * Begins order delivery
     */
    beginDelivery () {
        this.status = Order.status.delivering;
        this.version += 1;
        return this;
    }
    /**
     * Ends order delivery
     */
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
