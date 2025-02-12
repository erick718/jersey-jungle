const model = require('../models/user');
const Item = require('../models/item');
const Offer = require('../models/offer');

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new model(req.body);
    console.log(req.body);
    user.save()
    .then(user => {
        req.flash('success', 'Registration succeeded');
        res.redirect('/users/login');
    })
    .catch(err =>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }       
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
};

exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if(user) {
            user.comparePassword(password)
            .then(result => {
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                } else {
                    console.log('wrong password');
                    req.flash('error', 'Wrong password!');
                    res.redirect('/users/login');
                }
            })
        } else {
            console.log('wrong email address');
            req.flash('error', 'Wrong email address!');
            res.redirect('/users/login');
        }
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Item.find({seller: id}), Offer.find({buyer: id}).populate('item', 'id title')])
    .then(results => {
        const [user, items, offers] = results;
        console.log(offers);
        res.render('./user/profile', {user, items, offers});
    })
    .catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    })
};