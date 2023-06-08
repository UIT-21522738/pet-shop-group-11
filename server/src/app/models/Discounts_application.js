const mongoose = require('mongoose'); // gọi các thư viện cần thiểtgit 

const Schema = mongoose.Schema;

// định nghĩa 
const Discounts_app = new Schema({
    discountId: String,
    productId: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Discount applications', Discounts_app);