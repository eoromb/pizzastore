const AppError = require('../common/errors/app-error');
const OrderRepository = require('../persistence/repositories/order-repository');
const PreparationRepository = require('../persistence/repositories/preparation-repository');
const Errors = require('../common/errors/errors');
class PreparationService {
    constructor (unitOfWorkFactory) {
        this.unitOfWorkFactory = unitOfWorkFactory;
    }
    async beginPreparation ({orderId}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork({repeatableRead: true});
            const orderRepository = new OrderRepository(uow);
            const preparationRepository = new PreparationRepository(uow);
            const order = await orderRepository.getOrder({id: orderId});
            if (order == null) {
                throw new AppError(Errors.codes.orders.notExist);
            }
            if (!order.canBeginPreparation()) {
                throw new AppError(Errors.codes.preparations.unableToBegin);
            }
            order.beginPreparation();
            await preparationRepository.createPreparation({orderId});
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
    async getPreparationByOrder ({orderId}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork();
            const preparationRepository = new PreparationRepository(uow);
            const preparation = await preparationRepository.getPreparationByOrder({orderId});
            if (preparation == null) {
                throw new AppError(Errors.codes.preparations.notExist);
            }
            await uow.commit();
            return preparation;
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
    async updatePreparation ({orderId, completed}) {
        let uow = null;
        try {
            uow = await this.unitOfWorkFactory.createUnitOfWork({repeatableRead: true});
            const orderRepository = new OrderRepository(uow);
            const preparationRepository = new PreparationRepository(uow);
            const order = await orderRepository.getOrder({id: orderId});
            if (order == null) {
                throw new AppError(Errors.codes.orders.notExist);
            }
            if (completed) {
                if (!order.canEndPreparation()) {
                    throw new AppError(Errors.codes.preparations.unableToEnd);
                }
                order.endPreparation();
            } else {
                if (!order.canRestartPreparation()) {
                    throw new AppError(Errors.codes.preparations.unableToRestart);
                }
                order.restartPreparation();
            }
            await preparationRepository.updatePreparationByOrder({orderId, completed});
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
module.exports = PreparationService;
