const Model = require("../model/user.model");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('moment')

exports.getAllUsers = async (req, res, next) => {
    let userList = await Model.find({}, 'users');
    if (!userList.length) {
        res.status(404).json({
            error: true,
            message: 'User not found!'
        })
    }
    userList = userList.map(user => {
        const { password, ...userWithoutPass } = user
        return userWithoutPass
    })
    res.send(userList)
}

exports.getUserById = async (req, res, next) => {
    const user = await Model.findOne({ id: req.params.id }, 'users')
    if (!user) {
        res.status(404).json({
            error: true,
            message: 'User not found!'
        })
    }

    const { password, ...userWithoutPassword } = user;

    res.send(userWithoutPassword);
}

exports.getUserByEmail = async (req, res, next) => {
    const user = await Model.findOne({ email: req.params.email }, 'users')
    if (!user) {
        res.status(404).json({
            error: true,
            message: 'User not found'
        })
    }

    const { password, ...userWithoutPassword } = user;

    res.send(userWithoutPassword);
}

exports.getCurrentUser = async (req, res, next) => {
    const { password, ...userWithoutPassword } = req.currentUser;

    res.send(userWithoutPassword);
}

exports.createUser = async (req, res, next) => {
    await this.hashPassword(req)

    const result = await Model.create(req.body, 'users')
    if (result === "email_exist") {
        res.status(500).json({
            error: true,
            message: 'User already Exist!'
        })
    }
    if (!result) {
        res.status(500).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    res.status(201).json({
        message: 'User created succesfully!'
    })
}

exports.updateUser = async (req, res, next) => {
    this.checkValidation(req, res);

    await this.hashPassword(req);

    const restOfUpdates = req.body;

    const result = await Model.update(restOfUpdates, req.params.id, 'users');

    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? 'User not found' :
        affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

    res.send({ message, info });
}

exports.deleteUser = async (req, res, next) => {
    const result = await Model.delete(req.params.id, 'users');
    if (!result) {
        res.status(404).json({
            error: true,
            message: 'User not found!'
        })
    }
    res.status(201).json({message: 'User has been deleted'});
}

exports.userLogin = async (req, res, next) => {
    this.checkValidation(req, res);

    const { email, password: pass } = req.body;

    const user = await Model.findOne({ email }, 'users');

    if (!user) {
        res.status(401).json({
            error: true,
            message: 'Unable to login!'
        })
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
        res.status(401).json({
            error: true,
            message: 'Incorrect Password!'
        })
    }

    if (user.status === '0') {
        res.status(401).json({
            error: true,
            message: "Active your account first or contact admin."
        })
    }

    // user matched!
    const secretKey = process.env.APP_KEY || "";
    const token = jwt.sign({ user_id: user.id.toString(), user_email: user.email.toString() }, secretKey, {
        expiresIn: '1y'
    });

    let date = moment(new Date)
    res.cookie('token', token, {
        expiresIn: date.add(1, 'y'),
        httpOnly: true,
        sameSite: 'lax'
    })

    const { password, ...userWithoutPassword } = user;

    res.status(200).send({ ...userWithoutPassword, token });
};

exports.checkValidation = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({
            error: true,
            message: 'Validation failed!',
            data: errors,
        })
    }
}

exports.hashPassword = async (req) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
    }
}

exports.changePass = async (req, res, next) => {
    const user = await Model.findOne({ id: req.params.userid }, 'users');
    if (!user) {
        res.status(401).json({
            error: true,
            message: 'Unable to Change Password!'
        })
    }

    const isMatch = await bcrypt.compare(req.body.old_pass, user.password);

    if (!isMatch) {
        res.status(401).json({
            error: true,
            message: 'Incorrect Password!'
        })
    }

    await this.hashPassword(req);

    const result = await Model.update({password: req.body.password}, req.params.userid, 'users');

    if (!result) {
        res.status(404).json({
            error: true,
            message: 'Something went wrong!'
        })
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? 'User not found' :
        affectedRows && changedRows ? 'User Password changed successfully' : 'Updated faild';

    res.send({ message, info });
}

exports.userLogout = (req, res, next) => {
    var date = moment(new Date)
    res.cookie('token', "", {
        expiresIn: date.subtract(1, 'days'),
        httpOnly: true,
        sameSite: 'none'
    })
    res.status(201).json({
        "message": "success"
    })
}