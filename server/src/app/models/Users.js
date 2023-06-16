const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const user = new Schema({
    username: String,
    password: String,
    role: {type: String, default: 'nhân viên'},
    phoneNumber: {type: String, unique: true},
    firstName: String,
    lastName: String,
    code: String,
    birthday: Date,
    address: String,
    gender: String,
    salary: {type: Number, defaultValue: 100, set: function(val) { return parseInt(val, 10)}},
    shift: {type: Number, set: function (value) { return parseInt(value, 10);}},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = moongoose.model('User', user);