const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
    guild_id: String,
    data: Object,
    resources: Array,
});

module.exports = mongoose.model("Providers", ProviderSchema);