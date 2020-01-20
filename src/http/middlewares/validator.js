/**
 * Validates request body
 * @param {*} schema Joi schema
 */
const validator = schema => (req, res, next) => {
    const {error} = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
        next();
    } else {
        const {details} = error;
        const message = details.map(i => i.message).join(',');
        res.status(400).json({error: message});
    }
};
module.exports = validator;
