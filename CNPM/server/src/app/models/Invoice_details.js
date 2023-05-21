const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 1 invoice detail
const invoice_detail = new Schema({
    invoiceId: String,
    productId: String,
    quantity: Number,
    price: Number,
});

module.exports = mongoose.model('Invoice_detail', invoice_detail);