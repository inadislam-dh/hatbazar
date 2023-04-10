const query = require('../db/db')
const Model = require("../model/user.model")
const { checkValidation } = require("./user.controller")

exports.Products = async (req, res, next) => {
    let products = await Model.find({}, 'products')
    if (!products.length) {
        products = "No Product found"
    }
    res.status(200).json(products)
}

exports.productById = async (req, res, next) => {
    let product = await Model.findOne({ id: req.params.id }, 'products')
    if (product && product.length < 1) {
        res.status(404).json({
            error: true,
            message: "No Product Found!!"
        })
    }
    res.status(200).json(product)
}

exports.productByName = async (req, res, next) => {
    const sql = `SELECT * FROM products WHERE name LIKE '%${req.params.productname}%'`
    var result = await query(sql)
    let affectedRows = result ? result.affectedRows : 0;
    if (affectedRows < 1) {
        res.status(500).json({
            error: true,
            message: "Something went wrong!"
        })
    }
    if (result.length < 1) {
        res.status(404).json({
            error: true,
            message: "No Product Found!!"
        })
    }
    res.status(200).json(result)
}

exports.createProduct = async (req, res, next) => {
    const location = req.protocol + '://' + req.get('host') + "/media/image/";
    const sql = `INSERT INTO products (name, description, sku, sell_price, price, quantity, image, category, status) VALUES (?,?,?,?,?,?,?,?,?)`
    const result = await query(sql, [req.body.name, req.body.description, req.body.sku, req.body.sell_price, req.body.price, req.body.quantity, location + req.file.filename, req.body.category, req.body.status])


    let affectedRows = result ? result.affectedRows : 0;

    if (affectedRows < 1) {
        res.status(500).json({
            error: true,
            message: "Something went wrong!"
        })
    }

    res.status(201).json({
        message: "Product added succesfully!!"
    })
}

exports.updateProduct = async (req, res, next) => {
    const location = req.protocol + '://' + req.get('host') + "/media/image/";
    const restOfUpdates = req.body;
    if (req.file) {
        restOfUpdates.image = location + req.file.filename
    }
    const result = await Model.update(restOfUpdates, req.params.id, 'products');
    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;
    const message = !affectedRows ? 'Product not found' :
        affectedRows && changedRows ? 'Product updated successfully' : 'Updated failed';
    res.send({ message, info });
}

exports.deleteProduct = async (req, res, next) => {
    const result = await Model.delete(req.params.id, 'products');
    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Product not found!'
        })
    }
    res.status(201).json({message: 'Product has been deleted'});
}