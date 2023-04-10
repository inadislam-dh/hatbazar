const Model = require("../model/user.model")
const query = require('../db/db')

exports.Shippings = async (req, res, next) => {
    const shipping = await Model.find({}, 'shipping')
    res.status(200).json(shipping)
}

exports.orderById = async (req, res, next) => {
    let shipping = await Model.findOne({ id: req.params.id }, 'shipping')
    if (!shipping.length) {
        res.status(404).json({
            error: true,
            message: "No shipping Found!!"
        })
    }
    res.status(200).json(shipping)
}

exports.createShipping = async (req, res, next) => {
    const sql = `INSERT INTO shipping (type, text, amount, status) VALUES (?,?,?,?)`
    const result = query(sql, [req.body.type, req.body.text, req.body.amount, req.body.status])
    
    let affectedRows = result ? result.affectedRows : 0;

    if (affectedRows < 1) {
        res.status(500).json({
            error: true,
            message: "Something went wrong!"
        })
    }

    res.status(201).json({
        message: "Shipping added succesfully!!"
    })
}

exports.updateShipping = async (req, res, next) => {
    const restOfUpdates = req.body;

    const result = await Model.update(restOfUpdates, req.params.id, 'shipping');

    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? 'Shipping not found' :
        affectedRows && changedRows ? 'Shipping updated successfully' : 'Updated failed';

    res.send({ message, info });
}

exports.deleteShipping = async (req, res, next) => {
    const result = await Model.delete(req.params.id, 'shipping');
    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Shipping not found!'
        })
    }
    res.status(201).json({message: 'Shipping has been deleted'});
}