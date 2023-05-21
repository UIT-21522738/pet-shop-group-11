const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 1 invoice
const invoice = new Schema({
    CustomerId: String,
    staffId: String,
    totalPrice: Number,
    discount: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoice);