const Model = require("../model/user.model")
const query = require('../db/db')

exports.Sitesettings = async (req, res, next) => {
    const ss = await Model.find({}, 'site_setting')
    const gs = await Model.find({}, 'sheet')
    const page = await Model.find({}, 'page')
    const site_setting = {
        site_settings: ss,
        google_sheet: gs,
        page,
    }
    res.status(200).json(site_setting)
}

exports.updateSiteSetting = async (req, res, next) => {
    const location = req.protocol + '://' + req.get('host') + "/media/image/";
    const restOfUpdates = req.body
    if (req.file) {
        restOfUpdates.site_logo = location + req.file.filename
    }

    const result = await Model.update(restOfUpdates, 1, 'site_setting');

    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? 'Site Settings not found' :
        affectedRows && changedRows ? 'Site Settings updated successfully' : 'Updated failed';

    res.send({ message, info });
}

exports.updateGS= async (req, res, next) => {
    const restOfUpdates = req.body;

    const result = await Model.update(restOfUpdates, 1, 'sheet');

    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? 'Google Sheet not found' :
        affectedRows && changedRows ? 'Google Sheet updated successfully' : 'Updated failed';

    res.send({ message, info });
}

exports.updatePages = async (req, res, next) => {
    const restOfUpdates = req.body;

    const result = await Model.update(restOfUpdates, 1, 'page');

    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? 'Pages not found' :
        affectedRows && changedRows ? 'Pages updated successfully' : 'Updated failed';

    res.send({ message, info });
}