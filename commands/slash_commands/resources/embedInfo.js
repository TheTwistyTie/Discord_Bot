const {MessageEmbed} = require("discord.js");
const colorCheck = require('./colorCheck');

class EmbedInfo {
    index (string) {
        for(i = 1; i < this.#fieldsArray.length; i++) {
            if(this.#fieldsArray[i].name === `${string}`) return i;
        }
        return -1;
    }

    setName (name) {
        this.#fieldsArray[0].name = name
        console.log(this.#fieldsArray[0].name)
    }

    setDescription (description) {
        this.#fieldsArray[0].value = description
    }

    addPhoneNumber (number) {
        const result = this.index('Phone Number:')
        if(result !== -1) {
            this.#fieldsArray[result].value = number;
        } else {
            this.#fieldsArray.push({
                name: 'Phone Number:',
                value: number,
                inline: true,
            })
        }
    }

    addEmail (email) {
        const result = this.index('Email Address:')
        if(result !== -1) {
            this.#fieldsArray[result].value = email;
        } else {
            this.#fieldsArray.push({
                name: 'Email Address:',
                value: email,
                inline: true,
            })
        }
    }

    addAddress (address) {
        const result = this.index('Address:')
        if(result !== -1) {
            this.#fieldsArray[result].value = address;
        } else {
            this.#fieldsArray.push({
                name: 'Address:',
                value: address,
                inline: true,
            })
        }
    }

    submit (interaction) {
        //submit to database
    }

    constructor(resourceType, color)
    {
        this.#title = resourceType;
        this.#color = color
    }

    #color;
    #title;
    get resourceType() {
        return this.#title
    }

    #description = '\n\u200b';


    #image;
    setImage(value) {
        this.#image = value;
    }

    #url;
    setUrl(value) {
        this.#url = value;
    }

    #fieldsArray = [{
        name: 'Default Title.',
        value: "Default Description."
    }];

    getResourceName() {
        return this.#fieldsArray[0].name
    }
    getResourceDescription() {
        return this.#fieldsArray[0].value
    }

    buildEmbed() {
        let newEmbed = new MessageEmbed()
        .setColor(this.#color)
        .setDescription(this.#description)
        .setFields(this.#fieldsArray)

        if(typeof this.#title !== 'undefined'){
            newEmbed.setTitle(this.#title);
        } else {
            newEmbed.setTitle('Error setting title.');
        }

        if(typeof this.#url !== 'undefined'){
            newEmbed.setURL(this.#url);
        }

        if(typeof this.image !== 'undefined'){
            newEmbed.setImage(this.image);
        }

        return newEmbed
    }
}

module.exports = EmbedInfo;