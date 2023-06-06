const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 
const salary = new Schema({
    staffId: String,
    totalShift: {type: Number, set: function (value) { return parseInt(value, 10);}},
    mistake: {type: Number, set: function (value) { return parseInt(value, 10);}},
    total_salary: {type: Number, set: function (value) { return parseInt(value, 10);}},
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Salary managements', salary);