const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: String,
    description: String,
    articule: String,
    type: String,
    createDate: Date,
    color: String,
    image: String,
    price: Number
})

const Product = model('Product', schema)

module.exports = Product