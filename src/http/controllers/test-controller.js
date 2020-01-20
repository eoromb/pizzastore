class TestController {
    constructor (dbHelper) {
        this.dbHelper = dbHelper;
    }
    async reset (req, res, next) {
        try {
            await this.dbHelper.reset();
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = TestController;
