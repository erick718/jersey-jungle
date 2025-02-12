const model = require('../models/offer');
const Item = require('../models/item');

exports.create = (req, res, next) => {
    let id = req.params.id;
    let offer = new model(req.body);
    offer.buyer = req.session.user;
    Item.findById(id)
    .then(item => {
        offer.item = item; 
        offer.save()
        .then(() => {
            //console.log(offer);
            Item.findByIdAndUpdate(id, {$inc: {totalOffers: 1}, $max: {highestOffer: offer.amount}})
            .then(() => res.redirect('/items/' + id))
            .catch(err => next(err));
        })
        .catch(err => next(err));
        })
    .catch(err => next(err));
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    Promise.all([Item.findById(id), model.find({item: id}).populate('item', 'title').populate('buyer', 'firstName lastName')])
    .then(results => {
        const [item, offers] = results;
        res.render('./offer/offers', {offers, item})
    })
    .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let id = req.params.id;
    let offerId = req.params.offerId;

    Promise.all([Item.findById(id), model.find({item: id})])
    .then(results => {
        const [item, offers] = results;
        offers.forEach(offer => {
            if(offer.id == offerId) {
                //console.log(offer);
                offer.status = 'accepted';
            } else {
                //console.log(offer);
                offer.status = 'rejected';
            }
            offer.save();
        })
        item.active = false;
        item.save();
        console.log(item);
        res.redirect('/items/' + id + '/offers?');
    })
    .catch(err => next(err));
};