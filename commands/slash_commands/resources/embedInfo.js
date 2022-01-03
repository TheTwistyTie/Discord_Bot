const resourseName = require("./resourceName");
const resourseDescription = require("./resourceDescription");
const addPhoneNumber = require("./addPhoneNumber");
const addEmail = require("./addEmail");
const addAddress = require("./addAddress");

class EmbedInfo {
    resources;
    title;
    description = '\n';
    image;
    url;
    fields = [{
        name: 'Default Title.',
        value: "Default Description."
    }];

    constructor(title, resources) {
        this.title = title;
        this.resources = resources;
    }

    get index (string) {
        for(i = 1; i < embedInfo.fields.length; i++) {
            if(embedInfo[i].name === `${string}`) return i;
        }
        return -1;
    }

    addUrl (interaction) {
        const command = require("./addUrl");
        return command(interaction)
    }

    addImage (interaction) {
        const command = require("./addImage");
        return command(interaction)
    }

    changeColor (interaction) {
        const command = require("./changeColor");
        return command(interaction)
    }

    resourseName
}