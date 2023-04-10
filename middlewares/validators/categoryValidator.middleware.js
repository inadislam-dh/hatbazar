const { body } = require('express-validator')

exports.createCategorySchema = [
    body('name').exists().withMessage('Category name is required').isAlpha().withMessage('Must be only alphabetical chars').isLength({ min: 5 }).withMessage('Must be at least 3 chars long'),
    body('status').exists().withMessage('Status is required'),
]

exports.updateCategorySchema = [
    body('name').optional().isAlpha().isLength({ min: 3 }),
    body('status').optional().exists(),
    body().custom(value => {return !!Object.keys(value).length;}).custom(value => {
        const updates = Object.keys(value);
        const allowUpdates = ['name', 'status'];
        return updates.every(update => allowUpdates.includes(update));
    })
]