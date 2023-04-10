const { body } = require('express-validator')
const Role = require('../../utils/userRoles.utils')

exports.createUserSchema = [
    body('name').exists().withMessage('Your name is required').isAlpha().withMessage('Must be only alphabetical chars').isLength({ min: 3 }).withMessage('Must be at least 3 chars long'),
    body('email').exists().withMessage('Email is required').isEmail().withMessage('Must be a valid email').normalizeEmail(),
    body('phone').exists().withMessage('Phone is required').isMobilePhone().withMessage('Must be a valid phone'),
    body('password').exists().withMessage('password is required').notEmpty().isLength({ min: 8 }).withMessage('Must be at least 8 chars long').isLength({ max: 10 }).withMessage('Password can contain max 10 chars'),
    body('role').optional().isIn([Role.Admin, Role.Manager, Role.Employee]).withMessage('Unauthorized user')
]

exports.updateUserSchema = [
    body('name').optional().isAlpha().isLength({ min: 3 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().isMobilePhone(),
    body('password').optional().notEmpty().isLength({ min: 6 }).isLength({ max: 10 }),
    body('role').optional().isIn([Role.Admin, Role.Manager, Role.Employee]),
    body().custom(value => {return !!Object.keys(value).length;}).custom(value => {
        const updates = Object.keys(value);
        const allowUpdates = ['name', 'email', 'password', 'phone', 'role'];
        return updates.every(update => allowUpdates.includes(update));
    })
]

exports.validateLogin = [
    body('email').exists().withMessage('Email is required').isEmail().withMessage('Must be a valid email').normalizeEmail(),
    body('password').exists().withMessage('Password is required').notEmpty().withMessage('Password must be filled')
]