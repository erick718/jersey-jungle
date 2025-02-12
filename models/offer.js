const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: {type: Number, required: [true, 'amount is required'], min: 0.01},
    status: {type: String, required: [true, 'status is required'],
            enum: ['pending', 'rejected', 'accepted'], default: 'pending'},
    item: {type: Schema.Types.ObjectId, ref:'Item'},
    buyer: {type: Schema.Types.ObjectId, ref:'User'}
})

//collection name is offers in the database
module.exports = mongoose.model('Offer', offerSchema);