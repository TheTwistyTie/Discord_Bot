const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    id: String,
    name: String,
    reports: [],
    automoderation: [],
});

module.exports = mongoose.model("Reports", ResourceSchema);