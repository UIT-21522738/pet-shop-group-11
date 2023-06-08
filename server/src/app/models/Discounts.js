const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 
const Discount = new Schema({
    name: {type: String, unique: true},
    description: String,
    startDate: Date,
    endDate: Date,
    discount_percentage: {type: Number, set: function(v) {return parseFloat(v);}}
});

module.exports = mongoose.model('Discounts', Discount);