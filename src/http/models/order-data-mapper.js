class OrderDataMapper {
    static fromDomain (order) {
        const {items, status, id, customerId, address} = order;
        return {items, status, id, customerId, address};
    }
}
module.exports = OrderDataMapper;
