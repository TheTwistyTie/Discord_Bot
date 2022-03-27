const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const buildPreviewEmbed = require("../../add_provider/helpers/buildPreviewEmbed");
const createResource = require("../../add_provider/helpers/createProvider");
const EmbedInfo = require('../../add_provider/helpers/EmbedInfo')
const UserData = require('../../../../models/User');
const GuildSettings = require('../../../../models/GuildSettings')
const Resources = require('../../../../models/Resource')

class ResourceObject {
    #userData
    #guild

    embedData
    #fullEmbed
    #previewEmbed
    #index

    #resourceNameList

    #resourceEmbed
    #resouceSaved = false;
    #resourceName
    #resourceType

    constructor (embedObject, index, guild) {
        this.embedData = embedObject.data.embedData
        this.#resourceNameList = embedObject.resources
        this.#index = index;
        this.#guild = guild

        if(typeof this.embedData.previewEmbed === 'undefined') {
            this.#previewEmbed = buildPreviewEmbed(embedObject.data.embedData)
        } else {
            this.#previewEmbed = embedObject.data.previewEmbed
        } 

        this.#fullEmbed = embedObject.data.fullEmbed;
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

        if(canAddNew(this.#guild, this.#userData.id)) {
            row.addComponents(
                new MessageButton()
                    .setLabel('Edit Resource')
                    .setCustomId('edit')
                    .setStyle('DANGER')
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
                            this.#userData.savedProvider.splice(index, 1);
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
                    embedDataObj.setData(this.embedData, this.#index)
                    createResource(this.embedData.resourceType, btn, embedDataObj.Guild, embedDataObj)
                    break;

                case 'resourceSelectMenu' :
                    this.showingResourceEmbed = true;

                    if(this.showingResourceEmbed) {
                        let resourceList = await Resources.find({guild_id: this.#guild.id})

                        let resource;
                        for(let i = 0; i < resourceList.length; i++) {
                            if(typeof resourceList[i].data.embedData.providerName !== 'undefined') {
                                if(resourceList[i].data.embedData.providerName == this.embedData.title) {
                                    if(resourceList[i].data.embedData.title == btn.values[0]) {
                                        resource = resourceList[i]
                                    }
                                }
                            }
                        }

                        this.#resourceEmbed = resource.data.fullEmbed;
                        this.#resourceName = resource.data.embedData.title;
                        this.#resourceType = resource.data.embedData.resourceType;

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
            }
        })
    }

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
            } else {
                embedArray.push(this.#previewEmbed)
                newRow.addComponents( 
                    new MessageButton()
                        .setLabel('See More:')
                        .setCustomId('toggle_view')
                        .setStyle('PRIMARY')
                    )
            }

            if(canAddNew(this.#guild, this.#userData.id)) {
                newRow.addComponents(
                    new MessageButton()
                        .setLabel('Edit Resource')
                        .setCustomId('edit')
                        .setStyle('DANGER')
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