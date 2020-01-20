const AppError = require('../common/errors/app-error');
const OrderRepository = require('../persistence/repositories/order-repository');
const CustomerRepository = require('../persistence/repositories/customer-repository');
const PizzaRepository = require('../persistence/repositories/pizza-repository');
const Errors = require('../common/errors/errors');
/**
 * Order application service
 */
class OrderService {
    constructor (unitOfWorkFactory) {
        this.unitOfWorkFactory = unitOfWorkFactory;
    }
    async createOrder ({items, customerId, address}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork();
            const orderRepository = new OrderRepository(uow);
            const customerRepository = new CustomerRepository(uow);
            const pizzaRepository = new PizzaRepository(uow);
            const customer = await customerRepository.getCustomer({id: customerId});
            if (customer == null) {
                throw new AppError(Errors.codes.orders.unableToCreateNoCustomer);
            }
            const pizzas = await pizzaRepository.getPizzaByIds({ids: items.map(i => i.id)});
            if (pizzas.length !== items.length) {
                throw new AppError(Errors.codes.orders.unableToCreateNoItem);
            }
            const order = await orderRepository.createOrder({items, customerId, address});

            await uow.commit();
            return order;
        } catch (error) {
            if (uow != null) {
                await uow.rollback();
            }
            throw error;
        } finally {
            if (uow != null) {
                await uow.release();
            }
        }
    }
    async getOrder ({id}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork();
            const orderRepository = new OrderRepository(uow);
            const order = await orderRepository.getOrder({id});
            if (order == null) {
                throw new AppError(Errors.codes.orders.notExist);
            }
            await uow.commit();
            return order;
        } catch (error) {
            if (uow != null) {
                await uow.rollback();
            }
            throw error;
        } finally {
            if (uow != null) {
                await uow.release();
            }
        }
    }
    /**
     * Updates order items
     */
    async updateOrder ({id, items}) {
        let uow = null;
        try {
            // begin transaction with repeatable read isolation to take into account order status
            uow = await this.unitOfWorkFactory.createUnitOfWork({repeatableRead: true});
            const orderRepository = new OrderRepository(uow);
            const order = await orderRepository.getOrder({id});
            if (order == null) {
                throw new AppError(Errors.codes.orders.notExist);
            }
            if (!order.canBeUpdated()) {
                throw new AppError(Errors.codes.orders.unableToUpdate);
            }
            order.setItems(items);
            await orderRepository.updateOrder(order);

            await uow.commit();
            return order;
        } catch (error) {
            if (uow != null) {
                await uow.rollback();
            }
            throw error;
        } finally {
            if (uow != null) {
                await uow.release();
            }
        }
    }
    async listOrders ({status, customerId}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork();
            const orderRepository = new OrderRepository(uow);
            const orders = await orderRepository.listOrders({status, customerId});

            await uow.commit();
            return orders;
        } catch (error) {
            if (uow != null) {
                await uow.rollback();
            }
            throw error;
        } finally {
            if (uow != null) {
                await uow.release();
            }
        }
    }
    async deleteOrder ({id}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork();
            const orderRepository = new OrderRepository(uow);
            const order = await orderRepository.getOrder({id});
            if (order == null) {
                throw new AppError(Errors.codes.orders.notExist);
            }
            await orderRepository.deleteOrder({id});

            await uow.commit();
        } catch (error) {
            if (uow != null) {
                await uow.rollback();
            }
            throw error;
        } finally {
            if (uow != null) {
                await uow.release();
            }
        }
    }
}
module.exports = OrderService;
