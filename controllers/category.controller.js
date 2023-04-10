const query = require('../db/db')
const Model = require("../model/user.model")
const { checkValidation } = require("./user.controller")

exports.Cat = async (req, res, next) => {
    let cat = await Model.find({}, 'category')
    if (!cat.length) {
        products = "No Category found"
    }
    res.status(200).json(cat)
}

exports.categoryById = async (req, res, next) => {
    let cat = await Model.findOne({ id: req.params.id }, 'category')
    if (!cat.length) {
        res.status(404).json({
            error: true,
            message: "No Category Found!!"
        })
    }
    res.status(200).json(cat)
}

exports.categoryByName = async (req, res, next) => {
    let cat = await Model.findOne({ id: req.params.catname }, 'category')
    if (cat.length < 1) {
        res.status(404).json({
            error: true,
            message: "No Category Found!!"
        })
    }
    res.status(200).json(cat)
}

exports.createCategory = (req, res, next) => {
    const sql = `INSERT INTO category (name, slug, status) VALUES (?,?,?)`
    const result = query(sql, [req.body.name, req.body.slug, req.body.status])
    
    let affectedRows = result ? result.affectedRows : 0;

    if (affectedRows < 1) {
        res.status(500).json({
            error: true,
            message: "Something went wrong!"
        })
    }

    res.status(201).json({
        message: "Category added succesfully!!"
    })
}

exports.updateCategory = async (req, res, next) => {
    const restOfUpdates = req.body;
    const result = await Model.update(restOfUpdates, req.params.id, 'category');

    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? 'Category not found' :
        affectedRows && changedRows ? 'Category updated successfully' : 'Updated failed';

    res.send({ message, info });
}

exports.deleteCategory = async (req, res, next) => {
    const result = await Model.delete(req.params.id, 'category');
    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Category not found!'
        })
    }
    res.status(201).json({message: 'Category has been deleted'});
}