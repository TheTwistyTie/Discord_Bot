const {MessageActionRow, MessageButton} = require("discord.js");
const buildPreviewEmbed = require("../../add_resource/helpers/buildPreviewEmbed");
const createResource = require("../../add_resource/helpers/createResource");
const EmbedInfo = require('../../add_resource/helpers/EmbedInfo')
const UserData = require('../../../../models/User');

class ResourceObject {
    embedData
    #fullEmbed
    #previewEmbed
    #userData
    #index

    constructor (embedObject, index) {
        this.embedData = embedObject.embedData
        this.#index = index;

        if(typeof this.embedData.previewEmbed === 'undefined') {
            this.#previewEmbed = buildPreviewEmbed(embedObject.embedData)
        } else {
            this.#previewEmbed = embedObject.previewEmbed
        } 

        this.#fullEmbed = embedObject.fullEmbed;
    }

    message;
    showingFullEmbed = false;
    async addMessage (channel, userId) {
        if(!this.#userData) {
            this.#userData = await UserData.findOne({id: userId})

            if(!this.#userData) {
                this.#userData = new UserData({
                    id: userId,
                    name: btn.user.name,
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
                new MessageButton()
                    .setLabel('See More:')
                    .setCustomId('toggle_view')
                    .setStyle('PRIMARY'),
                saveButton,
            )

        if(true /* Test for role here */) {
            row.addComponents(
                new MessageButton()
                    .setLabel('Edit Resource')
                    .setCustomId('edit')
                    .setStyle('DANGER')
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
                    if(this.#saved) {
                        const index = this.#userData.savedResources.indexOf(this.embedData.title);
                        this.#userData.savedResources.splice(index, 1);
                    } else {
                        if(typeof this.#userData.savedResources === 'undefined') {
                            this.#userData.savedResources = []
                        }
                        this.#userData.savedResources.push(this.embedData.title)
                    }

                    this.#saved = !this.#saved

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
            }
        })
    }

    refreshMessage() {
        let saveButton;
        if(this.#saved){
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

        let viewToggleButton
        let embedArray = []
        if(this.showingFullEmbed) {
            embedArray.push(this.#fullEmbed)
            viewToggleButton = new MessageButton()
                .setLabel('See Less:')
                .setCustomId('toggle_view')
                .setStyle('PRIMARY')
        } else {
            embedArray.push(this.#previewEmbed)
            viewToggleButton = new MessageButton()
                .setLabel('See More:')
                .setCustomId('toggle_view')
                .setStyle('PRIMARY')
        }

        const newRow = new MessageActionRow()
            .addComponents(
                viewToggleButton,
                saveButton
            )

        if(true /* Test for role here */) {
            newRow.addComponents(
                new MessageButton()
                    .setLabel('Edit Resource')
                    .setCustomId('edit')
                    .setStyle('DANGER')
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

    #saved = false;
    isSaved(saveData) {
        if(typeof saveData === 'undefined') {
            return false
        }

        for(i = 0; i < saveData.length; i++){
            if(saveData[i] == this.embedData.title) {
                this.#saved = true
            }
        }
        return this.#saved
    }
}

module.exports = ResourceObject;