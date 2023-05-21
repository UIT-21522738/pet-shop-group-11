const mongoose = require('mongoose'); // gọi các thư viện cần thiểt
const slug = require('mongoose-slug-generator');

//cài plugin slug
mongoose.plugin(slug);

const Schema = mongoose.Schema;

// định nghĩa 1 product
const product = new Schema({
    name: String,
    price: Number,
    storage: Number,
    type_id: String,
    description: String,
    img: String,
    code: String,
    slug: { type: String, slug: "name", unique: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', product);