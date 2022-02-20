const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guild_id: String,
    welcome_channel_id: String,
    welcome_message: Object,
    resourceAdder: Array,
});

module.exports = mongoose.model("GuildSettings", GuildSettingsSchema);