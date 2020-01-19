class Preparation {
    static fromEntity (entity) {
        if (entity == null) {
            return null;
        }
        return new Preparation(entity);
    }
    constructor ({id, completed}) {
        this.id = id;
        this.completed = completed;
    }
}
module.exports = Preparation;
