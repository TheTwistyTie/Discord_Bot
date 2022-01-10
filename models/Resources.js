const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    guild_id: String,
    resources: [],
    types: [],
    languages: [],

});

module.exports = mongoose.model("Resources", ResourceSchema);