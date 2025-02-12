const model = require('../models/item');
const Offer = require('../models/offer');

exports.index = (req, res, next) => {
    //res.send('Send all items');
    let query = req.query.search;
    console.log(query);
    let fitler = {active: true};
    if(query){
        fitler = {
            $or: [
                {title: {$regex: query, $options: 'i'} },
                {details: {$regex: query, $options: 'i'} }
            ]
        };
    }
    model.find(fitler).sort({ price: 1 })
    .then(items => {
        console.log(items);
        res.render('./item/index', {items});
    })
    .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./item/new');
};

exports.create = (req, res, next) => {
    //res.send('Created a new item');
    let item = new model(req.body);
    item.seller = req.session.user;
    item.image = '/images/' + req.file.filename;
    item.active = true;
    item.save()
    .then(result => {
        req.flash('success', 'Your item was created successfully!');
        res.redirect('/items');
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    //res.send('Send item with id ' + req.params.id);
    let id = req.params.id;
    
    model.findById(id).populate('seller', 'firstName lastName')
    .then(item => {
        if(item) {
            console.log(item);
            return res.render('./item/show', {item})
        } else {
            let err = new Error('Cannot find item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(item => res.render('./item/edit', {item}))
    .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let item = req.body;
    let id = req.params.id;

    console.log(req.body);
    console.log(req.file);
    if (req.file){
        item.image = '/images/' + req.file.filename;
    }
    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item => {
        req.flash('success', 'Your item was updated successfully!');
        res.redirect('/items/' + id);
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;

    Promise.all([model.findByIdAndDelete(id), Offer.deleteMany({item: id})])
    .then(item => {
        req.flash('success', 'Your item was deleted successfully!');
        res.redirect('/items');
    })
    .catch(err => next(err));
};