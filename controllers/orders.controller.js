const Model = require("../model/user.model")
const query = require('../db/db')

exports.Orders = async (req, res, next) => {
    const order = await Model.find({}, 'user_order')
    let proce = []
    let pendi = []
    let hold = []
    let cance = []
    let compl = []
    const h = Object.values(order)
    for (let i = 0; i <= h.length-1; i++) {
        if (h[i].status === "completed") {
            compl.push(h[i])
        }
        if (h[i].status === "processing") {
            proce.push(h[i])
        }
        if (h[i].status === "pending payment") {
            pendi.push(h[i])
        }
        if (h[i].status === "hold") {
            hold.push(h[i])
        }
        if (h[i].status === "canceled") {
            cance.push(h[i])
        }
    }
    const ord = {
        orders: order,
        total_order: !order.length ? 0 : order.length,
        total_processing: !proce.length ? 0 : proce.length,
        total_pending: !pendi.length ? 0 : pendi.length,
        total_hold: !hold.length ? 0 : hold.length,
        total_cancel: !cance.length ? 0 : cance.length,
        total_completed: !compl.length ? 0 : compl.length,
    }
    res.status(200).json(ord)
}

exports.orderById = async (req, res, next) => {
    let order = await Model.findOne({ id: req.params.id }, 'user_order')
    if (order.length < 1) {
        res.status(404).json({
            error: true,
            message: "No Order Found!!"
        })
    }
    res.status(200).json(order)
}

exports.createOrder = async (req, res, next) => {
    const r = req.body
    let inv = Math.floor(1000 + Math.random() * 9000)
    const sql = `INSERT INTO user_order (invoice, customer_name, customer_phone, customer_address, products, subtotal, delivery_charge, total) VALUES (?,?,?,?,?,?,?,?)`
    const resp = await query(sql, ["INV"+inv, r.customer_name, r.customer_phone, r.customer_address, r.products, r.subtotal, r.delivery_charge, r.total])
    let affectedRows = resp ? resp.affectedRows : 0;

    if (affectedRows < 1) {
        res.status(500).json({
            error: true,
            message: "Something went wrong!"
        })
    }

    res.status(201).json({
        message: "Order added succesfully!!"
    })
}

exports.updateOrder = async (req, res, next) => {
    const restOfUpdates = req.body;

    const result = await Model.update(restOfUpdates, req.params.id, 'user_order');
    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? 'Order not found' :
        affectedRows && changedRows ? 'Order updated successfully' : 'Updated failed';

    res.send({ message, info });
}

exports.deleteOrder = async (req, res, next) => {
    const result = await Model.delete(req.params.id, 'user_order');
    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Order not found!'
        })
    }
    res.status(201).json({message: 'Order has been deleted'});
}