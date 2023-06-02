const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const Schema = mongoose.Schema;

// định nghĩa 
const facilities = new Schema({
    name: String,
    description: String,
    quantity: Number,
    location: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('facilities', facilities);