const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const Schema = mongoose.Schema;

// định nghĩa 
const facilities = new Schema({
    name: { type: String, unique: true },
    description: String,
    code: String,
    quantity: {type: Number, set: function (value) { return parseInt(value, 10);}},
    location: String,
    creater: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('facilities', facilities);