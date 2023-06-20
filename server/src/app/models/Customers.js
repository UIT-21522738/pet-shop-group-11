const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 1 customer
const customer = new Schema({
    name: String,
    phoneNumber: {type: String, unique: true},
    vip: {type: Boolean, default: false},
    birthday: Date,
    gender: String,
    code: String,
    creater: String,
    scrore: {type: Number, default: 0, set: function(v) {return parseInt(v);}},
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', customer);