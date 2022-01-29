const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    guild_id: String,
    types: [],
    languages: [],
    regions: [],
});

module.exports = mongoose.model("ResourceSettings", ResourceSchema);