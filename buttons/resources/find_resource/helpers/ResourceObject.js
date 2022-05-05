const {MessageActionRow, MessageButton} = require("discord.js");
const buildPreviewEmbed = require("../../add_resource/helpers/buildPreviewEmbed");
const buildEmbed = require("../../add_resource/helpers/buildEmbed");
const buildProviderEmbed = require('../../../providers/add_provider/helpers/buildEmbed')
const createResource = require("../../add_resource/helpers/createResource");
const EmbedInfo = require('../../add_resource/helpers/EmbedInfo')
const UserData = require('../../../../models/User');
const GuildSettings = require('../../../../models/GuildSettings');
const Providers = require('../../../../models/Providers');
const rateResource = require("./rateResource");
const seeRatings = require("./seeRatings");

class ResourceObject {
    #userData
    #index
    #guild

    embedData
    #fullEmbed
    #previewEmbed
    #ratings
    #saved = false;

    #providerEmbed
    #providerName
    #providerSaved

    constructor (embedObject, index, guild) {
        this.embedData = embedObject.data
        this.#index = index;
        this.#guild = guild

        this.#previewEmbed = buildPreviewEmbed(embedObject.data)
        this.#fullEmbed = buildEmbed(embedObject.data)

        this.#ratings = embedObject.ratings;
    }

    message;
    showingFullEmbed = false;
    showingProviderEmbed = false;
    async addMessage (channel, userId) {
        if(!this.#userData) {
            this.#userData = await UserData.findOne({id: userId})

            if(!this.#userData) {
                this.#userData = new UserData({
                    id: userId,
                    //name: btn.user.name,
                    savedResources: [],
                })
            }
        }

        let saveButton;
        if(this.isSaved(this.#userData.savedResources)) {
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

        if(typeof this.embedData.providerName !== 'undefined') {
            row.addComponents(
                new MessageButton()
                    .setLabel('See Provider')
                    .setCustomId('viewProvider')
                    .setStyle('PRIMARY')
            )
        }

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

        this.message = await channel.send({
            content: this.embedData.title + ':',
            embeds: [this.#previewEmbed],
            components: [row],
            fetchReply: true,
        })

        const filter = (int) => {
            return int.user.id == userId;
        }

        const btnCollector = this.message.createMessageComponentCollector({
            filter,
        })

        btnCollector.on('collect', async (btnInteraction) => {
            switch (btnInteraction.customId) {
                case 'toggle_view':
                    if(!this.showingFullEmbed) {
                        this.showingFullEmbed = true;
                    } else {
                        this.showingFullEmbed = false;
                    }
                    this.refreshMessage()
                    this.interactionReply(btnInteraction)
                    break;
                case 'save' :
                    if(this.showingProviderEmbed) {
                        if(this.#providerSaved) {
                            const index = this.#userData.savedProviders.indexOf(this.#providerName);
                            this.#userData.savedProviders.splice(index, 1);
                        } else {
                            if(typeof this.#userData.savedProviders == 'undefined') {
                                this.#userData.savedProviders = []
                            }
                            this.#userData.savedProviders.push(this.#providerName)
                        }

                        this.#providerSaved = !this.#providerSaved
                    } else {
                        if(this.#saved) {
                            const index = this.#userData.savedResources.indexOf(this.embedData.title);
                            this.#userData.savedResources.splice(index, 1);
                        } else {
                            if(typeof this.#userData.savedResources === 'undefined') {
                                this.#userData.savedResources = []
                            }
                            this.#userData.savedResources.push({
                                title: this.embedData.title,
                                type: this.embedData.resourceType
                            })
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
                    this.interactionReply(btnInteraction)
                    break;
                case 'edit' :
                    let embedDataObj = new EmbedInfo()
                    embedDataObj.setData(this.embedData, this.#index)
                    createResource(this.embedData.resourceType, btnInteraction, embedDataObj.Guild, embedDataObj)
                    break;
                case 'viewProvider' :
                    this.showingProviderEmbed = !this.showingProviderEmbed;

                    if(this.showingProviderEmbed) {
                        if(typeof this.#providerEmbed == 'undefined') {
                        
                            let providers = await Providers.find({guild_id: this.#guild.id})
                            let providerEntry;

                            providers.forEach(provider => {
                                if(provider.data.title == this.embedData.providerName) {
                                    providerEntry = provider
                                }
                            })

                            this.#providerEmbed = buildProviderEmbed(providerEntry.data)
                            this.#providerName = providerEntry.data.title

                            let savedProviders = this.#userData.savedProviders
                            for(let i = 0; i < savedProviders.length; i++) {
                                if(savedProviders[i] == this.#providerName) {
                                    this.#providerSaved = true;
                                }
                            }
                        }
                    }

                    this.refreshMessage()
                    this.interactionReply(btnInteraction)
                    break;
                case 'rateResource' :
                    rateResource(btnInteraction, this.embedData, this.#guild)
                    break;
                case 'seeRatings' :
                    seeRatings(btnInteraction, this.#ratings)
                    break;
            }
        })
    }

    /*
        this message has
        base: 5 buttons
        see more: 5 buttons
    */

    async refreshMessage() {
        let embedArray = []

        const newRow = new MessageActionRow()

        if(!this.showingProviderEmbed) {
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

                if(await canAddNew(this.#guild, this.#userData.id)) {
                    newRow.addComponents(
                        new MessageButton()
                            .setLabel('Edit Resource')
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

                newRow.addComponents(
                    new MessageButton()
                        .setLabel('Rate Resource')
                        .setCustomId('rateResource')
                        .setStyle('SUCCESS')
                )
            }

            if(typeof this.embedData.providerName !== 'undefined') {
                newRow.addComponents(
                    new MessageButton()
                        .setLabel('Show Provider')
                        .setCustomId('viewProvider')
                        .setStyle('PRIMARY')
                )
            }

            if(this.#ratings.length >= 1) {
                newRow.addComponents(
                    new MessageButton()
                        .setLabel('See Reviews')
                        .setCustomId('seeRatings')
                        .setStyle('PRIMARY')
                )
            }

            
        } else {
            embedArray.push(this.#providerEmbed)

            if(this.#providerSaved){
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

            newRow.addComponents(
                new MessageButton()
                    .setLabel('Hide Provider')
                    .setCustomId('viewProvider')
                    .setStyle('PRIMARY')
                )
        }

        this.message.edit({
            components: [newRow],
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

    isSaved(saveData) {
        if(typeof saveData === 'undefined') {
            return false
        }

        for(i = 0; i < saveData.length; i++){
            if(saveData[i].title == this.embedData.title) {
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