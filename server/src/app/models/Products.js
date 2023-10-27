const mongoose = require('mongoose'); // gọi các thư viện cần thiểt

const Schema = mongoose.Schema;

// định nghĩa 1 product
const product = new Schema({
    name: String,
    price: {type: Number, set: function (value) { return parseInt(value, 10);}},
    storage: {type: Number, set: function (value) { return parseInt(value, 10);}},
    typeId: String,
    description: String,
    brand: String,
    createrId: String,
    code: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', product);