const mongoose = require('mongoose'); // gọi các thư viện cần thiểtgit 

const Schema = mongoose.Schema;

// định nghĩa 
const Schedule = new Schema({
    discountId: String,
    productId: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Work Schedule', Schedule);