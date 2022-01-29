const {MessageActionRow, MessageButton} = require("discord.js");
const buildPreviewEmbed = require("../addResourceHelpers/buildPreviewEmbed");
const UserData = require('../../models/User');

class ResourceObject {
    embedData
    #fullEmbed
    #previewEmbed
    #userData

    constructor (embedObject) {
        this.embedData = embedObject.embedData

        if(typeof this.embedData.previewEmbed === 'undefined') {
            this.#previewEmbed = buildPreviewEmbed(embedObject.embedData)
        } else {
            this.#previewEmbed = embedObject.previewEmbed
        } 

        this.#fullEmbed = embedObject.fullEmbed;
    }

    message;
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

        let showingFullEmbed = false
        btnCollector.on('collect', async (btn) => {
            switch (btn.customId) {
                case 'toggle_view':
                    if(!showingFullEmbed) {
                        showingFullEmbed = true;
                    } else {
                        showingFullEmbed = false;
                    }
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
                    break;
            }

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
            if(showingFullEmbed) {
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

            this.message.edit({
                components: [newRow],
                embeds: embedArray,
            })

            btn.reply({
                content: 'Button Clicked',
                fetchReply: true,
            }).then(msg => {
                msg.delete()
            })
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