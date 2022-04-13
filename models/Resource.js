const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    guild_id: String,
    data: {
        title: String,
        resourceType: String,
        color: String,
        image: String,
        thumbnail: String,
        url: String,
        fields: Array,
        hours: Object,
        elegibility: Object,
        languages: Object,
        address: Object,
        email: Object,
        number: Object,
        description: Object,
        regions: Array,
        regionText: String,
        timestamp: Date,
        providerName: String,
    },
    ratings: [{
        user_id: String,
        user_name: String,
        avgRating: Number,
        numRating: Number,
        stringRating: String,
        prevReviews: [{
            numRating: Number,
            stringRating: String
        }]
    }],
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