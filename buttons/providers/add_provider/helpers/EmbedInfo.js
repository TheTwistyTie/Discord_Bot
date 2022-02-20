const buildEmbed = require('./buildEmbed');
const buildPreviewEmbed = require('./buildPreviewEmbed');

class EmbedInfo {
    constructor(providerName) {
        this.#providerName = providerName
    }

    #providerName;
    #description = 'Default Description.';
    get Description () {
        return this.#description
    }
    
    #url;
    #thumbnail;
    #regionText;
    #regionArray = [];

    #OpenHours = {
        name: 'Open:',
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

    setThumbnail(value) {
        this.#thumbnail = value;
    }
    setUrl(value) {
        this.#url = value;
    }
    setDescription (description) {
        this.#description = description
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

    HasDescription() {
        if(typeof this.#description === 'undefined') {
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
    HasThumbnail() {
        if(typeof this.#thumbnail === 'undefined') {
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

    buildEmbed() {
        const fields = this.GetFields()

        const embedData = {
            title: this.#providerName,
            description: this.#description,
            //color: this.#color,
            thumbnail: this.#thumbnail,
            url: this.#url,
            fields: fields,
            hours: this.#OpenHours,
            languages: this.#Languages,
            address: this.#Address,
            email: this.#Email,
            number: this.#Number,
            regions: this.#regionArray,
            regionText: this.#regionText,
        }

        return [buildEmbed(embedData)]
    }

    GetFields() {
        let fields = [];

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

        if(this.HasOpenHours()) {
            fields.push(this.#OpenHours)
        }

        return fields
    }

    toggleInline() {
        this.inLine = !this.inLine

        this.#Number.inline = this.inLine
        this.#Email.inline = this.inLine
        this.#Address.inline = this.inLine
        this.#Languages.inline = this.inLine
    }
}

module.exports = EmbedInfo;