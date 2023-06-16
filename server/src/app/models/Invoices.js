const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 1 invoice
const invoice = new Schema({
    customerId: String,
    staffId: String,
    
    totalPrice: {type: Number, set: function (value) { return parseInt(value, 10);}},
    discount: {type: Number, set: function (value) { return parseInt(value, 10);}},
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoice);