const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 
const Schedule = new Schema({
    staffId: String,
    work_date: Number,
    work_month: Number,
    work_year: Number,
});

module.exports = mongoose.model('Work Schedule', Schedule);