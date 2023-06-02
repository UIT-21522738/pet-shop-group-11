const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 
const Schedule = new Schema({
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    discount_percentage: Number,
});

module.exports = mongoose.model('Work Schedule', Schedule);