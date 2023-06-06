const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 
const Schedule = new Schema({
    staffId: String,
    work_date: {type: Number, set: function (value) { return parseInt(value, 10);}},
    work_month: {type: Number, set: function (value) { return parseInt(value, 10);}},
    work_year: {type: Number, set: function (value) { return parseInt(value, 10);}},
});

module.exports = mongoose.model('Work Schedule', Schedule);