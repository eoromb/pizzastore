module.exports = {
    invalidItemsOrder: {items: {id: 1, quantity: 1}, customerId: 1, address: 'Some address'},
    order: {items: [{id: 1, quantity: 1}, {id: 2, quantity: 2}], customerId: 1, address: 'Some address'},
    updatedOrder: {items: [{id: 1, quantity: 10}, {id: 3, quantity: 2}], customerId: 1, address: 'Some address'},
    unexistentItemsOrder: {items: [{id: 1000, quantity: 1}], customerId: 1, address: 'Some address'},
    unexistentCustomerOrder: {items: [{id: 1, quantity: 1}], customerId: 1000, address: 'Some address'}
};
