const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

// định nghĩa 
const salary = new Schema({
    staffId: String,
    totalShift: Number,
    mistake: Number,
    total_salary: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Salary managements', salary);