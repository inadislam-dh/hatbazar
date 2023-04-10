const { body } = require('express-validator')

exports.createProductSchema = [
    body('name').exists().withMessage('Product name is required').isAlpha().withMessage('Must be only alphabetical chars').isLength({ min: 5 }).withMessage('Must be at least 3 chars long'),
    body('description').exists().withMessage('Description is required').not().isEmpty(),
    body('price').exists().withMessage('Price is required'),
    body('quantity').exists().withMessage('Quantity is required'),
    body('image').exists().withMessage('image is required'),
    body('category').exists().withMessage('Category is required'),
    body('type').exists().withMessage('Type is required'),
    body('status').exists().withMessage('Status is required'),
]

exports.updateProductSchema = [
    body('name').optional().isAlpha().isLength({ min: 3 }),
    body('description').optional().exists().not().isEmpty(),
    body('sku').optional().exists(),
    body('sell_price').optional().exists(),
    body('price').optional().exists(),
    body('quantity').optional().exists(),
    body('image').optional().exists(),
    body('category').optional().exists(),
    body('type').optional().exists(),
    body('status').optional().exists(),
    body('assigned').optional().exists(),
    body().custom(value => {return !!Object.keys(value).length;}).custom(value => {
        const updates = Object.keys(value);
        const allowUpdates = ['name', 'description', 'sku', 'sell_price', 'price', 'quantity', 'image', 'category', 'type', 'status', 'assigned'];
        return updates.every(update => allowUpdates.includes(update));
    })
]