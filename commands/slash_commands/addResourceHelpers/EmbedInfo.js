const {MessageEmbed} = require("discord.js");
const submitResource = require("./submitResource");

class EmbedInfo {
    index (string) {
        for(i = 1; i < this.#fieldsArray.length; i++) {
            if(this.#fieldsArray[i].name === `${string}`) return i;
        }
        return -1;
    }

    setName (name) {
        this.#fieldsArray[0].name = name
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

    addEligibility (Eligibility) {
        const result = this.index('Eligibility:')
        if(result !== -1) {
            this.#fieldsArray[result].value = Eligibility;
        } else {
            this.#fieldsArray.push({
                name: 'Eligibility:',
                value: Eligibility,
            })
        }
    }

    addOpenHours (Open) {
        const result = this.index('Open:')
        if(result !== -1) {
            this.#fieldsArray[result].value = Open;
        } else {
            this.#fieldsArray.push({
                name: 'Open:',
                value: Open,
            })
        }
    }

    addLanguages (Languages) {
        const result = this.index('Languages:')
        if(result !== -1) {
            this.#fieldsArray[result].value = Languages;
        } else {
            this.#fieldsArray.push({
                name: 'Languages:',
                value: Languages,
                inline: true,
            })
        }
    }

    submit (interaction) {
        const embedData = {
            resourceType: this.#title,
            description: this.#description,
            color: this.#color,
            image: this.#image,
            url: this.#url,
            fields: this.#fieldsArray,
            timestamp: new Date(),
        }

        submitResource(embedData, this.buildEmbed(true), interaction)
    }

    constructor(resourceType, color)
    {
        this.#title = resourceType;

        if(!color) {
            this.#color = '#ffffff'
        } else {
            this.#color = color
        }
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

    buildEmbed(final) {
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

        if(typeof this.#image !== 'undefined'){
            newEmbed.setImage(this.#image);
            newEmbed.setThumbnail(this.#image);
        }

        if(final){
            newEmbed.setTimestamp()
        }

        return newEmbed
    }
}

module.exports = EmbedInfo;