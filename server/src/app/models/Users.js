const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const user = new Schema({
    username: String,
    password: String,
    role: String,
    phoneNumber: {type: String, unique: true},
    firstName: String,
    lastName: String,
    address: String,
    salary: {type: Number, defaultValue: 100, set: function(val) { return parseInt(val, 10)}},
    shift: {type: Number, set: function (value) { return parseInt(value, 10);}},
})

module.exports = moongoose.model('User', user);