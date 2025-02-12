const express = require('express');
const controller = require('../controllers/offerController');
const {isLoggedIn, isNotSeller, isSeller} = require('../middlewares/auth');

const router = express.Router({mergeParams: true});

router.post('/', isLoggedIn, isNotSeller, controller.create);

router.get('/', isLoggedIn, isSeller, controller.show);

router.put('/:offerId', isLoggedIn, isSeller, controller.update);

module.exports = router;