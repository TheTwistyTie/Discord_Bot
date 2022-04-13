const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
    guild_id: String,
    data: {
        title: String,
        description: String,
        thumbnail: String,
        url: String,
        color: String,
        fields: Array,
        hours: Object,
        languages: Object,
        address: Object,
        email: Object,
        number: Object,
        regions: Array,
        regionText: String,
        timestamp: Date,
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
    resources: Array,
});

module.exports = mongoose.model("Providers", ProviderSchema);