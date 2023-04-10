const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const Model = require('../model/user.model')
dotenv.config()

const isAuth = (...roles) => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization
            const bearer = 'Bearer '

            if (!authHeader || !authHeader.startsWith(bearer)) {
                err = new Error('Access denied. no credentials sent!')
                res.status(401).json({
                    error: true,
                    message: err,
                })
            }

            const token = authHeader.replace(bearer, '')
            const secretkey = process.env.APP_KEY

            const decoded = jwt.verify(token, secretkey, (err, dd) => {
                if (err) {
                    return "token expired"
                }
                return dd
            })

            if (decoded === "token expired") {
                return res.status(401).json({
                    error: true,
                    message: "token expired"
                })
            }

            const user = await Model.findOne({ id: decoded.user_id }, 'users')

            if (!user) {
                err = new Error('Authorization failed!')
                res.status(401).json({
                    error: true,
                    message: err,
                })
            }

            const ownerAuthorized = req.params.id === user.id

            if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
                err = new Error('Unauthorized!')
                res.status(401).json({
                    error: true,
                    message: err,
                })
            }

            req.currentUser = user
            next()

        } catch(e) {
            e.status = 401
            next(e)
        }
    }
}

module.exports = isAuth