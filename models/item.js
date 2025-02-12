const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: [true, 'Title is required']},
    condition: {type: String, required: [true, 'Condition is required'],
                enum: ['New', 'Like New', 'Good', 'Lightly Worn', 'Used']},
    seller: {type: Schema.Types.ObjectId, ref:'User'},
    price: {type: Number, required: [true, 'Price is required'], min: 0.01},
    details: {type: String, required: [true, 'Details is required'], 
                minLength: [10, 'The details should be at least 10 characters']},
    image: {type: String, required: [true, 'Image is required']},
    active: {type: Boolean, default: true},
    totalOffers: {type: Number, default: 0},
    highestOffer: {type: Number, default: 0}
});

//collection name is items in the database
module.exports = mongoose.model('Item', itemSchema);