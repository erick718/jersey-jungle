const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;

    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
};

exports.validateSignUp = [body('firstName', 'First name can not be empty').notEmpty().trim().escape(),
body('lastName', 'Last name can not be empty').notEmpty().trim().escape(),
body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateResults = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

exports.validateItem = [body('title', 'Title can not be empty').notEmpty().trim().escape(),
body('condition', 'Condition can not be empty').notEmpty().trim().escape().isIn(['New', 'Like New', 'Good', 'Lightly Worn', 'Used']),
body('price', 'Price can not be empty').notEmpty().trim().escape().isCurrency(),
body('details', 'The details must be at least 10 characters').trim().escape().isLength({min: 10}),];
