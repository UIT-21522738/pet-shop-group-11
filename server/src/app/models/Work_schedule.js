const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 
const Schedule = new Schema({
    staffId: String,
    work_date: Number,
    work_month: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Work Schedule', Schedule);