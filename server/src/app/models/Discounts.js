const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 
const Discount = new Schema({
    name: {type: String, unique: true},
    percent: {type: Number, set: function(v) {return parseFloat(v);}},
    creater: String,
    idCoupon: String,
    description: String,
    startDate: Date,
    endDate: Date,
});

module.exports = mongoose.model('Discounts', Discount);