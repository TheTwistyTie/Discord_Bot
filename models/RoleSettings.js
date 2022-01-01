const mongoose = require('mongoose');

const RoleSettingSchema = new mongoose.Schema({
    guild_id: String,
    GenderRoles: {
        he_him: {
            type: String,
            lowercase: true
        },
        other: {
            type: String,
            lowercase: true
        },
        she_her: {
            type: String,
            lowercase: true
        },
        they_them: {
            type: String,
            lowercase: true
        }
    },
    RegionRoles: []    
});

module.exports = mongoose.model("RoleSettings", RoleSettingSchema);