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
    salary: String,
    shift: Number,
})

module.exports = moongoose.model('User', user);