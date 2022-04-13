const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const buildPreviewEmbed = require("../../add_provider/helpers/buildPreviewEmbed");
const createProvider = require("../../add_provider/helpers/createProvider");
const EmbedInfo = require('../../add_provider/helpers/EmbedInfo')
const UserData = require('../../../../models/User');
const GuildSettings = require('../../../../models/GuildSettings')
const Resources = require('../../../../models/Resource')
const rateResource = require('./rateProvider');
const buildEmbed = require("../../add_provider/helpers/buildEmbed");
const buildResourceEmbed = require('../../../resources/add_resource/helpers/buildEmbed');
const seeRatings = require("../../../resources/find_resource/helpers/seeRatings");

class ResourceObject {
    #userData
    #guild

    embedData
    #fullEmbed
    #previewEmbed
    #index
    #ratings

    #resourceNameList
 
    #resourceEmbed
    #resouceSaved = false;
    #resourceName
    #resourceType

    constructor (embedObject, index, guild) {
        this.embedData = embedObject.data
        this.#resourceNameList = embedObject.resources
        this.#index = index;
        this.#guild = guild

        this.#previewEmbed = buildPreviewEmbed(embedObject.data)
        this.#fullEmbed = buildEmbed(embedObject.data);

        this.#ratings = embedObject.ratings;
    }

    message;
    showingFullEmbed = false;
    showingResourceEmbed = false;
    async addMessage (channel, userId) {
        if(!this.#userData) {
            this.#userData = await UserData.findOne({id: userId})

            if(!this.#userData) {
                this.#userData = new UserData({
                    id: userId,
                    name: btn.user.name,
                    savedResources: [],
                    savedProviders: [],
                })
            }
        }

        let saveButton;
        if(this.isSaved(this.#userData.savedProviders)) {
            saveButton = new MessageButton()
                .setLabel('Saved')
                .setCustomId('save')
                .setStyle('SECONDARY')
        } else {
            saveButton = new MessageButton()
                .setLabel('Save')
                .setCustomId('save')
                .setStyle('PRIMARY')
        }

        const row = new MessageActionRow()
            .addComponents(
                saveButton,
                new MessageButton()
                    .setLabel('See More:')
                    .setCustomId('toggle_view')
                    .setStyle('PRIMARY'),
            )

        row.addComponents(
            new MessageButton()
                .setLabel('Rate Resource')
                .setCustomId('rateResource')
                .setStyle('SUCCESS')
        )

        if(this.#ratings.length >= 1) {
            row.addComponents(
                new MessageButton()
                    .setLabel('See Reviews')
                    .setCustomId('seeRatings')
                    .setStyle('PRIMARY')
            )
        }

        let comps = [row]

        if(this.#resourceNameList.length > 0) {
            let resouceOptions = [];
            for(let i = 0; i < this.#resourceNameList.length; i++) {
                resouceOptions.push({
                    label: this.#resourceNameList[i].title + " | " + this.#resourceNameList[i].type,
                    value: this.#resourceNameList[i].title
                })
            }

            let resourceSelectRow = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('resourceSelectMenu')
                        .setPlaceholder('View one this provider\'s resources.')
                        .setOptions(resouceOptions)
                )

            comps.push(resourceSelectRow)
        }

        this.message = await channel.send({
            content: this.embedData.title + ':',
            embeds: [this.#previewEmbed],
            components: comps,
            fetchReply: true,
        })

        const filter = (int) => {
            return int.user.id == userId;
        }

        const btnCollector = this.message.createMessageComponentCollector({
            filter,
        })

        btnCollector.on('collect', async (btn) => {
            switch (btn.customId) {
                case 'toggle_view':
                    if(!this.showingFullEmbed) {
                        this.showingFullEmbed = true;
                    } else {
                        this.showingFullEmbed = false;
                    }

                    this.refreshMessage()
                    this.interactionReply(btn)
                    break;

                case 'save' :
                    if(this.showingResourceEmbed) {
                        if(this.#resouceSaved) {
                            const index = this.#userData.savedResources.indexOf(this.#resourceName);
                            this.#userData.savedResources.splice(index, 1);
                        } else {
                            if(typeof this.#userData.savedResources == 'undefined') {
                                this.#userData.savedResources = []
                            }
                            this.#userData.savedResources.push({
                                title: this.#resourceName,
                                type: this.#resourceType
                            })
                        }

                        this.#resouceSaved = !this.#resouceSaved
                    } else {
                        if(this.#saved) {
                            const index = this.#userData.savedProviders.indexOf(this.embedData.title);
                            this.#userData.savedProviders.splice(index, 1);
                        } else {
                            if(typeof this.#userData.savedProviders === 'undefined') {
                                this.#userData.savedProviders = []
                            }
                            this.#userData.savedProviders.push(this.embedData.title)
                        }

                        this.#saved = !this.#saved
                    }

                    this.#userData.save(err => {
                        if(err) {
                            console.log(err);
                            return;
                        }
                    })

                    this.refreshMessage()
                    this.interactionReply(btn)
                    break;

                case 'edit' :
                    let embedDataObj = new EmbedInfo()
                    embedDataObj.setData(this.embedData, this.#guild, this.#index)
                    createProvider(this.embedData.resourceType, btn, embedDataObj.Guild, embedDataObj, true)
                    break;

                case 'resourceSelectMenu' :
                    this.showingResourceEmbed = true;

                    if(this.showingResourceEmbed) {
                        let resourceList = await Resources.find({guild_id: this.#guild.id})

                        let resource;
                        for(let i = 0; i < resourceList.length; i++) {
                            if(typeof resourceList[i].data.providerName !== 'undefined') {
                                if(resourceList[i].data.providerName == this.embedData.title) {
                                    if(resourceList[i].data.title == btn.values[0]) {
                                        resource = resourceList[i]
                                    }
                                }
                            }
                        }

                        this.#resourceEmbed = buildResourceEmbed(resource.data);
                        this.#resourceName = resource.data.title;
                        this.#resourceType = resource.data.resourceType;

                        let savedResources = this.#userData.savedResources
                        for(let i = 0; i < savedResources.length; i++) {
                            if(savedResources[i].title == this.#resourceName 
                                && savedResources[i].type == this.#resourceType) {
                                    this.#resouceSaved = true;
                            } else {
                                this.#resouceSaved = false;
                            }
                        }

                        this.refreshMessage()
                        this.interactionReply(btn)
                    }
                    break;

                case 'return_to_provider' :
                    this.showingResourceEmbed = false;
                    this.#resouceSaved = false;
                    this.#resourceEmbed = null;
                    this.#resourceName = null;
                    this.#resourceType = null;

                    this.refreshMessage()
                    this.interactionReply(btn)

                    break;

                case 'rateResource' :
                    rateResource(btn, this.embedData, this.#guild)
                    break;
                case 'seeRatings' :
                    seeRatings(btn, this.#ratings);
                    break;
            }
        })
    }
    /*
        This message has 
            base: 4 buttons
            see more: 4 buttons
    */
    refreshMessage() {
        let comps = []
        let embedArray = []

        const newRow = new MessageActionRow()

        if(!this.showingResourceEmbed) {

            if(this.#saved){
                newRow.addComponents( 
                    new MessageButton()
                        .setLabel('Saved')
                        .setCustomId('save')
                        .setStyle('SECONDARY')
                    )
            } else {
                newRow.addComponents( 
                    new MessageButton()
                        .setLabel('Save')
                        .setCustomId('save')
                        .setStyle('PRIMARY')
                    )
            }

            if(this.showingFullEmbed) {
                embedArray.push(this.#fullEmbed)
                newRow.addComponents( 
                    new MessageButton()
                        .setLabel('See Less:')
                        .setCustomId('toggle_view')
                        .setStyle('PRIMARY')
                    )

                if(canAddNew(this.#guild, this.#userData.id)) {
                    newRow.addComponents(
                        new MessageButton()
                            .setLabel('Edit Provider')
                            .setCustomId('edit')
                            .setStyle('DANGER')
                    )
                }
            } else {
                embedArray.push(this.#previewEmbed)
                newRow.addComponents( 
                    new MessageButton()
                        .setLabel('See More:')
                        .setCustomId('toggle_view')
                        .setStyle('PRIMARY')
                    )
            }

            newRow.addComponents(
                new MessageButton()
                    .setLabel('Rate Provider')
                    .setCustomId('rateResource')
                    .setStyle('SUCCESS')
            )

            if(this.#ratings.length >= 1) {
                newRow.addComponents(
                    new MessageButton()
                        .setLabel('See Reviews')
                        .setCustomId('seeRatings')
                        .setStyle('PRIMARY')
                )
            } 

        } else {
            if(this.#resouceSaved) {
                newRow.addComponents(
                    new MessageButton()
                        .setCustomId('save')
                        .setLabel('Saved')
                        .setStyle('SECONDARY')
                )
            } else {
                newRow.addComponents( 
                    new MessageButton()
                        .setLabel('Save')
                        .setCustomId('save')
                        .setStyle('PRIMARY')
                    )
            }

            embedArray.push(this.#resourceEmbed)
            newRow.addComponents(
                new MessageButton()
                    .setCustomId('return_to_provider')
                    .setLabel('Back to provider.')
                    .setStyle('SECONDARY')
            )
        }

        if(this.#resourceNameList.length > 0) {
            let resouceOptions = [];
            for(let i = 0; i < this.#resourceNameList.length; i++) {
                resouceOptions.push({
                    label: this.#resourceNameList[i].title + " | " + this.#resourceNameList[i].type,
                    value: this.#resourceNameList[i].title
                })
            }

            let resourceSelectRow = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('resourceSelectMenu')
                        .setPlaceholder('View one this provider\'s resources.')
                        .setOptions(resouceOptions)
                )

            comps.push(resourceSelectRow)
        }

        comps.push(newRow)

        this.message.edit({
            components: comps,
            embeds: embedArray,
        })
    }

    interactionReply(interaction) {
        interaction.reply({
            content: 'Button Clicked',
            fetchReply: true,
        }).then(msg => {
            msg.delete()
        })
    }

    removeMessage () {
        if(typeof this.message !== 'undefined') {
            this.message.delete()
        }
    }

    get title () {
        return this.embedData.title
    }

    #saved = false;
    isSaved(saveData) {
        if(typeof saveData === 'undefined') {
            return false
        }

        for(let i = 0; i < saveData.length; i++){
            if(saveData[i] == this.embedData.title) {
                this.#saved = true
            }
        }
        return this.#saved
    }
}

const canAddNew = async (guild, userID) => {

    const guildSettings = await GuildSettings.findOne({guild_id: guild.id})
    const approvedRoles = guildSettings.resourceAdder
    if(!approvedRoles) {
        console.log('Failed to find roles apporved to add resources.')
        return false
    }

    let i = 0;
    let canAdd = false;
    let member = guild.members.cache.get(userID)
    while(!canAdd && i < approvedRoles.length) {
        if(member.roles.cache.has(approvedRoles[i])) {
            canAdd = true;
        }
        i++;
    }
    
    return canAdd
}

module.exports = ResourceObject;