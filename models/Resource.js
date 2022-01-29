const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    guild_id: String,
    data: Object,
});

module.exports = mongoose.model("Resource", ResourceSchema);

/*

    title: String,
    resourceType: String,
    color: String,
    image: String,
    thumbnail: String,
    url: String,
    fields: [],
    hours: Object,
    elegibility: Object,
    languages: Object,
    address: Object,
    email: Object,
    number: Object,
    description: Object,
    regions: [],
    regionText: String,
    timestamp: Date,

    */