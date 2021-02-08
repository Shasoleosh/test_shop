const { Schema, model } = require('mongoose')

const schema = new Schema({
    login: String,
    password: String,
    group: String,
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const User = model('User', schema)

module.exports = User