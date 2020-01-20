class Pizza {
    static fromEntity (entity) {
        if (entity == null) {
            return null;
        }
        return new Pizza(entity);
    }
    constructor ({id, sizename, typename}) {
        this.id = id;
        this.name = typename;
        this.size = sizename;
    }
}
module.exports = Pizza;
