const AppError = require('../common/errors/app-error');
const OrderRepository = require('../persistence/repositories/order-repository');
const DeliveryRepository = require('../persistence/repositories/delivery-repository');
const Errors = require('../common/errors/errors');
class DeliveryService {
    constructor (unitOfWorkFactory) {
        this.unitOfWorkFactory = unitOfWorkFactory;
    }
    async beginDelivery ({orderId}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork({repeatableRead: true});
            const orderRepository = new OrderRepository(uow);
            const deliveryRepository = new DeliveryRepository(uow);
            const order = await orderRepository.getOrder({id: orderId});
            if (order == null) {
                throw new AppError(Errors.codes.orders.notExist);
            }
            if (!order.canBeginDelivery()) {
                throw new AppError(Errors.codes.deliveries.unableToBegin);
            }
            order.beginDelivery();
            await deliveryRepository.createDelivery({orderId});
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
    async getDelivery ({orderId}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork();
            const deliveryRepository = new DeliveryRepository(uow);
            const delivery = await deliveryRepository.getDeliveryByOrder({orderId});
            if (delivery == null) {
                throw new AppError(Errors.codes.deliveries.notExist);
            }
            await uow.commit();
            return delivery;
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
    async updateDelivery ({orderId, completed = false}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork({repeatableRead: true});
            const orderRepository = new OrderRepository(uow);
            const deliveryRepository = new DeliveryRepository(uow);
            const order = await orderRepository.getOrder({id: orderId});
            if (order == null) {
                throw new AppError(Errors.codes.orders.notExist);
            }
            if (completed) {
                if (!order.canEndDelivery()) {
                    throw new AppError(Errors.codes.deliveries.unableToEnd);
                }
                order.endDelivery();
            } else {
                throw new AppError(Errors.codes.deliveries.unableToRestart);
            }
            await deliveryRepository.updateDeliveryByOrder({orderId, completed: true});
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
}
module.exports = DeliveryService;
