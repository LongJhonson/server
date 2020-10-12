const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MenuSchema = schema({
    title: String,
    url: String,
    order: Number,
    active: Boolean
});

module.exports = mongoose.model("Menu", MenuSchema);