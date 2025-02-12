const express = require('express');
const controller = require('../controllers/itemController');
const offerRoutes = require('../routes/offerRoutes');
const {upload} = require('../middlewares/fileUpload');
const {isLoggedIn, isSeller} = require('../middlewares/auth');
const {validateId, validateItem, validateResults} = require('../middlewares/validator');

const router = express.Router();

//GET /items: send all items to the user
router.get('/', controller.index);

//GET /items/new: send html form for creating a new item
router.get('/new', isLoggedIn, controller.new);

//POST /items: create a new item
router.post('/', isLoggedIn, upload, validateItem, validateResults, controller.create);

//GET /items/:id: send details of item identified by id
router.get('/:id', validateId, controller.show);

//GET /items/:id/edit: send html form for editing an existing item
router.get('/:id/edit', validateId, isLoggedIn, isSeller, controller.edit);

//PUT /items/:id: update the item identified by id
router.put('/:id', validateId, upload, isLoggedIn, isSeller, validateItem, validateResults, controller.update);

//DELETE /items/:id, delete the item identified by id
router.delete('/:id', validateId, isLoggedIn, isSeller, controller.delete);

router.use('/:id/offers', offerRoutes);

module.exports = router;