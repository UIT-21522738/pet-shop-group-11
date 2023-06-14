const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://21522738:p12345678@cluster0.tcpoibe.mongodb.net/Petshop');
        console.log('connect success')
    } catch (error) {
        console.log('connect failure');
        console.log(error)
    }
}

module.exports = { connect }