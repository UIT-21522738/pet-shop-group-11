const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 1 customer
const customer = new Schema({
    lastName: String,
    firstName: String,
    phone: String,
    vip: Boolean,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', customer);