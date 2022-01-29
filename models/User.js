const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    id: String,
    name: String,
    reports: {
        userReports: [],
        automoderation: [],
    },
    //An Array of the titles of the resouces the user wishes to save. 
    //Since a resource can be edited and we want a user to always have the most up to date information
    //As well as resources not having a consistant index, title will be searched for when looking up saved resources.
    savedResources: []
});

module.exports = mongoose.model("User", ResourceSchema);