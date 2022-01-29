const {MessageEmbed} = require("discord.js");
const submitResource = require("./submitResource");

const buildEmbed = require('./buildEmbed');
const buildPreviewEmbed = require('./buildPreviewEmbed');

const Resources = require("../../models/ResourceSettings");

class EmbedInfo {
    constructor(resourceType, color) {
        this.#resourceType = resourceType;

        if(!color) {
            this.#color = '#ffffff'
        } else {
            this.#color = color
        }
    }

    #resourceType
    #title = 'Unnamed';
    #description = '\u200b';
    #color;
    #image;
    #thumbnail;
    #url;
    #regionText;
    #regionArray = [];

    #OpenHours = {
        name: 'Open:',
    }
    #Elegibility = {
        name: 'Eligibility:',
    }
    #Languages = {
        name: 'Languages:',
    }
    #Address = {
        name: 'Address:',
    }
    #Email = {
        name: 'Email Address:',
    }
    #Number = {
        name: 'Phone Number:',
    }
    #Description = {
        name: 'Description:',
        value: 'Default Description.',
    }

    inLine = false;

    get ResourceName() {
        return this.#title
    }
    get ResourceType() {
        return this.#resourceType
    }
    get ResourceDescription() {
        return this.#Description.value
    }
    GetFields() {
        let fields = [
            this.#Description
        ];

        if(this.HasNumber()) {
            fields.push(this.#Number)
        }

        if(this.HasEmail()) {
            fields.push(this.#Email)
        }

        if(this.HasAddress()) {
            fields.push(this.#Address)
        }

        if(this.HasLanguages()) {
            fields.push(this.#Languages)
        }

        if(this.HasElegibility()) {
            fields.push(this.#Elegibility)
        }

        if(this.HasOpenHours()) {
            fields.push(this.#OpenHours)
        }

        return fields
    }
    
    HasImage() {
        if(typeof this.#image === 'undefined') {
            return false
        }
        return true
    }
    HasThumbnail() {
        if(typeof this.#thumbnail === 'undefined') {
            return false
        } 
        return true
    }
    HasURL() {
        if(typeof this.#url === 'undefined') {
            return false
        }
        return true
    }
    HasNumber () {
        if(typeof this.#Number.value !== 'undefined') {
            return true;
        }
        return false
    }
    HasEmail() {
        if(typeof this.#Email.value !== 'undefined') {
            return true;
        }
        return false
    }
    HasAddress() {
        if(typeof this.#Address.value !== 'undefined') {
            return true;
        }
        return false
    }
    HasLanguages() {
        if(typeof this.#Languages.value !== 'undefined') {
            return true;
        }
        return false
    }
    HasElegibility() {
        if(typeof this.#Elegibility.value !== 'undefined') {
            return true;
        }
        return false
    }
    HasOpenHours() {
        if(typeof this.#OpenHours.value !== 'undefined') {
            return true;
        }
        return false
    }
    HasRegions () {
        if(this.#regionArray.length > 0) {
            return true
        }
        return false
    }

    setImage(value) {
        this.#image = value;
    }
    setThumbnail(value) {
        this.#thumbnail = value;
    }
    setUrl(value) {
        this.#url = value;
    }
    setName (name) {
        this.#title = name
    }
    setDescription (description) {
        this.#Description.value = description
    }

    addPhoneNumber (Number) {
        this.#Number['value'] = Number
    }
    addEmail (Email) {
        this.#Email['value'] = Email
    }
    addAddress (Address) {
        this.#Address['value'] = Address
    }
    addLanguages (Languages) {
        this.#Languages['value'] = Languages
    }
    addEligibility (Eligibility) {
        this.#Elegibility['value'] = Eligibility
    }
    addOpenHours (Open) {
        this.#OpenHours['value'] = Open
    }
    addRegions (Regions) {
        this.#regionArray = Regions;

        this.#regionText = 'Regions: '
        for(i = 0; i < Regions.length - 1; i++) {
            this.#regionText += Regions[i] + ', '
        }
        this.#regionText += Regions[Regions.length - 1]
    }

    toggleInline() {
        this.inLine = !this.inLine

        this.#Number.inline = this.inLine
        this.#Email.inline = this.inLine
        this.#Address.inline = this.inLine
        this.#Languages.inline = this.inLine
    }

    buildEmbed() {
        const fields = this.GetFields()

        const embedData = {
            title: this.#title,
            resourceType: this.#resourceType,
            color: this.#color,
            image: this.#image,
            thumbnail: this.#thumbnail,
            url: this.#url,
            fields: fields,
            hours: this.#OpenHours,
            elegibility: this.#Elegibility,
            languages: this.#Languages,
            address: this.#Address,
            email: this.#Email,
            number: this.#Number,
            description: this.#Description,
            regions: this.#regionArray,
            regionText: this.#regionText,
            timestamp: new Date(),
        }

        return [buildEmbed(embedData)]
    }

    async submit (interaction) {
        const fields = this.GetFields()

        if(!this.HasRegions()) {
            let resources = await Resources.findOne({guild_id: interaction.guild.id});
            this.addRegions(resources.regions)
        }

        const embedData = {
            title: this.#title,
            resourceType: this.#resourceType,
            color: this.#color,
            image: this.#image,
            thumbnail: this.#thumbnail,
            url: this.#url,
            fields: fields,
            hours: this.#OpenHours,
            elegibility: this.#Elegibility,
            languages: this.#Languages,
            address: this.#Address,
            email: this.#Email,
            number: this.#Number,
            description: this.#Description,
            regions: this.#regionArray,
            regionText: this.#regionText,
            timestamp: new Date(),
        }

        submitResource(embedData, buildEmbed(embedData), buildPreviewEmbed(embedData), interaction)
    }
}

module.exports = EmbedInfo;