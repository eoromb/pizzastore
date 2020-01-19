class Delivery {
    static fromEntity (entity) {
        if (entity == null) {
            return null;
        }
        return new Delivery(entity);
    }
    constructor ({id, completed}) {
        this.id = id;
        this.completed = completed;
    }
}
module.exports = Delivery;
