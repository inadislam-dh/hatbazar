const Model = require("../model/user.model")
const query = require('../db/db')

exports.Sliders = async (req, res, next) => {
    const sliders = await Model.find({}, 'sliders')
    res.status(200).json(sliders)
}

exports.orderById = async (req, res, next) => {
    let slider = await Model.findOne({ id: req.params.id }, 'sliders')
    if (!slider.length) {
        res.status(404).json({
            error: true,
            message: "No slider Found!!"
        })
    }
    res.status(200).json(slider)
}

exports.createSlider = async (req, res, next) => {
    const location = req.protocol + '://' + req.get('host') + "/media/image/";
    const sql = `INSERT INTO sliders (image, status) VALUES (?,?)`
    const result = query(sql, [location + req.file.filename, req.body.status])
    
    let affectedRows = result ? result.affectedRows : 0;

    if (affectedRows < 1) {
        res.status(500).json({
            error: true,
            message: "Something went wrong!"
        })
    }

    res.status(201).json({
        message: "Slider added succesfully!!"
    })
}

exports.updateSlider = async (req, res, next) => {
    const restOfUpdates = req.body;
    const dd = await Model.findOne({id: req.params.id}, 'sliders')

    const result = await Model.update(restOfUpdates, req.params.id, 'sliders');

    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? 'Slider not found' :
        affectedRows && changedRows ? 'Slider updated successfully' : 'Updated failed';

    res.send({ message, info });
}

exports.deleteSlider = async (req, res, next) => {
    const result = await Model.delete(req.params.id, 'sliders');
    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Slider not found!'
        })
    }
    res.status(201).json({message: 'Slider has been deleted'});
}