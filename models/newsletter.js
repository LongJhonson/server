const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const NewsletterSchema = Schema({
    // email: {
    //     tipe: String,
    //     unique: true
    // }
    email: String
})

module.exports = mongoose.model("Newsletter", NewsletterSchema);